import execCmd from '../../@shared/execCmd.mjs';
import * as SubCommands from './subcommands/index.mjs';
import RedisRepository from '../../repositories/redis.mjs';
import { BANANA } from '../../index.mjs';

export default async (name, args, redisClient) => {
	if (args.length >= 1) {
		const subcommand = args[0];
		const subCmd = SubCommands[subcommand]?.default;

		if (!subCmd) {
			const redisRepository = new RedisRepository(redisClient, `${BANANA.lang}:items`);
			const item = await execCmd(name, args, redisRepository);
			if (item.msg?.title !== undefined && item.msg?.description !== undefined) {
				return {
					code: item.code,
					msg: `Name: ${item.msg.title} / Effect: ${item.msg.description}`,
				};
			}

			return item.msg;
		}

		const redisRepository = new RedisRepository(redisClient, `${BANANA.lang}:items:${subcommand}`);
		const subItem = await subCmd(subcommand, args.slice(1), redisRepository);
		if (subItem.msg?.title !== undefined && subItem.msg?.description !== undefined) {
			return {
				code: subItem.code,
				msg: `Name: ${subItem.msg.title} / Effect: ${subItem.msg.description}`,
			};
		}

		return subItem.msg;
	}

	return 'Nenhum parâmetro foi encontrado.';
};
