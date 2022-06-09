const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Intents } = require('discord.js');
const { token} = require('./config.json');

// define new client
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// getting commands from their files in './commands'
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    client.commands.set(command.data.name, command);
}

// show us the bot is online and ready to use
client.once('ready', () => {
    console.log('Application logged in');
});

// running commands
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Hmm, we appear to have run into an error. Please try again in a few minutes, if this error persists, please let us know!', ephemeral: true });
    }
});

client.login(token);
