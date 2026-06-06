const { Telegraf, Markup } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

const parties = {}; // userId -> partie

function newDeck(){
  const vals=[1,2,3,4,5,6,7,8,9,10];
  const suits=['♥','♦','♣','♠'];
  let d=[]; for(let s of suits) for(let v of vals) d.push({v,txt:`${v}${s}`});
  return d.sort(()=>Math.random()-0.5);
}

function showTable(p){ return p.table.map(c=>c.txt).join(' ') || 'vide'; }

bot.start(ctx=>{
  ctx.reply('Arena Chkoba - Solo 🎮', Markup.keyboard([['/jouer','/regles']]).resize());
});

bot.command('regles', ctx=> ctx.reply('Tu joues une carte. Si carte + une carte table = 10, tu ramasses. Si tu vides la table = CHKOBBA (+1 point).'));

bot.command('jouer', ctx=>{
  const d = newDeck();
  const partie = {
    table: d.splice(0,4),
    toi: { hand: d.splice(0,3), pris:[] },
    bot: { hand: d.splice(0,3), pris:[] },
    deck: d
  };
  parties[ctx.from.id] = partie;
  
  ctx.reply(`Table: ${showTable(partie)}\nTa main: ${partie.toi.hand.map(c=>c.txt).join(' ')}`,
    Markup.inlineKeyboard(partie.toi.hand.map((c,i)=>[Markup.button.callback(c.txt, `p_${i}`)]))
  );
});

bot.action(/p_(\d+)/, async ctx=>{
  const partie = parties[ctx.from.id];
  if(!partie) return ctx.answerCbQuery('Fais /jouer');

  const i = +ctx.match[1];
  const carte = partie.toi.hand.splice(i,1)[0];
  
  // ton coup
  let capture = partie.table.find(t=> t.v + carte.v === 10);
  let msg = `Tu joues ${carte.txt}. `;
  if(capture){
    partie.toi.pris.push(carte, capture);
    partie.table = partie.table.filter(t=>t!==capture);
    msg += `Tu prends ${capture.txt}! `;
    if(partie.table.length===0){ msg+='🔥 CHKOBBA! '; partie.toi.pris.push({txt:'CHKOBBA'}); }
  } else {
    partie.table.push(carte);
    msg += `Pas de prise. `;
  }

  // bot joue
  const bCarte = partie.bot.hand.shift();
  let bCap = partie.table.find(t=> t.v + bCarte.v === 10);
  if(bCap){
    partie.bot.pris.push(bCarte, bCap);
    partie.table = partie.table.filter(t=>t!==bCap);
    msg += `\nBot joue ${bCarte.txt} et prend ${bCap.txt}.`;
    if(partie.table.length===0) msg+=' Bot fait CHKOBBA!';
  } else {
    partie.table.push(bCarte);
    msg += `\nBot joue ${bCarte.txt}.`;
  }

  // pioche
  if(partie.deck.length>0){
    partie.toi.hand.push(partie.deck.shift());
    partie.bot.hand.push(partie.deck.shift());
  }

  await ctx.editMessageText(msg + `\n\nTable: ${showTable(partie)}\nTa main: ${partie.toi.hand.map(c=>c.txt).join(' ')}`);

  if(partie.toi.hand.length>0){
    ctx.reply('À toi:', Markup.inlineKeyboard(partie.toi.hand.map((c,idx)=>[Markup.button.callback(c.txt, `p_${idx}`)])));
  } else {
    const tesPoints = partie.toi.pris.filter(c=>c.txt==='CHKOBBA').length;
    const botPoints = partie.bot.pris.filter(c=>c.txt==='CHKOBBA').length;
    ctx.reply(`Fin de manche!\nToi: ${partie.toi.pris.length} cartes, ${tesPoints} chkobba\nBot: ${partie.bot.pris.length} cartes, ${botPoints} chkobba\n\n/jouer pour rejouer`);
  }
});

bot.launch();
console.log('Bot solo lancé');