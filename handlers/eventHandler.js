const fs = require("fs");
const path = require("path");

function loadEvents(client) {
  const events = path.join(__dirname, "../events");

  for (const file of fs.readdirSync(events).filter((f) => f.endsWith(".js"))) {
    const event = require(path.join(events, file));
    if (event.once) client.once(event.name, (...a) => event.execute(...a, client));
    else client.on(event.name, (...a) => event.execute(...a, client));
  }
}

module.exports = { loadEvents };
