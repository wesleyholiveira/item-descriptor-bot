/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-cycle */
import 'dotenv/config';
import { createClient } from 'redis';
import tmi from 'tmi.js';
import formatItemMessage from './@shared/formatItemMessage.mjs';
import CommandService from './services/command.service.mjs';
import formatItemMessageYT from './@shared/formatItemMessageYT.mjs';
import * as WebServer from './webserver.mjs';


export const BANANA = {
	lang: process.env?.DESCRIPTION_LANGUAGE ?? "pt-br"
}

const run = async () => {
	try {
		const url = `redis://${process.env.REDIS_URL}:${process.env.REDIS_PORT}`;
		const username = process.env.TWITCH_USERNAME;
		const twtClient = new tmi.Client({
			options: { debug: true },
			identity: {
				username,
				password: process.env.TWITCH_TOKEN,
			},
			channels: [username],
		});
		const redisClient = createClient({
			database: 0,
			url,
		});
		const commandService = new CommandService(redisClient);

		await twtClient.connect();
		await redisClient.connect();

		redisClient.clientTracking(true);
		redisClient.on('error', (err) => {
			console.error(err);
		});

		twtClient.on('message', async (channel, tags, message, self) => {
			// Ignore echoed messages.
			if (self) return;

			await commandService.parseMsg(message, (parsedMsg) => twtClient.say(
					username,
					formatItemMessage(parsedMsg)
				)
			);
		});

		setInterval(async () => {
			const message = await WebServer.YTService.getCurrentMsg();

			if (message) {
				await commandService.parseMsg(message, (parsedMsg) => {
					WebServer.YTService.sendMessage(
						formatItemMessageYT(parsedMsg)
					)
				});
			}
		}, process.env?.YOUTUBE_MSG_POOLING ?? 10000);
	} catch (err) {
		// eslint-disable-next-line no-console
		console.log(err);
	}
};

run();
