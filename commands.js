const { REST, Routes } = require("discord.js");
require("dotenv").config();

const rest = new REST({ version: 10 }).setToken(process.env.TOKEN);

const commands = [
  {
    name: "ping",
    description: "Ping the bot",
  },
  {
    name: "stats",
    description: "View server stats",
  },
];

async function registerCommand() {
  await rest.put(
    Routes.applicationGuildCommands(
      process.env.CLIENT_ID,
      process.env.GUILD_ID
    ),
    { body: commands }
  );
}

registerCommand();
