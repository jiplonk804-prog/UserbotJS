const spinnerFrames = ["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"];
let spinnerIndex = 0;
let interval;

function clearLine() {
  process.stdout.write("\r\x1b[K");
}

function startSpinner(text = "Bot running") {
  if (interval) return; 

  interval = setInterval(() => {
    const frame = spinnerFrames[spinnerIndex % spinnerFrames.length];
    spinnerIndex++;
    clearLine();
    process.stdout.write(`${frame} ${text}`);
  }, 100);
}

function stopSpinner(finalText = "Bot started") {
  if (!interval) return;
  clearInterval(interval);
  interval = null;
  clearLine();
  console.log(`✅ ${finalText}`);
}

module.exports = { startSpinner, stopSpinner };