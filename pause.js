const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, Message } = require("discord.js");

//discord-player library ALLOWS FOR SIMPLE FUNCTION CALLS (queue.skip, queue.resume, etc.)
module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pauses current song."),
    execute: async ({ client, interaction }) => {

        const queue = client.player.getQueue(interaction.guild);

        if (!queue){
            await interaction.reply("There is no song playing.");
            return;
        } 
        queue.setPaused(true);

        await interaction.reply("Paused current song.")
    }
}