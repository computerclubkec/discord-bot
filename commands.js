const { REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const commands = [];
const folders = path.join(__dirname, "commands");

for (const folder of fs.readdirSync(folders)) {
  const files = fs.readdirSync(path.join(folders, folder)).filter(f => f.endsWith(".js"));
  for (const file of files) {
    const command = require(path.join(folders, folder, file));
    if ("data" in command && "execute" in command) commands.push(command.data.toJSON());
  }
}

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("⏳ Registering guild commands...");
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log("✅ Commands registered successfully!");
  } catch (error) {
    console.error(error);
  }
})();
