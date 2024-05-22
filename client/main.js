import { initiateDiscordSDK, discordSdk } from './utils/discordSdk';
import { gameConfig } from './gameConfig.js' 


(async () => {
  await initiateDiscordSDK();
  // You can use discordSdk to access the Discord SDK and make the requests you need

  new Phaser.Game(gameConfig);

  if (discordSdk) {
    discordSdk.updatePresence({
      details: 'Playing My Discord Game',
      state: 'In Main Scene',
      largeImageKey: 'game_icon',
      largeImageText: 'My Game',
      smallImageKey: 'player_icon',
      smallImageText: 'Player',
      partySize: 1,
      partyMax: 5
    }).catch(console.error);
  }
})();