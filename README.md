# Molesker Item's Descriptor
Bot para a twitch voltado para consultar os efeitos do **The Binding of Isaac** pelo chat utilizando as descrições do mod: https://github.com/wofsauge/External-Item-Descriptions

## Como rodar o projeto?
### Docker
Apenas rode o comando:
`docker-compose up`
**OU**
```
docker build -t <nome-da-imagem> .
docker run --expose 6379 redis/redis-stack-server:latest
docker run --expose 3000 <nome-da-imagem>-app --name 'twitch-bot'
docker run <nome-da-imagem>-redis-seed
```

### Standalone
- Instale o **Node 20**
- Instale o **Python 3.10**
- Instale o **Redis** com o módulo do **Redisearch**
- Instale as dependências do node e do python:
`npm i`
`pip install -r ./scripts/requirements.txt`

- Rode o **processor.py**:
`python ./scripts/processor.py pt-br`

## Configurações
- Copie o arquivo **.env.example** e renomeie para **.env**
- Altere os dados no **.env** com os tokens/client_id da sua conta na Twitch:
```
TWITCH_USERNAME=
TWITCH_TOKEN=
```
- Caso queira uma outra lingua crie uma pasta nova dentro de: *data/raw*, insira os arquivos conforme foi previamente criado para **en/pt-br**:

![Captura de tela 2023-08-03 015947](https://github.com/wesleyholiveira/item-descriptor-bot/assets/2742138/b033968d-1afe-44fa-8def-fe3fe7892ef1)

- Atualize no **.env** para a linguagem que deseja:
`DESCRIPTION_LANGUAGE=pt-br`

