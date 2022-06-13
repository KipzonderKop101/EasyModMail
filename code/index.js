const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const { token} = require('./config.json');

// define new client
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES], partials: ['CHANNEL'] });

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

    let channel = client.channels.cache.get('your-id-here');

    client.on('messageCreate', async (message) =>  {
        if (message.author.bot) return;
     
        try {
            if (message.guild === null) {
                await channel.send(`Message from ${message.author.tag}: ${message.content}`);
            }
        } catch (error) {
            await message.channel.send('Hmm, weird, it appears we ran into an error. Please try again in a few minutes. If this error persits, please let us')
            console.error(error);
        }
    });

    // running commands
    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction, client);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Hmm, we appear to have run into an error. Please try again in a few minutes, if this error persists, please let us know!', ephemeral: true });
        }
    });
});

client.login(token);
