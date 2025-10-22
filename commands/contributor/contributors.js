const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");
const yaml = require("js-yaml");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("contributors")
        .setDescription("List all Computer Club Contributors"),

    async execute(interaction) {
        await interaction.deferReply();

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

            // Show list of all contributor names
            const embed = new EmbedBuilder()
                .setTitle("🤝 Computer Club Contributors")
                .setDescription("Use `/contributor <name>` to get detailed info about a specific contributor")
                .setColor(0x00FF7F)
                .setTimestamp();

            if (allContributors.length > 0) {
                const contributorNames = allContributors.map(c => c.name).join('\n• ');
                embed.addFields({
                    name: '👥 All Contributors',
                    value: `• ${contributorNames}`,
                    inline: false
                });

                embed.addFields({
                    name: '📊 Stats',
                    value: `Total Contributors: **${allContributors.length}**`,
                    inline: false
                });
            } else {
                embed.addFields({
                    name: '📭 No Contributors',
                    value: 'No contributors found in the database.',
                    inline: false
                });
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