// =============================================================================
// Registering Slash Commands for Discord Bot
// =============================================================================
// This script registers slash commands for a Discord bot using the Discord.js library.
// Ensure you have the necessary environment variables set in your .env file.
// Define the commands to be registered
// Format
// { name: "command_name", description: "Command description", options: [...] }
//
// =============================================================================
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
  {
    name: "image",
    description: "Generate an image using AI",
    options: [
      {
        name: "description",
        type: 3,
        description: "Description of the image to generate",
        required: true,
      },
    ],
  },
  {
    name: "pastevents",
    description: "View past events of KEC Computer Club",
  },
  {
    name: "recentevents",
    description: "View recent or upcoming events of KEC Computer Club",
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
