const { SlashCommandBuilder } = require('@discordjs/builders');
const { InteractionResponseType } = require('discord-api-types/v10');
const { Interaction } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete')
		.setDescription('Delete a thread')
        .addBooleanOption(option => 
            option.setName('this')
                .setDescription('Choose if you want to delete this thread')
                .setRequired(true))
        .addChannelOption(option => 
            option.setName('thread')
                .setDescription('Choose if you want to delete another thread (if previous option is false)')
                .setRequired(false))
        .addIntegerOption(option => 
            option.setName('reason')
                .setDescription('The reason for deleting the thread')
                .setRequired(false)),
	async execute(interaction, client) {
		let this_channel = interaction.options.getBoolean('this');
        let thread = interaction.options.getChannel('thread');
        let reason = interaction.options.getString('reason');

        if (this_channel) {
            if (thread === null) {
                let messages = await interaction.channel.messages.fetchPinned();
                let id = messages.first();

                client.users.fetch(id.content).then(async user => {
                    try {
                        await interaction.channel.delete();
                        await user.send('Your mod-mail thread has been deleted');
                    } catch (error) {
                        await interaction.reply({ content: 'We ran into an unknown error. Please try again in a few minutes, or contact the help desk!', ephemeral: true});
                        console.error(error);
                    }   
                }).catch(async error => {
                    await interaction.reply({ content: 'Hmm, we could not fetch the user ID. Are you sure its pinned?', ephemeral: true });
                    console.error(error);
                });
            } else {
                await interaction.reply({ content: `You cannot select a channel while having \`this\` selected as \`${this_channel}\``, ephemeral: true })
            }
        } else {
            let messages = await thread.messages.fetchPinned();
            let id = messages.first();

            client.user.fetch(id.content).then(async user => {
                try {
                    await thread.delete();
                    await user.send('Your mod-mail thread has been deleted');
                } catch (error) {
                    await interaction.reply({ content: 'We ran into an unknown error. Please try again in a few minutes, or contact the help desk!', ephemeral: true});
                    console.error(error);    
                }
            }).catch(async error => {   
                await Interaction.reply({ content: 'Hmm, we could not fetch the user ID. Are you sure its pinned?', ephemeral: true });
                console.error(error);
            });
        }
	},
};
