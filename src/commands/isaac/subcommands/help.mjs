// eslint-disable-next-line import/no-cycle
import * as cmds from './index.mjs';

// eslint-disable-next-line no-unused-vars
export default (name, _) => ({
	code: 0,
	msg: `Os seguintes comandos para: '!isaac ${name}' estão disponíveis: ${Object.keys(cmds).join(
		' / '
	)} <nome_do_item>. Instale o 7tv para uma melhor experiência: https://7tv.app`,
});
