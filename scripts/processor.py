import colorlog
import luadata
import re
import redis
import os
import sys

from redis.commands.search.field import TextField
from redis.commands.search.indexDefinition import IndexDefinition, IndexType

# from redis.commands.search.query import NumericFilter, Query
from redis.commands.json.path import Path

ignore_props = ["custom", "teleport2roomnames", "teleport2greedroomnames"]

data = {}
host = os.getenv("REDIS_URL", "localhost")
port = os.getenv("REDIS_PORT", 6379)

handler = colorlog.StreamHandler()

logger = colorlog.getLogger("processor")
logger.addHandler(handler)
logger.setLevel(os.getenv("LOG_LEVEL", colorlog.DEBUG))

handler.setFormatter(
    colorlog.ColoredFormatter("%(log_color)s%(levelname)s:%(name)s:%(message)s")
)


def get_path_cli(args: tuple, path: str):
    if len(args) > 1:
        _, input = args
        return path + f"/{input}", True

    raise Exception(f"Insira a lingua que você deseja popular os dados... {os.listdir(path)}")


def main():
    try:
        data_raw_path = "data/raw"

        r = redis.Redis(host=host, port=port, decode_responses=True)
        pipe = r.pipeline()
        schema = (TextField("$.title", as_name="title"),)

        for dir in os.listdir(data_raw_path):
            language = dir.lower()
            dir_path = f"{data_raw_path}/{language}"
            
            logger.info(f"Criando indice '{language}:items'")
            r.ft(f"{language}:items").create_index(
                schema,
                definition=IndexDefinition(prefix=[f"{language}:items:"], index_type=IndexType.JSON),
            )
            for file in os.listdir(dir_path):
                full_path = f"{dir_path}/{file.lower()}"
                
                logger.info(f"Lendo o arquivo: {full_path}")
                with open(full_path, encoding="utf-8") as f:
                    content = f.read()

                    # Remove espaços antes e depois do sinal de 'igual'
                    sanitized = re.sub(r"\s*=\s*", "=", content)

                    # Remove comentários
                    sanitized = re.sub(r"-{2,}.*", "", sanitized)

                    # Substitui o nome do objeto 'EID.descriptions[languageCode].<nome>' para apenas '<nome>'
                    sanitized = re.sub(r"(?:EID.*\.)?(\w+)=", r"\1=", sanitized)

                    # Remove todos os objetos com prefixo 'EID.descriptions[languageCode]'
                    sanitized = re.sub(r"EID\..*", "", sanitized)
                    sanitized = re.sub(r"\[\d+\]=", "", sanitized)

                    # Troca os elementos de um array por elementos de um objeto (hash table)
                    sanitized = re.sub(
                        r"(\".*\")\s?,\s?(\".*\")\s?,\s?(\".*\")\s?",
                        r"id=\1,title=\2,description=\3",
                        sanitized,
                    )

                    # Procura todos os objetos
                    items = re.finditer(r"(\w+)={", sanitized)
                    for item in items:
                        for group in item.groups():
                            item_category = group.lower().replace("rep", "")
                            logger.name = f"processor:[{full_path}:{item_category}]"

                            # Procura o colchetes final do objeto
                            search = re.search(
                                r"\n?}$",
                                sanitized[item.end() - 1 :],
                                flags=re.MULTILINE,
                            )
                            if (
                                item_category != ""
                                and item_category not in ignore_props
                                and search is not None
                            ):
                                str_searched = search.string
                                # Procura a posição inicial do '{' depois do objeto do slice
                                start = str_searched.find("{")

                                # Procura a posição final do '}'
                                end = search.end()

                                # Converte para python a hash table em lua
                                logger.debug(
                                    "Parseando a hash table em lua para array/objeto em python"
                                )

                                deserialized = list(
                                    filter(
                                        lambda it: type(it) is dict and "title" in it,
                                        luadata.unserialize(
                                            str_searched[start:end], multival=False
                                        ),
                                    )
                                )

                                logger.debug(
                                    "Transformando o objeto desserializado em dicionário"
                                )
                                table = {t["id"]: t for t in deserialized}

                                if "en" not in full_path:
                                    old_table = data[item_category]
                                    for EID in list(table.values()):
                                        if EID["id"] in old_table:
                                            EID["title"] = old_table[EID["id"]]["title"]
                                        else:
                                            EID["title"] = ""

                                logger.info(
                                    "Foram encontrados %d objetos", len(table.keys())
                                )
                                logger.debug("Fazendo o merge dos dicionários")
                                data[item_category] = (
                                    data[item_category] | table
                                    if item_category in data
                                    else table
                                )

                                logger.info(f"Criando o indice '{language}:items:{item_category}'")
                                pipe.ft(f"{language}:items:{item_category}").create_index(
                                    schema,
                                    definition=IndexDefinition(
                                        prefix=[f"{language}:items:{item_category}:"],
                                        index_type=IndexType.JSON,
                                    ),
                                )

                                logger.info(
                                    f"Populando os dados do dicionário: '{item_category}'"
                                )

                                for value in data[item_category].values():
                                    if value["title"] == "":
                                        value["title"] = value["id"]

                                    redis_key = re.sub(
                                        r"[\+'\"+]+", "", value["title"].lower()
                                    )
                                    pipe.json().set(
                                        f"{language}:items:{item_category}:{redis_key}",
                                        Path.root_path(),
                                        value,
                                    )

        logger.name = "processor"
        pipe.execute()
    except redis.exceptions.ResponseError as err:
        (*arg,) = err.args

        if arg[0] == "Index already exists":
            logger.error("Este índice já criado então a execução será abortada.")
            raise
        else:
            logger.warning(
                "Este índice já criado mas a mensagem de erro pode ser ignorada."
            )
    except:
        raise


main()
