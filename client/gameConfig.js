import {Boot} from "./scenes/Boot.js";
import {Preloader} from "./scenes/Preloader.js";
import {MainMenu} from "./scenes/MainMenu.js";
import {Game} from "./scenes/Game.js";
import {GameOver} from "./scenes/GameOver.js";

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