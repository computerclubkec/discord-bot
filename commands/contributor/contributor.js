const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");
const yaml = require("js-yaml");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("contributor")
        .setDescription("Search for a Computer Club Contributor")
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Name of the contributor to search for')
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply();

        const searchName = interaction.options.getString('name');

        try {
            // Fetch the YAML file from GitHub (raw content)
            const response = await fetch("https://raw.githubusercontent.com/computerclubkec/computerclubkec.github.io/main/_data/contributors.yml");

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const yamlText = await response.text();
            const contributorsData = yaml.load(yamlText);

            // Get all contributors
            const allContributors = contributorsData.contributors_list || [];

            // Search for specific contributor
            const foundContributor = allContributors.find(contributor =>
                contributor.name && contributor.name.toLowerCase().includes(searchName.toLowerCase())
            );

            if (!foundContributor) {
                await interaction.editReply({
                    content: `❌ No contributor found with name containing "${searchName}"`
                });
                return;
            }

            // Create detailed embed for the found contributor
            const embed = new EmbedBuilder()
                .setTitle(`🤝 ${foundContributor.name}`)
                .setColor(0x00FF7F)
                .setTimestamp();

            if (foundContributor.title) {
                embed.addFields({ name: '🏷️ Title', value: foundContributor.title, inline: true });
            }

            if (foundContributor.description) {
                embed.addFields({ name: '📝 About', value: foundContributor.description, inline: false });
            }

            let socialLinks = [];
            if (foundContributor.linkedin) {
                socialLinks.push(`[LinkedIn](https://linkedin.com/in/${foundContributor.linkedin})`);
            }
            if (foundContributor.twitter) {
                socialLinks.push(`[Twitter](https://twitter.com/${foundContributor.twitter})`);
            }

            if (socialLinks.length > 0) {
                embed.addFields({ name: '🔗 Social Links', value: socialLinks.join(' • '), inline: false });
            }

            if (foundContributor.image) {
                embed.setThumbnail(`https://computerclubkec.github.io${foundContributor.image}`);
            }

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error("Error fetching contributors data:", error);
            await interaction.editReply({
                content: "❌ Could not fetch contributors data."
            });
        }
    },
};