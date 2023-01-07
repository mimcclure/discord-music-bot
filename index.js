require("dotenv").config();

//require all discordjs libraries that are used
const { Player } = require("discord-player");
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { Routes } = require("discord-api-types/v9"); 
const { REST } = require("@discordjs/rest");

//used to load all the commands from the commands folder
const fs = require("node:fs");
const path = require("node:path");
const internal = require("node:stream");

//client that will be the bot
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates
      ]    
})

//all commands
const commands = [];
client.commands = new Collection(); //store it in the collection, gives more access (wrapper around the map and allows us to treat the wrapper like an array)

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles){
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

//PLAYER
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
});

//GET GUILD ID THEN REGISTER ALL LOADED COMMANDS FROM USING IMPORTED DISCORDJS API (USE TOKEN AND CLIENTID TO LATER REGISTER COMMANDS)
client.on("ready", () => {
    const guild_ids = client.guilds.cache.map(guild => guild.id);

    const rest = new REST({version: "9"}).setToken(process.env.TOKEN);
    for (const guildID of guild_ids){
        rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildID), {
            body: commands
        })
        .then(() => console.log(`Added commands to ${guildID}`))
        .catch(console.error);
    }
});

//EXECUTE COMMAND WHEN USERS TYPES COMMAND BY PASSING INTO CLIENT. CHECK FOR INTERACTIONS FIRST, THEN PUSH TO CLIENT.COMMANDS
client.on("interactionCreate", async interaction => {
    if(!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if(!command) return;

    try{
        await command.execute({client, interaction});
    }
    catch(err){
        console.error(err);
        await interaction.reply("An error occured while executing that command.");
    }
});

//LOGIN OUR BOT (client login and passing in token)
client.login(process.env.TOKEN);