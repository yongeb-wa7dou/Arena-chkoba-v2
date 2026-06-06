const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const { Telegraf, Markup } = require('telegraf');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const bot = new Telegraf(process.env.BOT_TOKEN);

// sert les fichiers du dossier public
app.use(express.static(path.join(__dirname, 'public')));

bot.start((ctx) => {
  // Railway te donnera l'URL après, on met un placeholder
  const url = 'https://arena-chkoba-v2-production.up.railway.app
  ctx.reply('Arena Chkoba Legends 🎮', Markup.inlineKeyboard([
    [Markup.button.webApp('🎮 Jouer vs IA', url)]
  ]));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Serveur en ligne sur', PORT));
bot.launch();