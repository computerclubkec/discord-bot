const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("image")
    .setDescription("Generate an image using AI")
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("Description of the image to generate")
        .setRequired(true)
    ),
  async execute(interaction) {
    const description = interaction.options.getString("description");
    await interaction.deferReply();

    try {
      const requestData = {
        contents: [
          {
            role: "user",
            parts: [{ text: description }],
          },
        ],
        generationConfig: { responseModalities: ["IMAGE"] },
      };

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${process.env.GEMINI_API_KEY}`,
        requestData,
        { headers: { "Content-Type": "application/json" } }
      );

      const candidates = response.data.candidates;
      let imageBase64 = null;

      if (candidates?.[0]?.content?.parts) {
        for (const part of candidates[0].content.parts) {
          if (part.inlineData?.data) {
            imageBase64 = part.inlineData.data;
            break;
          }
        }
      }

      if (!imageBase64) throw new Error("No image data found");

      const imageBuffer = Buffer.from(imageBase64, "base64");
      const attachment = new AttachmentBuilder(imageBuffer, { name: "generated.png" });

      await interaction.editReply({
        content: `🎨 Generated image for: "${description}"`,
        files: [attachment],
      });
    } catch (error) {
      console.error(error);
      let message = "❌ Error generating image.";
      if (error.response?.status === 429) message = "⚠️ Quota exceeded.";
      else if (error.response?.status === 401) message = "🔑 Invalid API key.";
      await interaction.editReply({ content: message });
    }
  },
};
