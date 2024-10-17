import { BANANA } from "../index.mjs";

const cache = {};

export default async (cmd, args, redisRepository) => {
	try {
		const itemName = `${args.join(' ').replace(/['"*+\-=!]+/g, '')}`;

		const items = await redisRepository.getItems(itemName);
		if (args.length < 1) {
			return {
				code: 0,
				msg: `Passagem de parâmetro é obrigatória, ex: !isaac ${cmd} <nome_do_item>`,
			};
		}

		const cacheKey = `${cmd}${BANANA.lang}${itemName};`;
		let matchedElement = cache[cacheKey];
		if (!cache[cacheKey] && !cacheKey !== "") {
			console.log(`Consulta com o item: '${itemName}' foi realizada do zero...`);
			
			matchedElement = items[0];
			if (matchedElement !== undefined) {
				cache[cacheKey] = matchedElement;
			}

			console.log('uepaaa', cache);
		} else {
			console.log('Obtendo resposta do cache interno...');
		}

		if (!matchedElement) {
			return {
				code: 1,
				msg: 'Nenhum item com este nome foi encontrado.',
			};
		}
	
		return {
			code: 2,
			msg: matchedElement,
		};
	} catch (err) {
		console.error(err);
	}
};
