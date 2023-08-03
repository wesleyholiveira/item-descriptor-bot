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
### Docker
- Copy the **.env.example** file and rename it to **.env**
- Update the data in .env with your Twitch account tokens/client_id:
```
TWITCH_USERNAME=
TWITCH_TOKEN=
```
- If you want another language, create a new folder inside: *data/raw*, insert the files as previously created for **en/pt-br**:
- Update in **.env** the language you want to use:
`DESCRIPTION_LANGUAGE=en`

### Standalone
Modify the **index.mjs** file and replace the information in lines *9/10/15* with your Redis host and Twitch details.



