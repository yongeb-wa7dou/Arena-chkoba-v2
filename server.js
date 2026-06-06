const express = require('express');
const path = require('path');
const http = require('http');
const { Telegraf, Markup } = require('telegraf');

const app = express();
const server = http.createServer(app);

app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('Web OK sur ' + PORT);
});

try {
  const bot = new Telegraf(process.env.BOT_TOKEN);
  bot.start((ctx) => {
    const url = 'https://arena-chkoba-v2-production.up.railway.app';
    ctx.reply('Arena Chkoba 🎮', Markup.inlineKeyboard([
      [Markup.button.webApp('🎮 Jouer vs IA', url)]
    ]));
  });
  bot.launch();
  console.log('Bot lancé');
} catch (e) {
  console.log('Bot error:', e.message);
}