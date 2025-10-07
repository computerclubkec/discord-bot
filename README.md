# discord-bot
Discord Bot for KEC Computer Club's discord server.

## Environment Variables

Make sure to set up the following environment variables:

- `TOKEN` - Your Discord bot token
- `CLIENT_ID` - Your Discord application client ID
- `GUILD_ID` - Your Discord server (guild) ID
- `GEMINI_API_KEY` - Your Google Gemini API key for image generation

## Commands

- `/ping` - Ping the bot
- `/stats` - View server statistics
- `/image <description>` - Generate an image using AI based on the provided description

## Running with Docker Compose

```bash
docker-compose up
```
