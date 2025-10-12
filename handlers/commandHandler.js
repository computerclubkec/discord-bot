const fs = require("fs");
const path = require("path");
const { Collection } = require("discord.js");

function loadCommands(client) {
  client.commands = new Collection();
  const folders = path.join(__dirname, "../commands");

  for (const folder of fs.readdirSync(folders)) {
    const commandFiles = fs
      .readdirSync(path.join(folders, folder))
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const command = require(path.join(folders, folder, file));
      if ("data" in command && "execute" in command)
        client.commands.set(command.data.name, command);
    }
  }
}

module.exports = { loadCommands };
