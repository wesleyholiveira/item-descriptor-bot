FROM node:alpine AS bot

WORKDIR /usr/src/app

ENV REDIS_URL=redis

COPY . .
RUN npm install
CMD [ "npm", "start"]

FROM python:latest AS redis-seed

ENV REDIS_URL=redis
ENV LOG_LEVEL=error
ENV DESCRIPTION_LANGUAGE=pt-br

WORKDIR /app
COPY ./data/raw ./data/raw
COPY ./scripts ./scripts

RUN pip install --no-cache-dir -r ./scripts/requirements.txt
CMD python ./scripts/processor.py $DESCRIPTION_LANGUAGE