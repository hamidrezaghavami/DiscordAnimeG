import { Client, GatewayIntentBits } from 'discord.js';

// Initialize the Discord Client with required intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,           // Allows the bot to see servers it joins
    GatewayIntentBits.GuildMessages,    // Allows the bot to listen to messages in servers
    GatewayIntentBits.MessageContent,   // Allows the bot to read message content (for prefix commands/context)
  ],
});

export default client;