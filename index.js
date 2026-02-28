require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.once('ready', async () => {
    console.log('🔥 Bot is ready');

    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    if (!guild) return console.log('❌ Guild not found');

    const channel = guild.channels.cache.get(process.env.VOICE_CHANNEL_ID);
    if (!channel) return console.log('❌ Voice channel not found');

    joinVoiceChannel({
    channelId: channel.id,
    guildId: guild.id,
    adapterCreator: guild.voiceAdapterCreator,
    selfDeaf: false, // يشيل علامة السماعة
    selfMute: false
});

    console.log('✅ Joined voice channel and staying there.');
});

client.login(process.env.TOKEN);