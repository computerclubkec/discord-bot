const { SlashCommandBuilder } = require("discord.js");
const fetch = require("node-fetch");
const cheerio = require("cheerio");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("recentevents")
    .setDescription("View recent or upcoming events of KEC Computer Club"),
  async execute(interaction) {
    await interaction.deferReply();
    try {
      const url = "https://computerclubkec.github.io/events/upcoming";
      const res = await fetch(url);
      const html = await res.text();
      const $ = cheerio.load(html);

      const events = [];
      $(".event-card").each((_, el) => {
        events.push({
          title: $(el).find("h3").text().trim(),
          date: $(el).find(".fa-calendar-days").parent().text().trim(),
          description: $(el).find(".event-description-short").text().trim(),
          link:
            "https://computerclubkec.github.io" + $(el).find("a").attr("href"),
          image:
            "https://computerclubkec.github.io" + $(el).find("img").attr("src"),
        });
      });

      const display = events.slice(0, 5).map((e) => ({
        title: e.title,
        description: `${e.description}\n\n[Read More](${e.link})`,
        color: 0x3498db,
        footer: { text: e.date },
        thumbnail: { url: e.image },
      }));

      await interaction.editReply({
        embeds: [
          {
            title: "📅 Upcoming Events",
            description: `Here are the **${display.length} most recent and upcoming events** organized by KEC Computer Club.`,
            color: 0x5865f2,
          },
          ...display,
        ],
      });
    } catch (err) {
      console.error(err);
      await interaction.editReply("⚠️ Failed to fetch recent events.");
    }
  },
};
