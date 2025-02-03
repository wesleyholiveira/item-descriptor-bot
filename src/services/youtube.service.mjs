import 'dotenv/config';
import { google } from 'googleapis';
import open from 'open';
import { createHash } from 'node:crypto';

function createShaHash(data) {
    return createHash('sha256')
        .update(data)
        .digest('hex');
}

export default class YoutubeService {
    constructor(tokenService) {
        this.nextPageToken = undefined;
        this.prevMsgHash = "";
        this.oauth2Client = new google.auth.OAuth2(
            process.env.YOUTUBE_CLIENT_ID,
            process.env.YOUTUBE_CLIENT_SECRET,
            'http://localhost:3000/oauth2callback'
        );

        this.tokenService = tokenService;
    }


    generateUrl(params = {
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/youtube', 'https://www.googleapis.com/auth/youtube.readonly'],
        prompt: 'consent'
    }) {
        const { access_type, scope, prompt} = params;
        const tokens = this.tokenService.loadTokens();
        if (!tokens) {
            const url = this.oauth2Client.generateAuthUrl({
                access_type,
                scope,
                prompt
            });

            open(url);
            return url;
        }

        return null;
    }

    async setOAuth(code) {
        try {
            this.generateUrl();
            
            const { tokens } = await this.oauth2Client.getToken(code);
            this.oauth2Client.setCredentials(tokens);

            this.tokenService.saveTokens(tokens);

            return this.oauth2Client;
        } catch (error) {
            console.log('Erro ao obter tokens:', error);
            throw new Error('Ocorreu um erro ao obter os tokens');
        }
    }

    getOAuth() {
        const tokens = this.tokenService.loadTokens();
        if (!tokens) {
            this.generateUrl();
        }

        this.oauth2Client.setCredentials(tokens);
        return this.oauth2Client;
    }

    async getLiveChatId() {
        try {
          const youtube = google.youtube({ version: 'v3', auth: this.getOAuth() });
      
          const response = await youtube.liveBroadcasts.list({
            part: 'snippet',
            broadcastStatus: 'active',
          });
      
          const { data } = response;
          if (data.items && data.items.length > 0) {
            const liveBroadcast = response.data.items[0];
            const liveChatId = liveBroadcast.snippet.liveChatId;
            console.log('Live Chat ID:', liveChatId);
            return liveChatId;
          }

          return null;
        } catch (error) {
          console.error('Erro ao obter liveChatId:', error);
          return undefined;
        }
      }

    async sendMessage(message) {
        try {
            const liveChatId = await this.getLiveChatId();
            const youtube = google.youtube({ version: 'v3', auth: this.getOAuth() });

            await youtube.liveChatMessages.insert({
                part: 'snippet',
                requestBody: {
                    snippet: {
                        liveChatId,
                        type: 'textMessageEvent',
                        textMessageDetails: {
                            messageText: message,
                        },
                    },
                },
            });

            // console.log('Mensagem enviada com sucesso:', response.data);
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
        }
    }

    async getCurrentMsg() {
        const liveChatId = await this.getLiveChatId();
        const youtube = google.youtube({ version: 'v3', auth: this.getOAuth() });

        const result = await youtube.liveChatMessages.list({
            part: "id,snippet",
            liveChatId,
            nextPageToken: this.nextPageToken,
        });

        if (result.data.items && result.data.items.length > 0) {
            const { data } = result;
            const commandMsgs = data.items.filter((d) => d.snippet.displayMessage.startsWith("!"));
            const msg = commandMsgs[commandMsgs.length - 1];
            if (commandMsgs.length > 0) {
                const displayMessage = msg.snippet.displayMessage;
                const hashedMsg = createShaHash(displayMessage);

                if (this.prevMsgHash !== hashedMsg) {
                    this.nextPageToken = data.nextPageToken;
                    this.prevMsgHash = hashedMsg;
                    return displayMessage;
                }

                return null;
            }
        }
    }
}