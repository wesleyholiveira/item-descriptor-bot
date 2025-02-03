# 🎯 Molesker Item's Descriptor  

### 🔍 Bot para Twitch/YouTube que consulta os efeitos dos itens em *The Binding of Isaac* diretamente no chat!  

🚀 Utiliza as descrições do mod **[External Item Descriptions](https://github.com/wofsauge/External-Item-Descriptions)** para fornecer informações rápidas e precisas sobre os itens do jogo.  

📖 🇺🇸 [Read this README in English](README_EN.md)

---

## 📌 **Recursos**
✅ Integração com Twitch e YouTube.  
✅ Consulta instantânea dos efeitos dos itens.  
✅ Suporte a múltiplos idiomas.  
✅ Configuração simples via `.env`.  

---

## 🛠 **Como rodar o projeto?**  

### 🔹 **Usando Docker** (Método Recomendado)  
Apenas rode o comando:  
```sh
docker-compose up
```
Ou utilize os comandos abaixo manualmente:  
```sh
docker build -t <nome-da-imagem> .
docker run --expose 6379 redis/redis-stack-server:latest
docker run --expose 3000 <nome-da-imagem>-app --name 'twitch-bot'
docker run <nome-da-imagem>-redis-seed
```

### 🔹 **Rodando Standalone**  
1️⃣ Instale as dependências necessárias:  
- **Node.js 20**  
- **Python 3.10**  
- **Redis** com o módulo **RediSearch**  

2️⃣ Instale as dependências do projeto:  
```sh
npm i
pip install -r ./scripts/requirements.txt
```

3️⃣ Rode o processador de descrições:  
```sh
python ./scripts/processor.py pt-br
```

---

## ⚙ **Configurações**  
1️⃣ Copie o arquivo `.env.example` e renomeie para `.env`.  
2️⃣ Edite o arquivo `.env` e preencha as credenciais da Twitch e YouTube:  

```env
TWITCH_TOKEN=
TWITCH_USERNAME=
YOUTUBE_CLIENT_ID=
YOUTUBE_CLIENT_SECRET=
YOUTUBE_MSG_POOLING=5000
```

3️⃣ Caso queira usar outro idioma, crie uma nova pasta dentro de `data/raw` e insira os arquivos seguindo o modelo de **en/pt-br**:  

📂 **Exemplo de estrutura**:  
![Estrutura de arquivos](https://github.com/wesleyholiveira/item-descriptor-bot/assets/2742138/b033968d-1afe-44fa-8def-fe3fe7892ef1)  

4️⃣ Atualize o `.env` para definir o idioma desejado:  
```sh
DESCRIPTION_LANGUAGE=pt-br
```

---

## 🚀 **Contribuindo**  
Quer ajudar a melhorar o projeto? Siga estes passos:  
1️⃣ Faça um fork deste repositório.  
2️⃣ Crie uma branch para sua feature (`git checkout -b minha-feature`).  
3️⃣ Faça as alterações e faça um commit (`git commit -m "Minha contribuição"`).  
4️⃣ Envie um pull request!  

---

## 🏷 **Licença**  
Este projeto é open-source sob a licença **MIT**.  

📌 **Gostou do projeto?** 🌟 Deixe um ⭐ no repositório para ajudar na visibilidade!  

---

### 🔎 **Quer contribuir ou relatar um bug?**  
Sinta-se à vontade para abrir uma [issue](https://github.com/wesleyholiveira/item-descriptor-bot/issues) ou entrar em contato!
