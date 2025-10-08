# Contributing to KEC Computer Club — Discord Bot

Thank you for your interest in contributing to the KEC Computer Club Discord Bot! Your contributions—whether bug fixes, documentation improvements, or new features—help the community and make the project better.

This guide explains how to contribute effectively. If you're new to Git or GitHub, the sections below contain copy-paste commands to help.

Repository: https://github.com/computerclubkec/discord-bot

## Table of Contents

1. Forking the repository
2. Cloning your fork
3. Creating a branch
4. Making changes
5. Running the bot locally
6. Committing your changes
7. Pushing your changes
8. Creating a Pull Request (PR)
9. Code of Conduct
10. Additional resources

---

## 1. Forking the repository

1. Open the repository on GitHub: https://github.com/computerclubkec/discord-bot
2. Click the **Fork** button in the top-right to create a copy under your account.

## 2. Cloning your fork

1. On your fork's GitHub page, click **Code** and copy the HTTPS or SSH URL.
2. Clone locally:

```bash
git clone https://github.com/your-username/discord-bot.git
cd discord-bot
```

(Replace `your-username`.)

## 3. Creating a branch

Create a descriptive feature branch before making changes:

```bash
git checkout -b feature/my-change
```

Use a clear name like `fix/scraper-selector`, `feat/gemini-image`, or `docs/readme`.

## 4. Making changes

- Make focused changes and avoid mixing unrelated work in a single PR.
- Update or add tests if you change scraping, parsing, or important logic.
- Keep code style consistent with the repository.

## 5. Running the bot locally

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and fill values:

```bash
cp .env.example .env
# edit .env to add TOKEN, CLIENT_ID, GUILD_ID, and optional GEMINI_API_KEY
```

3. Register commands (optional during development):

```bash
node commands.js
```

4. Run the bot:

```bash
node index.js
```

Developer tip: use `nodemon` for auto-restarts during development:

```bash
npm i -D nodemon
# add to package.json scripts: "dev": "nodemon index.js"
```

## 6. Committing your changes

Stage and commit with a descriptive message:

```bash
git add path/to/changed/files
git commit -m "Short: description of change\n\nLonger description if needed"
```

Good commit message format helps maintainers review changes quickly.

## 7. Pushing your changes

Push the branch to your fork:

```bash
git push origin feature/my-change
```

## 8. Creating a Pull Request (PR)

1. On your fork's GitHub page you will see a banner to create a pull request for your pushed branch. Click **Compare & pull request**.
2. Write a clear title and description:
   - What changed
   - Why it changed
   - How to test it
3. Submit the PR and wait for CI or maintainers to review. Respond to feedback and iterate as needed.

## 9. Code of Conduct

Please follow our Code of Conduct (see `CODE_OF_CONDUCT.md`) in all interactions. Be respectful, constructive, and helpful.

## 10. Additional resources

- Git docs: https://git-scm.com/doc
- GitHub Guides: https://guides.github.com/
- Markdown guide: https://www.markdownguide.org/

Thank you for contributing! Your participation helps the KEC Computer Club community grow and learn.
