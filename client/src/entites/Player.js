import { Physics } from 'phaser';

export class Player {
    constructor(scene, x, y, texture) {
        this.scene = scene;
        this.sprite = this.scene.physics.add.sprite(x, y, texture);
        this.sprite.setCollideWorldBounds(true);
    }
}
