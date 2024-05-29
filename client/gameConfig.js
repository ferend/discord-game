import {Boot} from "./src/scenes/Boot.js";
import {Preloader} from "./src/scenes/Preloader.js";
import {MainMenu} from "./src/scenes/MainMenu.js";
import {Game} from "./src/scenes/Game.js";
import {GameOver} from "./src/scenes/GameOver.js";

export const gameConfig = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        Game,
        GameOver
    ]
};