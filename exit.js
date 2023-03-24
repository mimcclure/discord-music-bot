const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, Message } = require("discord.js");

//discord-player library ALLOWS FOR SIMPLE FUNCTION CALLS (queue.skip, queue.resume, etc.)
module.exports = {
    data: new SlashCommandBuilder()
        .setName("exit")
        .setDescription("Disconnects bot from voice channel."),
    execute: async ({ client, interaction }) => {

        const queue = client.player.getQueue(interaction.guild);

        if (!queue){
            await interaction.reply("There is no song playing.");
            return;
        } 
        queue.destroy(true);

    }
}