import * as Commands from '../commands/index.mjs';

export default class CommandService {
    constructor(redisClient) {
        this.redisClient = redisClient;
    }

    async parseMsg(message, callback) {
        const cmdArgs = message.toLowerCase().split(' ');
        const cmdString = cmdArgs[0]?.replace('!', '');

        const cmd = Commands[cmdString]?.default;
        if (!cmd) {
            return;
        }

        const result = await cmd(cmdString, cmdArgs.slice(1), this.redisClient);
        callback(result);
    }
}