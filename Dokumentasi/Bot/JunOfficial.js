/*
NO ENC SAYANG 
*/

const path = require("path");
const { Markup } = require("telegraf");
const axios = require("axios");
const settings = require(path.join(__dirname, "..", "..", "setting.js"));

module.exports = (bot, meta = {}) => {
  (async () => {
    const me = await bot.telegram.getMe().catch(() => ({}));
    const botUser = me.username || "bot";
    const ownerId = String(meta.ownerId || settings.ownerId || "");
    const sessions = new Map();

    const escape = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const isOwner = (ctx) => String(ctx.from?.id) === ownerId;
    const replyNotOwner = (ctx) => ctx.replyWithHTML("<blockquote>❌ This command is for the bot owner only.</blockquote>");

    const generateMainMenu = () => ({
      text: `<b>Welcome to the Bot Control Panel!</b>\n\n<blockquote>Use the buttons below to manage the bot <b>@${escape(botUser)}</b>.</blockquote>`,
      extra: {
        parse_mode: "HTML",
        reply_markup: Markup.inlineKeyboard([
          [Markup.button.callback("📊 Bot Status", "status")],
          [Markup.button.callback("👤 Profile Settings", "profile_settings")],
          [Markup.button.callback("⚙️ Command Settings", "command_settings")],
        ]).reply_markup,
      },
    });

    const generateProfileMenu = () => ({
      text: "<b>👤 Bot Profile Settings</b>\n\n<blockquote>Select a profile property to modify.</blockquote>",
      extra: {
        parse_mode: "HTML",
        reply_markup: Markup.inlineKeyboard([
          [Markup.button.callback("✏️ Set Name", "set_name")],
          [Markup.button.callback("📄 Set Bio", "set_bio")],
          [Markup.button.callback("📜 Set Short Bio", "set_short_bio")],
          [Markup.button.callback("🖼️ Set Profile Photo", "set_pp_prompt")],
          [Markup.button.callback("🔙 Back to Main Menu", "main_menu")],
        ]).reply_markup,
      },
    });

    const startAndMenuHandler = async (ctx) => {
        const { text, extra } = generateMainMenu();
        if (ctx.callbackQuery) {
            try { await ctx.editMessageText(text, extra); } catch (e) {}
        } else {
            await ctx.replyWithHTML(text, extra);
        }
    };

    bot.start(startAndMenuHandler);
    bot.command("menu", startAndMenuHandler);
    bot.action("main_menu", startAndMenuHandler);

    bot.command("ping", async (ctx) => {
      const start = Date.now();
      const sent = await ctx.replyWithHTML("<blockquote>⏳ Measuring response time...</blockquote>");
      const diff = Date.now() - start;
      await ctx.telegram.editMessageText(ctx.chat.id, sent.message_id, undefined, `<blockquote>🏓 <b>Pong!</b>\nResponse received in <b>${diff} ms</b>.</blockquote>`, { parse_mode: "HTML" });
    });

    bot.command("id", (ctx) => {
      const from = ctx.from || {};
      const chat = ctx.chat || {};
      let response = `<b>User Information</b>\n`;
      response += `<blockquote>`;
      response += `<b>Name:</b> ${escape(from.first_name || "-")}\n`;
      response += `<b>Your ID:</b> <code>${from.id}</code>\n`;
      if (from.username) response += `<b>Username:</b> @${escape(from.username)}\n`;
      response += `</blockquote>\n`;
      response += `<b>Chat Information</b>\n`;
      response += `<blockquote><b>Chat ID:</b> <code>${chat.id}</code></blockquote>`;
      ctx.replyWithHTML(response);
    });

    const setterActions = [
      { action: "set_name", step: "AWAITING_NAME", prompt: "Please send the new name for the bot." },
      { action: "set_bio", step: "AWAITING_BIO", prompt: "Please send the new bio/description for the bot." },
      { action: "set_short_bio", step: "AWAITING_SHORT_BIO", prompt: "Please send the new short description (appears on the profile)." },
      { action: "set_pp_prompt", step: "AWAITING_PP", prompt: "To set a new profile photo, please send a picture with the command <code>/setpp</code> as the caption, or reply to a picture with <code>/setpp</code>." },
      { action: "set_commands_prompt", step: "AWAITING_COMMANDS", prompt: "Please send the new command list in the format:\n<code>command1 - description 1\ncommand2 - description 2</code>" },
    ];

    setterActions.forEach(({ action, step, prompt }) => {
      bot.action(action, async (ctx) => {
        if (!isOwner(ctx)) return await ctx.answerCbQuery("Owner only.", { show_alert: true });
        sessions.set(String(ctx.from.id), { step });
        await ctx.editMessageText(`<blockquote><b>${prompt}</b></blockquote>`, {
          parse_mode: "HTML",
          reply_markup: Markup.inlineKeyboard([[Markup.button.callback("❌ Cancel", "cancel_action")]]).reply_markup,
        });
      });
    });

    bot.on("text", async (ctx) => {
      if (!isOwner(ctx)) return;
      const userId = String(ctx.from.id);
      const session = sessions.get(userId);
      if (!session || !ctx.message.text) return;

      const inputText = ctx.message.text.trim();
      sessions.delete(userId);

      try {
        switch (session.step) {
          case "AWAITING_NAME":
            await bot.telegram.setMyName(inputText);
            await ctx.replyWithHTML(`<blockquote>✅ Bot name successfully changed to: <b>${escape(inputText)}</b></blockquote>`);
            break;
          case "AWAITING_BIO":
            await bot.telegram.setMyDescription(inputText);
            await ctx.replyWithHTML(`<blockquote>✅ Bot bio successfully updated.</blockquote>`);
            break;
          case "AWAITING_SHORT_BIO":
            await bot.telegram.setMyShortDescription(inputText);
            await ctx.replyWithHTML(`<blockquote>✅ Bot short bio successfully updated.</blockquote>`);
            break;
          case "AWAITING_COMMANDS":
            const commands = inputText.split('\n').map(line => {
                const parts = line.split(' - ');
                return { command: parts[0].trim().toLowerCase(), description: parts[1] ? parts[1].trim() : "" };
            });
            await bot.telegram.setMyCommands(commands);
            await ctx.replyWithHTML(`<blockquote>✅ Bot commands have been successfully updated.</blockquote>`);
            break;
        }
      } catch (e) {
        await ctx.replyWithHTML(`<blockquote>❌ <b>Operation Failed.</b>\n\n<b>Error:</b> ${escape(e.message)}</blockquote>`);
      }
    });

    bot.action("cancel_action", async (ctx) => {
        sessions.delete(String(ctx.from.id));
        const { text, extra } = generateMainMenu();
        await ctx.editMessageText(text, extra);
    });

    bot.action("profile_settings", async (ctx) => {
        if (!isOwner(ctx)) return await ctx.answerCbQuery("Owner only.", { show_alert: true });
        const { text, extra } = generateProfileMenu();
        await ctx.editMessageText(text, extra);
    });

    bot.action("status", async (ctx) => {
      try {
        const meNow = await bot.telegram.getMe();
        const bioObj = await bot.telegram.getMyDescription();
        const shortBioObj = await bot.telegram.getMyShortDescription();
        const text = `
<b>📊 Current Bot Status</b>
<blockquote>
<b>Name:</b> ${escape(meNow.first_name)}
<b>Username:</b> @${escape(meNow.username)}
<b>Bio:</b> ${escape(bioObj?.description || "-")}
<b>Short Bio:</b> ${escape(shortBioObj?.short_description || "-")}
</blockquote>`;
        await ctx.editMessageText(text, {
          parse_mode: "HTML",
          reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback("🔄 Refresh", "status")],
            [Markup.button.callback("🔙 Back to Main Menu", "main_menu")],
          ]).reply_markup,
        });
      } catch (e) {
        await ctx.answerCbQuery(`❌ Failed: ${e.message}`, { show_alert: true });
      }
    });

    bot.action('command_settings', async (ctx) => {
        if (!isOwner(ctx)) return await ctx.answerCbQuery("Owner only.", { show_alert: true });
        const commands = await bot.telegram.getMyCommands();
        let text = "<b>📋 Command Settings</b>\n\n";
        if (commands.length > 0) {
            text += commands.map(c => `<blockquote><code>/${escape(c.command)}</code> - ${escape(c.description)}</blockquote>`).join('');
        } else {
            text += "<blockquote>ℹ️ No custom commands are currently set.</blockquote>";
        }
        await ctx.editMessageText(text, {
            parse_mode: "HTML",
            reply_markup: Markup.inlineKeyboard([
                [Markup.button.callback("✏️ Set All Commands", "set_commands_prompt")],
                [Markup.button.callback("🗑️ Clear All Commands", "clear_commands")],
                [Markup.button.callback("🔙 Back to Main Menu", "main_menu")]
            ]).reply_markup
        });
    });

    bot.action('clear_commands', async (ctx) => {
        if (!isOwner(ctx)) return await ctx.answerCbQuery("Owner only.", { show_alert: true });
        try {
            await bot.telegram.setMyCommands([]);
            await ctx.answerCbQuery("✅ All custom commands have been cleared.", { show_alert: true });
            const buttonCtx = { ...ctx, callbackQuery: { ...ctx.callbackQuery, data: 'command_settings' } };
            await bot.options.handler(buttonCtx);
        } catch (e) {
            await ctx.answerCbQuery(`❌ Failed: ${e.message}`, { show_alert: true });
        }
    });

    bot.command("setname", async (ctx) => {
      if (!isOwner(ctx)) return replyNotOwner(ctx);
      const name = ctx.message.text.split(" ").slice(1).join(" ").trim();
      if (!name) return ctx.replyWithHTML("<blockquote>⚠️ <b>Usage:</b> <code>/setname [new name]</code></blockquote>");
      try {
        await bot.telegram.setMyName(name);
        await ctx.replyWithHTML(`<blockquote>✅ Bot name changed to: <b>${escape(name)}</b></blockquote>`);
      } catch (e) {
        await ctx.replyWithHTML(`<blockquote>❌ <b>Failed to set name:</b> ${escape(e.message)}</blockquote>`);
      }
    });

    bot.command("setbio", async (ctx) => {
      if (!isOwner(ctx)) return replyNotOwner(ctx);
      const bio = ctx.message.text.split(" ").slice(1).join(" ").trim();
      if (!bio) return ctx.replyWithHTML("<blockquote>⚠️ <b>Usage:</b> <code>/setbio [new bio]</code></blockquote>");
      try {
        await bot.telegram.setMyDescription(bio);
        await ctx.replyWithHTML(`<blockquote>✅ Bot bio has been updated.</blockquote>`);
      } catch (e) {
        await ctx.replyWithHTML(`<blockquote>❌ <b>Failed to set bio:</b> ${escape(e.message)}</blockquote>`);
      }
    });

    bot.command("setshortbio", async (ctx) => {
      if (!isOwner(ctx)) return replyNotOwner(ctx);
      const shortbio = ctx.message.text.split(" ").slice(1).join(" ").trim();
      if (!shortbio) return ctx.replyWithHTML("<blockquote>⚠️ <b>Usage:</b> <code>/setshortbio [new short bio]</code></blockquote>");
      try {
        await bot.telegram.setMyShortDescription(shortbio);
        await ctx.replyWithHTML(`<blockquote>✅ Bot short bio has been updated.</blockquote>`);
      } catch (e) {
        await ctx.replyWithHTML(`<blockquote>❌ <b>Failed to set short bio:</b> ${escape(e.message)}</blockquote>`);
      }
    });

    const setProfilePhotoHandler = async (ctx) => {
        if (!isOwner(ctx)) return replyNotOwner(ctx);
        const message = ctx.message.reply_to_message || ctx.message;
        const photo = message.photo;

        if (!photo) {
            return ctx.replyWithHTML("<blockquote>⚠️ Please reply to a photo or send a photo with this command as the caption.</blockquote>");
        }
        
        const fileId = photo[photo.length - 1].file_id;
        const sentMsg = await ctx.replyWithHTML("<blockquote>⏳ Processing new profile photo...</blockquote>");

        try {
            const fileLink = await bot.telegram.getFileLink(fileId);
            const response = await axios.get(fileLink.href, { responseType: 'arraybuffer' });
            await bot.telegram.setMyProfilePhoto({ source: Buffer.from(response.data) });
            await ctx.telegram.editMessageText(ctx.chat.id, sentMsg.message_id, undefined, "<blockquote>✅ Bot profile photo successfully updated.</blockquote>", { parse_mode: "HTML" });
        } catch (e) {
            await ctx.telegram.editMessageText(ctx.chat.id, sentMsg.message_id, undefined, `<blockquote>❌ <b>Failed to update profile photo:</b> ${escape(e.message)}</blockquote>`, { parse_mode: "HTML" });
        }
    };

    bot.command("setpp", setProfilePhotoHandler);
    bot.on('photo', async (ctx, next) => {
        if (ctx.message.caption && ctx.message.caption.startsWith('/setpp')) {
            return setProfilePhotoHandler(ctx);
        }
        return next();
    });

    bot.command("setcommands", async (ctx) => {
      if (!isOwner(ctx)) return replyNotOwner(ctx);
      const text = ctx.message.text.split(" ").slice(1).join(" ").trim();
      if (!text) return ctx.replyWithHTML("<blockquote>⚠️ <b>Usage:</b> <code>/setcommands\ncommand1 - description 1\ncommand2 - description 2</code></blockquote>");
      try {
        const commands = text.split('\n').map(line => {
          const parts = line.split(' - ');
          return { command: parts[0].trim().toLowerCase(), description: parts[1] ? parts[1].trim() : "" };
        });
        await bot.telegram.setMyCommands(commands);
        await ctx.replyWithHTML(`<blockquote>✅ Bot commands have been successfully updated.</blockquote>`);
      } catch (e) {
        await ctx.replyWithHTML(`<blockquote>❌ <b>Failed to set commands:</b> ${escape(e.message)}</blockquote>`);
      }
    });

    bot.command("clearcommands", async (ctx) => {
      if (!isOwner(ctx)) return replyNotOwner(ctx);
      try {
        await bot.telegram.setMyCommands([]);
        await ctx.replyWithHTML(`<blockquote>✅ All custom commands have been cleared.</blockquote>`);
      } catch (e) {
        await ctx.replyWithHTML(`<blockquote>❌ <b>Failed to clear commands:</b> ${escape(e.message)}</blockquote>`);
      }
    });

  })();
};