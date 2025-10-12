const { MessageFlags } = require('discord.js');
module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "❌ There was an error executing that command.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
