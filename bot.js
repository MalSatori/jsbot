const Discord = require('discord.js');
const fetch = require('node-fetch');

const client = new Discord.Client();

// The token of your bot - https://discordapp.com/developers/applications/me
// https://discordapp.com/oauth2/authorize?client_id=CLIENTID&scope=bot

const token = "Discord Token Here";


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});


client.on('message', async (message) => {
    try {
        if (message.content.startsWith('!summoner')) {
            let summoner = message.content.substr("!summoner ".length);
            summoner = summoner.replace(' ', '%20');
            let get_id = `https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${summoner}?api_key=${api_key}`;
            let summonerID = await fetch(get_id);
            summonerID = await summonerID.json();

            let request_summoner = `https://na1.api.riotgames.com/lol/league/v3/positions/by-summoner/${summonerID['id']}?api_key=${api_key}`;
            let summonerData = await fetch(request_summoner);
            summonerData = await summonerData.json();

            setSummoner(message, summonerData);
        }
    } catch (err) {
        console.log(err.stack);
    }
});

const setSummoner = async (message, summonerData) => {
    let ranks = {
        'BRONZE': '443008028409724928', 'SILVER': '443008370656542723', 'GOLD': '443007993500532746',
        'PLATINUM': '443007953105059840', 'DIAMOND': '443007916228739072', 'MASTER': '443007916228739072', 'CHALLENGER': '443007916228739072'
    };
    let roles = ['443008028409724928', '443008370656542723', '443007993500532746', '443007953105059840', '443007916228739072']

    for (const key in summonerData) {
        if (summonerData[key]['queueType'] === 'RANKED_SOLO_5x5') {
            // message.member.removeRoles(roles).then(message.member.addRole(ranks[summonerData[key]['tier']]).then(console.log('Role added.')).catch(console.error)).catch(console.error);
            await message.member.removeRoles(roles);
            await message.member.addRole(ranks[summonerData[key]['tier']]);
            console.log('Role added.');
        }
    }
};

client.login(token);
