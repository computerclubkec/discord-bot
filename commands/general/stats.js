const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("View server statistics"),
  async execute(interaction) {
    const guild = interaction.guild;
    const members = await guild.members.fetch();

    const total = members.size;
    const online = members.filter((m) => m.presence?.status === "online").size;
    const bots = members.filter((m) => m.user.bot).size;
    const humans = total - bots;

    await interaction.reply({
      embeds: [
        {
          title: "📊 Server Stats",
          color: 0x5865f2,
          fields: [
            { name: "👥 Total Members", value: `${total}`, inline: true },
            { name: "🟢 Online Members", value: `${online}`, inline: true },
            { name: "🤖 Bots", value: `${bots}`, inline: true },
            { name: "👤 Humans", value: `${humans}`, inline: true },
          ],
          footer: { text: `Server: ${guild.name}` },
          timestamp: new Date(),
        },
      ],
    });
  },
};
