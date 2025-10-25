const { Telegraf, Markup } = require("telegraf");
const settings = require("../../setting.js");
const JunNotDevs= new Telegraf(settings.token);
const botReady = new Promise(async (resolve) => {
  try {
    const info = await JunNotDevs.telegram.getMe();
    console.log(`Bot Is Running : @${info.username} | [ OK ]`);
    resolve(info.username);
  } catch (error) {
    console.error("Gagal mengaktifkan bot Telegraf:", error);
    process.exit(1);
  }
});

JunNotDevs.start(async (ctx) => {
  const firstName = ctx.from?.first_name || "ehmm nama kamu siapa?";
  await ctx.reply(`Halo Bang ${firstName}!`);
});

/*
BELUM SAAT NYA FILE INI DI GUNAKAN
*/


JunNotDevs.launch();
module.exports = { JunNotDevs, botReady };