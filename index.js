const { Client, IntentsBitField, AttachmentBuilder } = require("discord.js");
const axios = require("axios");
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
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        responseModalities: ["IMAGE"]
      }
    };

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${process.env.GEMINI_API_KEY}`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Extract image data from response
    const candidates = response.data.candidates;
    if (candidates && candidates[0] && candidates[0].content && candidates[0].content.parts) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return part.inlineData.data;
        }
      }
    }
    
    throw new Error('No image data found in response');
  } catch (error) {
    console.error('Error generating image:', error.response?.data || error.message);
    
    // Handle specific error types
    if (error.response?.status === 429) {
      throw new Error('QUOTA_EXCEEDED');
    } else if (error.response?.status === 401) {
      throw new Error('INVALID_API_KEY');
    } else if (error.response?.status === 403) {
      throw new Error('PERMISSION_DENIED');
    } else {
      throw new Error('API_ERROR');
    }
  }
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
      const imageBuffer = Buffer.from(imageBase64, 'base64');
      
      // Create attachment
      const attachment = new AttachmentBuilder(imageBuffer, { name: 'generated_image.png' });
      
      await interaction.editReply({
        content: `🎨 Generated image for: "${description}"`,
        files: [attachment]
      });
    } catch (error) {
      console.error('Error in image command:', error);
      
      let errorMessage = '❌ Sorry, there was an error generating the image.';
      
      if (error.message === 'QUOTA_EXCEEDED') {
        errorMessage = '⚠️ API quota exceeded. Please try again later or check your billing settings.';
      } else if (error.message === 'INVALID_API_KEY') {
        errorMessage = '🔑 Invalid API key. Please check your configuration.';
      } else if (error.message === 'PERMISSION_DENIED') {
        errorMessage = '🚫 Permission denied. Your API key may not have image generation access.';
      }
      
      await interaction.editReply({
        content: errorMessage,
        ephemeral: true
      });
    }
  }
});

client.login(process.env.TOKEN);
