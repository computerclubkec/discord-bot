// =============================================================================
// Index.js - Main bot logic
// =============================================================================
// This script contains the main logic for a Discord bot using the Discord.js library.
// It handles various slash commands including ping, stats, image generation using Gemini API,
// and fetching past and recent events from the KEC Computer Club website.
// Ensure you have the necessary environment variables set in your .env file.
// ----------------------------------------------------------------------------
// Commands implemented:
// /ping - Check if the bot is active
// /stats - View server statistics
// /image - Generate an image using AI (requires GEMINI_API_KEY)
// /pastevents - View past events of KEC Computer Club
// /recentevents - View recent or upcoming events of KEC Computer Club
// =============================================================================

const { Client, IntentsBitField, AttachmentBuilder } = require("discord.js");
const axios = require("axios");

const fetch = require("node-fetch");
const cheerio = require("cheerio");

require("dotenv").config();

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildPresences,
  ],
});

async function generateImage(prompt) {
  try {
    const requestData = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        responseModalities: ["IMAGE"],
      },
    };

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${process.env.GEMINI_API_KEY}`,
      requestData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Extract image data from response
    const candidates = response.data.candidates;
    if (
      candidates &&
      candidates[0] &&
      candidates[0].content &&
      candidates[0].content.parts
    ) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return part.inlineData.data;
        }
      }
    }

    throw new Error("No image data found in response");
  } catch (error) {
    console.error(
      "Error generating image:",
      error.response?.data || error.message
    );

    // Handle specific error types
    if (error.response?.status === 429) {
      throw new Error("QUOTA_EXCEEDED");
    } else if (error.response?.status === 401) {
      throw new Error("INVALID_API_KEY");
    } else if (error.response?.status === 403) {
      throw new Error("PERMISSION_DENIED");
    } else {
      throw new Error("API_ERROR");
    }
  }
}

// function to fetch past events from the KEC Computer Club website
async function fetchPastEvents() {
  const url = "https://computerclubkec.github.io/events/past-events";
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);

  const events = [];

  $(".event-card").each((_, el) => {
    const title = $(el).find("h3").text().trim();
    const date = $(el).find(".fa-calendar-days").parent().text().trim();
    const description = $(el).find(".event-description-short").text().trim();
    const link =
      "https://computerclubkec.github.io" + $(el).find("a").attr("href");
    const image =
      "https://computerclubkec.github.io" + $(el).find("img").attr("src");

    events.push({ title, date, description, link, image });
  });

  return events;
}

// function to fetch recent or upcoming events from the KEC Computer Club website
async function fetchUpcomingEvents() {
  const url = "https://computerclubkec.github.io/events/upcoming";
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);

  const events = [];

  $(".event-card").each((_, el) => {
    const title = $(el).find("h3").text().trim();
    const date = $(el).find(".fa-calendar-days").parent().text().trim();
    const description = $(el).find(".event-description-short").text().trim();
    const link =
      "https://computerclubkec.github.io" + $(el).find("a").attr("href");
    const image =
      "https://computerclubkec.github.io" + $(el).find("img").attr("src");
    events.push({ title, date, description, link, image });
  });

  return events;
}

client.once("clientReady", (readyClient) => {
  console.log(`${readyClient.user.tag} is ready`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    interaction.reply("KEC Computer Club Bot Active 🤖");
  }

  if (interaction.commandName === "stats") {
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
  }

  if (interaction.commandName === "image") {
    const description = interaction.options.getString("description");

    await interaction.deferReply();

    try {
      const imageBase64 = await generateImage(description);

      // Convert base64 to buffer
      const imageBuffer = Buffer.from(imageBase64, "base64");

      // Create attachment
      const attachment = new AttachmentBuilder(imageBuffer, {
        name: "generated_image.png",
      });

      await interaction.editReply({
        content: `🎨 Generated image for: "${description}"`,
        files: [attachment],
      });
    } catch (error) {
      console.error("Error in image command:", error);

      let errorMessage = "❌ Sorry, there was an error generating the image.";

      if (error.message === "QUOTA_EXCEEDED") {
        errorMessage =
          "⚠️ API quota exceeded. Please try again later or check your billing settings.";
      } else if (error.message === "INVALID_API_KEY") {
        errorMessage = "🔑 Invalid API key. Please check your configuration.";
      } else if (error.message === "PERMISSION_DENIED") {
        errorMessage =
          "🚫 Permission denied. Your API key may not have image generation access.";
      }

      await interaction.editReply({
        content: errorMessage,
        ephemeral: true,
      });
    }
  }

  // command to fetch and display past events
  if (interaction.commandName === "pastevents") {
    await interaction.deferReply();

    try {
      const events = await fetchPastEvents();
      const pastRecentEvents = events.slice(0, 5);

      const introEmbed = {
        title: "📅 Past Events",
        description: `Here are the **${pastRecentEvents.length} most recent past events** organized by KEC Computer Club.`,
        color: 0x5865f2,
      };

      const eventEmbeds = pastRecentEvents.map((event) => ({
        title: event.title,
        description: `${event.description}\n\n[Read More](${event.link})`,
        color: 0x3498db,
        footer: { text: event.date },
        thumbnail: { url: event.image },
      }));

      await interaction.editReply({ embeds: [introEmbed, ...eventEmbeds] });
    } catch (err) {
      console.error(err);
      await interaction.editReply({
        content: "⚠️ Failed to fetch past events. Please try again later.",
        ephemeral: true,
      });
    }
  }

  // command to fetch and display recent or upcoming events
  if (interaction.commandName === "recentevents") {
    await interaction.deferReply();

    try {
      const events = await fetchUpcomingEvents();
      const recentEvents = events.slice(0, 5);

      const introEmbed = {
        title: "📅 Recent Events",
        description: `Here are the **${recentEvents.length} most recent and upcoming events** organized by KEC Computer Club.`,
        color: 0x5865f2,
      };

      const eventEmbeds = recentEvents.map((event) => ({
        title: event.title,
        description: `${event.description}\n\n[Read More](${event.link})`,
        color: 0x3498db,
        footer: { text: event.date },
        thumbnail: { url: event.image },
      }));

      await interaction.editReply({ embeds: [introEmbed, ...eventEmbeds] });
    } catch (error) {
      console.error(err);
      await interaction.editReply({
        content: "⚠️ Failed to fetch recent events. Please try again later.",
        ephemeral: true,
      });
    }
  }
});

client.login(process.env.TOKEN);
