import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import 'dotenv/config';
import db, { initDatabase } from './database.js';

// Initialize local database tables
initDatabase();

// Create Discord Client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Define Slash Commands
const commands = [
  new SlashCommandBuilder().setName('profile').setDescription('View your player stats'),
  new SlashCommandBuilder().setName('raid').setDescription('Start an interactive anime raid boss battle!')
].map(command => command.toJSON());

// Register Commands with Discord REST API
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

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
  // 1. Ignore anything that isn't a slash command or a button click
  if (!interaction.isChatInputCommand() && !interaction.isButton()) return;

  const userId = interaction.user.id;

  try {
    // 2. Auto-create player profile in SQLite if they don't exist
    const existingPlayer = db.prepare('SELECT * FROM players WHERE discord_id = ?').get(userId);
    if (!existingPlayer) {
      db.prepare('INSERT INTO players (discord_id, gold, stamina) VALUES (?, ?, ?)').run(userId, 100, 100);
    }

    // ==========================================
    // HANDLE SLASH COMMANDS
    // ==========================================
    if (interaction.isChatInputCommand()) {
      
      if (interaction.commandName === 'profile') {
        const player = db.prepare('SELECT * FROM players WHERE discord_id = ?').get(userId);
        return await interaction.reply(`🎮 **${interaction.user.username}'s Profile**\n💰 Gold: ${player.gold}\n⚡ Stamina: ${player.stamina}`);
      }

      if (interaction.commandName === 'raid') {
        const raidEmbed = new EmbedBuilder()
          .setTitle('⚔️ RAID BOSS: Demon Lord Slime')
          .setDescription('A giant slime approaches! Choose your action below.')
          .setColor('#FF0000')
          .addFields({ name: 'Boss HP', value: '🟩🟩🟩🟩🟩 100/100' });

        const actionRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId('raid_attack').setLabel('⚔️ Attack').setStyle(ButtonStyle.Danger),
          new ButtonBuilder().setCustomId('raid_defend').setLabel('🛡️ Defend').setStyle(ButtonStyle.Primary)
        );

        return await interaction.reply({ embeds: [raidEmbed], components: [actionRow] });
      }
    }

    // HANDLE BUTTON CLICKS
    if (interaction.isButton()) {
      
      // --- ATTACK BUTTON ---
      if (interaction.customId === 'raid_attack') {
        const damage = Math.floor(Math.random() * 20) + 10;
        const currentHp = Math.max(0, 100 - damage); // Prevents HP going below 0
        
        const updatedEmbed = new EmbedBuilder()
          .setTitle('⚔️ RAID BOSS: Demon Lord Slime')
          .setDescription(`💥 **${interaction.user.username}** struck the boss for **${damage} damage**!`)
          .setColor('#FF5733')
          .addFields({ name: 'Boss HP', value: `🟩🟩🟩⬜⬜ ${currentHp}/100` });

        // Acknowledge the click AND keep the buttons attached so they can keep fighting!
        return await interaction.update({ 
          embeds: [updatedEmbed], 
          components: interaction.message.components 
        });
      }

      // DEFEND BUTTON (This was missing and causing your timeout error!) ---
      if (interaction.customId === 'raid_defend') {
        const blockedDamage = Math.floor(Math.random() * 15) + 5;

        // Pull the current HP from the original embed so it doesn't reset when defending
        const currentHpField = interaction.message.embeds[0].fields[0].value;

        const updatedEmbed = new EmbedBuilder()
          .setTitle('⚔️ RAID BOSS: Demon Lord Slime')
          .setDescription(`🛡️ **${interaction.user.username}** raised their shield and blocked **${blockedDamage} damage**!`)
          .setColor('#33FF57')
          .addFields({ name: 'Boss HP', value: currentHpField });

        return await interaction.update({ 
          embeds: [updatedEmbed], 
          components: interaction.message.components 
        });
      }

      // FALLBACK SAFETY NET
      // this line silently acknowledges it so Discord NEVER throws a "didn't respond in time" error!
      await interaction.deferUpdate().catch(() => {});
    }

  } catch (error) {
    console.error('Error handling interaction:', error);
    
    // If a database query fails or something breaks, tell the user instead of timing out
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: '❌ An error occurred while processing this action!', ephemeral: true }).catch(() => {});
    }
  }
});

// Login
client.login(process.env.DISCORD_TOKEN);