![Aniverse MMO Logo](image.png)

# ⚔️ Aniverse MMO & Raid Engine

An interactive, Discord-native RPG and boss raid engine built with Node.js and `discord.js`. Fight massive raid bosses, manage character profiles, and track inventory directly inside your Discord server using real-time graphical embeds and interactive UI buttons!

---

## ✨ Features

* **🎮 Interactive Combat UI:** No boring text-only walls! Engage in battles using Discord's native Action Buttons (**⚔️ Attack** and **🛡️ Defend**) and live visual HP bars.
* **⚡ Native SQLite Database:** Zero heavy database setup required! Powered by Node's experimental native `node:sqlite` module—fast, lightweight, and requires no external C++ compilers or third-party ORM packages.
* **👤 Auto-Account Creation:** Players are automatically registered into the database with starting Gold and Stamina the first time they interact with the bot.
* **⚡ Modern Slash Commands:** Fully integrated with Discord's modern `/` application command API.

---

## 🛠️ Tech Stack

* **Runtime:** [Node.js](https://nodejs.org/) (v22.5.0 or higher required for native SQLite)
* **Discord API:** `discord.js` (v14+)
* **Database:** Native Node SQLite (`node:sqlite`)
* **Environment Configuration:** `dotenv`

---

## 🚀 Getting Started

Follow these steps to get your local game server running!

### 1. Prerequisites
Make sure you have **Node.js v22.5.0 or newer** installed on your machine so the native SQLite engine works natively:
```bash
node -v
```

### 2. Installation
Clone this repository and open it in your terminal:
```bash
git clone https://github.com/your-username/Aniverse-MMO.git
cd Aniverse-MMO
```

Install the required dependencies *(Note: You do not need `better-sqlite3` or any other external database driver!)*:
```bash
npm install discord.js dotenv
```

### 3. Configuration
Create a `.env` file in the root directory of your project and add your Discord Bot Token from the [Discord Developer Portal](https://discord.com/developers/applications):
```env
DISCORD_TOKEN=your_actual_discord_bot_token_here
```

### 4. Run the Engine
Start your bot! The local SQLite database (`game.db`) and player tables will automatically initialize on the first run:
```bash
node index.js
```
*(Tip: If you want to hide Node's experimental feature warnings in your terminal, run `node --no-warnings index.js` instead).*

---

## 🎮 How to Play

Once your bot is online and invited to your Discord server with the `applications.commands` scope, try out these commands in any text channel:

| Command | Description |
| :--- | :--- |
| `/profile` | Displays your player stats, current Gold, and Stamina. Creates your account if you are new! |
| `/raid` | Summons a Raid Boss (like the Demon Lord Slime) into the channel. Click the attached UI buttons to **Attack** or **Defend** in real-time! |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute to the engine.

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).