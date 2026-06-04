const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply('Bienvenue sur Arena Chkoba Legends ! 🎮'));
bot.command('regles', (ctx) => ctx.reply('Chkobba : capture les cartes qui font 10, la chkobba = +1 point !'));
bot.command('jouer', (ctx) => ctx.reply('Le mode jeu arrive bientôt...'));

bot.launch();
console.log('Bot lancé');