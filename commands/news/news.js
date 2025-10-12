const fetchTopHackerNews = require("./fetchTopHackerNews.js").default;
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("news")
    .setDescription("View Top 5 Trending Hacker News stories"),
  async execute(interaction) {
    await interaction.deferReply();

    const stories = await fetchTopHackerNews(5);

    if (!stories) {
      return interaction.editReply("⚠️ Failed to fetch news. Try again later.");
    }

    const embed = new EmbedBuilder()
      .setTitle("Top Hacker News Stories")
      .setColor("#FF6600")
      .setTimestamp()
      .setFooter({
        text: "Hacker News",
        iconURL: "https://news.ycombinator.com/y18.gif", //maybe logo format not supported in discord embed
      })

    stories.forEach((story) => {
      embed.addFields({
        name: story.title,
        value: `Author: **${story.author}** | Score: **${story.score}** | Comments: **${story.comments}**\n[Read More](${story.url})`,
      });
    });

    await interaction.editReply({ embeds: [embed] });
  },
};
