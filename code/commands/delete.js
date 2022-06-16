const { SlashCommandBuilder } = require('@discordjs/builders');

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
                .setDescription('Choose the thread you want to delete (if previous option is false)')
                .setRequired(false))
        .addIntegerOption(option => 
            option.setName('reason')
                .setDescription('The reason for deleting the thread')
                .setRequired(false)),
	async execute(interaction, client) {
		let this_channel = interaction.options.getBoolean('this');
        let thread = interaction.options.getChannel('thread');
        let message = interaction.options.getString('message');

        if (this_channel) {
            if (thread === null) {
                let messages = await interaction.channel.messages.fetchPinned();
                let id = messages.first()

                client.users.fetch(id.content).then(async user => {
                    // WORK IN PROGESS
                }).catch(async error => {
                    await interaction.reply({ content: 'We couldn\'t the user ID pinned message', emphermal: true });
                    console.log()
                });
            } else {
                await interaction.reply({ content: `You cannot select a channel while having \`this\` selected as \`${this_channel}\``, emphermal: true })
            }
        } else {
            let messages = await thread.messages.fetchPinned();
            let id = messages.first()

            // WORK IN PROGESS
        }
	},
};
