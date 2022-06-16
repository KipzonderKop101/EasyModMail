const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const { token } = require('./config.json');

// define new client
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MEMBERS], partials: ['CHANNEL'] });

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

    // detect messages
    client.on('messageCreate', async (message) =>  {
        if (message.author.bot) return;

        // find the user's channel

        let guild = client.guilds.cache.get('850778582515056710');
        let user = message.author.tag.replace('#', '-').toLowerCase();
        let channel = guild.channels.cache.find(channel => channel.name === user);
        
        // check if there's a channel, than send the message there. If not, create a new channel

        try {
            if (message.guild === null) {
                if (channel === undefined) {
                    let thread = await guild.channels.create(user, { type: 'text' });
                    await thread.send(message.content);
                } else if (channel !== undefined) {
                    await channel.send(message.content);
                } 
            }
        } catch (error) {
            await message.channel.send('Hmm, weird, it appears we ran into an error. Please try again in a few minutes. If this error persits, please let us')
            console.error(error);
        }
    });

    // detected command interactions
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
