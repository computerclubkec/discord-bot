# KEC Computer Club — Discord Bot

Discord bot for the KEC Computer Club Discord server. This repository contains the bot source, command registration script, Docker setup, and developer guidance. The bot provides utility commands, event scraping from the club website, and optional AI image generation via Gemini.

## Table of Contents

- About
- Features
- Quick Start
- Local Development
- Environment Variables
- Commands Reference
- Code of Conduct
- Contributing
- Docker
- Troubleshooting
- Files of Interest
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

## Code of Conduct

As members of the KEC Computer Club community, we are dedicated to creating a welcoming, inclusive, and respectful environment for everyone, regardless of background, experience, or identity. This Code of Conduct applies to all interactions in our repository, Discord server, events, and other spaces where our community gathers.

### Our Standards

We strive to:

- **Be welcoming and respectful.** Treat others with kindness and empathy. Appreciate diverse perspectives and experiences.
- **Engage in constructive discussions.** Provide helpful feedback and encourage learning by supporting each other.
- **Stay focused and collaborative.** Work towards the goals of the KEC Computer Club. Respect others' time by being constructive and on-topic.
- **Respect personal boundaries.** Avoid inappropriate language or behavior and respect others' comfort levels in all interactions.

### Unacceptable Behavior

Examples of unacceptable behavior include:

- Harassment, discrimination, or derogatory comments based on race, gender, sexual orientation, disability, or any other personal characteristic.
- Insults, threats, or personal attacks.
- Excessive promotion of unrelated content, spamming, or off-topic discussions.
- Disruptive behavior, trolling, or intentional intimidation.

### Reporting and Enforcement

If you experience or witness any behavior that violates this Code of Conduct, please report it to our team:

- **Email:** [computerclub@kec.edu.np](mailto:computerclub@kec.edu.np)
- **Discord Moderator Contact:** Message any moderator or admin on the [Discord server](https://discord.gg/neMkXj7GC3).

All reports will be handled confidentially, and appropriate action will be taken to maintain a safe and welcoming community.

### Consequences

Violations of the Code of Conduct may result in:

- A warning for minor issues.
- Temporary or permanent suspension from participation in the repository, Discord server, or KEC Computer Club events.
- Permanent ban from the community for severe or repeated offenses.

By participating in the KEC Computer Club, you agree to uphold this Code of Conduct. Let's create a positive and productive community for everyone.

---

_This Code of Conduct is adapted and inspired by community standards outlined in the [Contributor Covenant](https://www.contributor-covenant.org/)._

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository and create a branch: `git checkout -b feature/my-change`
2. Make changes, add tests if relevant, and run linters
3. Open a Pull Request describing your change

For larger changes, open an issue first to discuss the approach.

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

## License & Contact

This project is licensed under the MIT License — see `LICENSE`.

Contact: computerclub@kec.edu.np
