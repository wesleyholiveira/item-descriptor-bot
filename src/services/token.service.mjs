import fs from 'node:fs';

export default class TokenService {
    constructor(path) {
        this.path = path;
    }

    loadTokens() {
        try {
            const tokens = JSON.parse(fs.readFileSync(this.path));
            return tokens;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    saveTokens(tokens) {
        fs.writeFileSync(this.path, JSON.stringify(tokens));
    }
}