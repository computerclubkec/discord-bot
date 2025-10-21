const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");
const yaml = require("js-yaml");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("member")
        .setDescription("Search for a Computer Club Member")
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Name of the member to search for')
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply();

        const searchName = interaction.options.getString('name');

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

            if (searchName) {
                // Search for specific member
                const foundMember = allMembers.find(member =>
                    member.name && member.name.toLowerCase().includes(searchName.toLowerCase())
                );

                if (!foundMember) {
                    await interaction.editReply({
                        content: `❌ No member found with name containing "${searchName}"`
                    });
                    return;
                }

                // Create detailed embed for the found member
                const embed = new EmbedBuilder()
                    .setTitle(`👤 ${foundMember.name}`)
                    .setColor(0x0099FF)
                    .setTimestamp();

                if (foundMember.title) {
                    embed.addFields({ name: '🏷️ Title', value: foundMember.title, inline: true });
                }

                embed.addFields({ name: '📅 Year', value: foundMember.year, inline: true });

                if (foundMember.description) {
                    embed.addFields({ name: '📝 About', value: foundMember.description, inline: false });
                }

                let socialLinks = [];
                if (foundMember.linkedin) {
                    socialLinks.push(`[LinkedIn](https://linkedin.com/in/${foundMember.linkedin})`);
                }
                if (foundMember.twitter) {
                    socialLinks.push(`[Twitter](https://twitter.com/${foundMember.twitter})`);
                }

                if (socialLinks.length > 0) {
                    embed.addFields({ name: '🔗 Social Links', value: socialLinks.join(' • '), inline: false });
                }

                if (foundMember.image) {
                    embed.setThumbnail(`https://computerclubkec.github.io${foundMember.image}`);
                }

                await interaction.editReply({ embeds: [embed] });

            } else {
                await interaction.editReply({
                    content: "❌ Please provide a member name to search for."
                });
            }

        } catch (error) {
            console.error("Error fetching members data:", error);
            await interaction.editReply({
                content: "❌ Could not fetch members data."
            });
        }
    },
};