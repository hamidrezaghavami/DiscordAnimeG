import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import 'dotenv/config';
import db, { initDatabase } from './database.js';
import { Component } from 'react';

// Initialize local database tables
initDatabase();

// Discord Client
const client = new client({ intents: [GatewayIntentBits]});

// Define Slash Commands
const commands = [
    new SlashCommandBuilder().setName('profile').setDescription('View your player stats'),
    new SlashCommandBuilder().setName('raid').setDescription('Start an interactive anime raid boss battle!')
] .map(command => command.toJSON());

// Register Commands with Discord REST API
const rest = new REST({ version: '10'}).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('Slash commands registered!');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
})();

// Command & Interaction Handlers
client.on('interactionCreate', async interaction => { 
    if (!interaction.isChatInputCommand() && !interaction.isButton()) return;

    const userID = interaction.user.id;

    // Auto-create player profile in SQLite if they don't exist
    const existingPlayer = db.prepare('SELECT * FROM players WHERE discord_id = ?').get(userID);
    if (!existingPlayer) { 
        db.prepare('INSERT INTO players (discord_id, gold, stamina) VALUES (?, ?, ?)').run(userID, 100, 100); 
    }

    // Handle Slash Commands
    if (interaction.isChatInputCommand()) { 
        if ( interaction.commandName === 'profile') { 
            const player = db.prepare('SELECT * FROM players WHERE discord_id = ?').get(userID);
            await interaction.reply(`🎮 **${interaction.user.username}'s Profile**\n💰 Gold: ${player.gold}\n⚡ Stamina: ${player.stamina}`);
        }

        if ( interaction.commandName == 'raid') {
          const raidEmbed = new EmbedBuilder()
          .setTitle('⚔️ RAID BOSS: Demon Lord Slime')
          .setDescription('A giant slime approaches! Choose your action below.')
          .setColor('#FF0000')
          .addFields({ name: 'Boss HP', value: '🟩🟩🟩🟩🟩 100/100' });

          const attackButton = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('raid_attack').setLabel('⚔️ Attack').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('raid_defend').setLabel('🛡️ Defend').setStyle(ButtonStyle.Primary)
          );
          await interaction.reply({ embeds: [raidEmbed], Components: [attackButton]});
        }
    }

    // Handle Button Clicks
    if (interaction.isButton()) { 
      if ( interaction.customId === 'raid_attack') { 
        const damage = Math.floor(Math.random() * 20) + 10;
    
        const updatedEmbed = new EmbedBuilder()
        .setTitle('⚔️ RAID BOSS: Demon Lord Slime')
        .setDescription(`💥 You struck the boss for **${damage} damage**!`)
        .setColor('#FF5733')
        .addFields({ name: 'Boss HP', value: `🟩🟩🟩⬜⬜ ${100 - damage}/100` });
    
        await interaction.update({ embeds: [updatedEmbed]});
      }
    }
});

// Login
client.login(process.env.DISCORD_TOKEN);