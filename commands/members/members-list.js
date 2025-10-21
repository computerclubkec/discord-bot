const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");
const yaml = require("js-yaml");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("members")
        .setDescription("List all Computer Club Members"),

    async execute(interaction) {
        await interaction.deferReply();

        try {
            // Fetch the YAML file from GitHub (raw content)
            const response = await fetch("https://raw.githubusercontent.com/computerclubkec/computerclubkec.github.io/main/_data/members.yml");

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const yamlText = await response.text();
            const membersData = yaml.load(yamlText);

            // Combine all members from both years
            const allMembers = [];
            if (membersData.members_2024) {
                allMembers.push(...membersData.members_2024.map(m => ({ ...m, year: '2024' })));
            }
            if (membersData.members_2023) {
                allMembers.push(...membersData.members_2023.map(m => ({ ...m, year: '2023' })));
            }

            // Show list of all member names
            const embed = new EmbedBuilder()
                .setTitle("👥 Computer Club Members")
                .setDescription("Use `/member <name>` to get detailed info about a specific member")
                .setColor(0x0099FF)
                .setTimestamp();

            // Group members by year
            const members2024 = allMembers.filter(m => m.year === '2024').map(m => m.name).join('\n• ');
            const members2023 = allMembers.filter(m => m.year === '2023').map(m => m.name).join('\n• ');

            if (members2024) {
                embed.addFields({
                    name: '📅 2024 Members',
                    value: `• ${members2024}`,
                    inline: false
                });
            }

            if (members2023) {
                embed.addFields({
                    name: '📅 2023 Members',
                    value: `• ${members2023}`,
                    inline: false
                });
            }

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error("Error fetching members data:", error);
            await interaction.editReply({
                content: "❌ Could not fetch members data."
            });
        }
    },
};