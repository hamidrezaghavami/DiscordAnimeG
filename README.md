# DiscordAnimeG 

A backend-driven anime MMO and gacha raid engine built with Node.js, SQLite, and Discord.js. Transform Discord into an interactive game client featuring real-time event loops, clickable button combat, secure state management, and weighted gacha drop rates.

## Features

* **Event-Driven Architecture:** Manages real-time interactions, slash commands, and WebSocket events using `discord.js`.
* **Interactive Button Combat:** Spawns live raid bosses with dynamic health bars updated in real-time via clickable Discord UI components.
* **ACID-Compliant State Management:** Uses SQLite to securely track player profiles, currencies, character inventories, and cooldowns without race conditions.
* **Weighted Gacha System:** Implements RNG drop algorithms for pulling rare anime heroes.

## Tech Stack

* **Runtime:** Node.js
* **Library:** Discord.js
* **Database:** SQLite (via `better-sqlite3`)
* **Environment Management:** Dotenv

## Project Structure

```text
DiscordAnimeG/
├── .env                  # Secret Discord Bot Token (gitignored)
├── .gitignore            # Ignores node_modules, .env, and local databases
├── package.json          # Project dependencies and metadata
├── database.js           # SQLite connection and schema initialization
├── client.js             # Discord client configuration and intents
└── index.js              # Main entry point for commands, gacha, and raid loops

```

## Getting Started

### Prerequisites

* Node.js installed on your machine
* A Discord Application and Bot Token from the Discord Developer Portal
* A VPN or DPI bypass tool (such as GoodbyeDPI) if accessing Discord's API from Turkey

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/DiscordAnimeG.git
cd DiscordAnimeG
```


2. Install dependencies:
```bash
npm install discord.js better-sqlite3 dotenv
```


3. Create a `.env` file in the root directory and add your bot token:
```env
DISCORD_TOKEN=your_bot_token_here
```


4. Run the application:
```bash
node index.js
```
## License
This project is open source and available under the MIT License.