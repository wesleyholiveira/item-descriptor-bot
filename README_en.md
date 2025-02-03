# Molesker Item's Descriptor
Bot for Twitch focused on querying Isaac's effects through chat using descriptions from the mod: https://github.com/wofsauge/External-Item-Descriptions

## How to run the project?
### Docker
Simply run the command:
`docker-compose up`

```
docker build -t <image-name> .
docker run --expose 6379 redis/redis-stack-server:latest
docker run --expose 3000 <image-name>-app --name 'twitch-bot'
docker run <image-name>-redis-seed
```

### Standalone
- Install **Node 20**
- Install **Python 3.10**
- Install **Redis** with **Redisearch** module
- Install Node and Python dependencies:
```
npm i
pip install -r ./scripts/requirements.txt
```

- Run *processor.py*:
`python ./scripts/processor.py pt-br`

## Configurations
- Copy the **.env.example** file and rename it to **.env**
- Update the data in .env with your Twitch account tokens/client_id:
```
TWITCH_TOKEN=
TWITCH_USERNAME=
YOUTUBE_CLIENT_ID=
YOUTUBE_CLIENT_SECRET=
YOUTUBE_MSG_POOLING=5000
```
- If you want another language, create a new folder inside: *data/raw*, insert the files as previously created for **en/pt-br**:

![Captura de tela 2023-08-03 015947](https://github.com/wesleyholiveira/item-descriptor-bot/assets/2742138/b033968d-1afe-44fa-8def-fe3fe7892ef1)

- Update in **.env** the language you want to use:
`DESCRIPTION_LANGUAGE=en`



