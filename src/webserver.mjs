import 'dotenv/config';
import express from 'express';
import YoutubeService from './services/youtube.service.mjs';
import TokenService from './services/token.service.mjs';

// Configurar Express
const app = express();
export const TKService = new TokenService('./tokens.json');
export const YTService = new YoutubeService(TKService);

app.get('/oauth2callback', async (req, res) => {
  const { query } = req;
  const { code } = query;

  if (code) {
    await TKService.setOAuth(code);
    res.send("Deu bom demaizi");
  } else {
    res.send('Nenhum código de autorização fornecido.');
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
