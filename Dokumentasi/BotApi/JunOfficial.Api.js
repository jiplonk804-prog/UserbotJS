

// == PING ERR CODE
const { startSpinner, stopSpinner } = require("./Asset.js");
// BOT API MENU
require("./MenuBot.js");

startSpinner();

// simulasi proses bot berjalan
setTimeout(() => {
  stopSpinner(" wait a moment, checking connection...");
}, 5000);