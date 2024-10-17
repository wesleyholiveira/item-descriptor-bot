import 'dotenv/config';
import { createClient } from 'redis';
import tmi from 'tmi.js';
import formatItemMessage from './@shared/formatItemMessage.mjs';
import * as Commands from './commands/index.mjs';

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

		await twtClient.connect();
		await redisClient.connect();

		redisClient.clientTracking(true);
		redisClient.on('error', (err) => {
			console.error(err);
		});

		const sendMessage = (message) => twtClient.say(username, message);
		twtClient.on('message', async (channel, tags, message, self) => {
			// Ignore echoed messages.
			if (self) return;

			if (message.startsWith('!')) {
				const cmdArgs = message.toLowerCase().split(' ');
				const cmdString = cmdArgs[0]?.replace('!', '');

				const cmd = Commands[cmdString]?.default;
				if (!cmd) {
					return;
				}

				const result = await cmd(cmdString, cmdArgs.slice(1), redisClient);
				sendMessage(formatItemMessage(result));
			}
		});
	} catch (err) {
		console.log(err);
	}
};

run();
