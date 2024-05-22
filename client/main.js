import { initiateDiscordSDK, discordSdk } from './utils/discordSdk';
import { gameConfig } from './gameConfig.js' 


(async () => {
  await initiateDiscordSDK();
  // You can use discordSdk to access the Discord SDK and make the requests you need

  new Phaser.Game(gameConfig);
})();