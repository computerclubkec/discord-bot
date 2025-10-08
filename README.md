# KEC Computer Club — Discord Bot

Discord bot for the KEC Computer Club Discord server. This repository contains the bot source, command registration script, Docker setup, and developer guidance. The bot provides utility commands, event scraping from the club website, and optional AI image generation via Gemini.

## Table of Contents

- About
- Features
- Quick Start
- Local Development
- Environment Variables
- Commands Reference
- Docker
- Troubleshooting
- Files of Interest
- Contributing
- Community
- License & Contact

## About

This bot is a lightweight helper for the KEC Computer Club community. It can:

- Respond to `/ping` and `/stats` commands
- Scrape and display past and upcoming events from the club website
- Optionally generate images using Gemini (when `GEMINI_API_KEY` is provided)

## Features

- Slash command registration (`commands.js`)
- Command handling and event scraping (`index.js`)
- Dockerized deployment (`Dockerfile`, `docker-compose.yml`)

## Quick Start

1. Copy `.env.example` to `.env` and fill in values.
2. Start with Docker Compose:

```bash
docker-compose up --build -d
```

Or run locally after installing dependencies:

```bash
npm install
node commands.js    # to register commands (guild-scoped)
node index.js       # start the bot
```

## Local Development

- Node.js 18+ recommended
- Install dependencies: `npm install`
- Add a `dev` script with nodemon for live reloads: `npm i -D nodemon` and add `"dev": "nodemon index.js"` to `package.json` scripts.

## Environment Variables

Copy `.env.example` to `.env` and set the following:

- `TOKEN` — Discord bot token (required)
- `CLIENT_ID` — Discord application client ID (required for registering commands)
- `GUILD_ID` — guild (server) ID to register commands into (useful for testing)
- `GEMINI_API_KEY` — optional: Gemini API key for image generation

Example:

```
TOKEN=your_discord_bot_token
CLIENT_ID=your_client_id
GUILD_ID=your_guild_id
GEMINI_API_KEY=your_gemini_api_key
```

## Commands Reference

- `/ping` — Liveness check
- `/stats` — Basic server stats
- `/image description:<text>` — Generate image using Gemini (requires `GEMINI_API_KEY`)
- `/pastevents` — Shows past events from the club website
- `/recentevents` — Shows recent/upcoming events

## Docker

- Image is based on `node:20-alpine` and runs `node commands.js` during build to register slash commands. Consider separating registration from build for production.
- `docker-compose.yml` reads `.env` via `env_file` and restarts automatically.

## Troubleshooting

- Bot won't start: verify `TOKEN` and that the bot is invited to the guild with the proper scopes.
- Commands not visible: re-run `node commands.js` (guild scoped) or wait up to an hour for global registration.

## Files of Interest

- `index.js` — main bot logic
- `commands.js` — registers slash commands
- `Dockerfile`, `docker-compose.yml` — containerization
- `.env.example` — environment variable template

## Contributing

We welcome contributions from everyone! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

For detailed guidelines, please read our [CONTRIBUTING.md](CONTRIBUTING.md) file.

## Community

### Development Sessions

We host regular development sessions to:

- Review pull requests
- Discuss new features
- Debug issues
- Share knowledge
- Plan future improvements

Join our [Discord Server](https://discord.gg/neMkXj7GC3) to participate in these sessions!

### Contributors

Thanks to our dedicated contributors who continue to build and improve the KEC Computer Club's online presence:

<a href="https://github.com/computerclubkec/computerclubkec.github.io/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=computerclubkec/computerclubkec.github.io&max=400&columns=20" />
</a>

### Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) to understand our community standards and expectations.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Contact: computerclub@kec.edu.np
