const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ding')
    .setDescription('Ding the bot'),
  async execute(interaction) {
    await interaction.reply('🍆 Dong!');
  },
};
