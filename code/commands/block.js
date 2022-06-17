const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('block')
		.setDescription('Block this user from ever contacting mod-mail again')
        .addBooleanOption(option => 
            option.setName('this')
                .setDescription('Choose if you want to block this thread')
                .setRequired(true))
        .addChannelOption(option => 
            option.setName('thread')
                .setDescription('Choose if you want to block another thread (if previous option is false)')
                .setRequired(false))
        .addIntegerOption(option => 
            option.setName('reason')
                .setDescription('The reason for block the user')
                .setRequired(false)),
	async execute(interaction, client) {
        let this_channel = interaction.options.getBoolean('this');
        let thread = interaction.options.getChannel('thread');
        let reason = interaction.options.getString('reason');

        if (this_channel) {
            if (thread === null) {
                let messages = await interaction.channel.messages.fetchPinned();
                let id = messages.first();
            } else {
               await interaction.reply({ content: `You cannot select a channel while having \`this\` selected as \`${this_channel}\``, ephemeral: true });
            }
        } else {
            // WORK IN PROGRESS 
        }
	},
};
