import { Scene } from 'phaser';
import { discordSdk } from "../utils/discordSdk.js";
import { Player } from '../entites/Player.js';
import { Enemy } from '../entites/Enemy.js';

export class Game extends Scene {
    constructor() {
        super('Game');
        this.shots = 0;
        this.maxShots = 6;
        this.playerHealth = 3;
        this.isReloading = false;
        this.score = 0; 
    }

    create() {
        this.cameras.main.setBackgroundColor(0x00ff00);

        const bg = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background');
        let scaleX = this.cameras.main.width / bg.width + 0.2;
        let scaleY = this.cameras.main.height / bg.height + 0.2;
        let scale = Math.max(scaleX, scaleY);
        bg.setScale(scale).setScrollFactor(0);

        this.scoreText = this.add.text(10, 70, `Score: ${this.score}`, {
            fontFamily: 'Arial', fontSize: 24, color: '#ffffff'
        });

        this.player = new Player(this, this.cameras.main.width / 2, this.cameras.main.height - 50, 'player');
        this.enemies = this.physics.add.group();
        this.bullets = this.physics.add.group();

        this.time.addEvent({
            delay: 1000,
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        });

        this.input.on('pointerdown', this.shoot, this);

        this.bulletsText = this.add.text(10, 10, `Bullets: ${this.maxShots - this.shots}`, {
            fontFamily: 'Arial', fontSize: 24, color: '#ffffff'
        });

        this.healthText = this.add.text(10, 40, `Health: ${this.playerHealth}`, {
            fontFamily: 'Arial', fontSize: 24, color: '#ffffff'
        });

        this.physics.add.overlap(this.enemies, this.player.sprite, this.enemyHitsPlayer, null, this);
    }

    shoot(pointer) {
        if (this.isReloading) {
            return;
        }

        if (this.shots < this.maxShots) {
            const bullet = this.bullets.create(this.player.sprite.x, this.player.sprite.y, 'bullet');
            this.physics.moveTo(bullet, pointer.x, pointer.y, 500);
            this.shots++;
            this.bulletsText.setText(`Bullets: ${this.maxShots - this.shots}`);
        } else {
            this.reload();
        }
    }

    reload() {
        this.isReloading = true;
        this.bulletsText.setText('Reloading...');
        this.time.delayedCall(2000, () => {
            this.shots = 0;
            this.isReloading = false;
            this.bulletsText.setText(`Bullets: ${this.maxShots - this.shots}`);
        }, [], this);
    }

    spawnEnemy()  {
        const enemy = new Enemy(this, Phaser.Math.Between(0, this.cameras.main.width), 0, 'enemy');
        this.enemies.add(enemy.sprite);

        this.physics.moveTo(enemy.sprite, this.player.sprite.x, this.player.sprite.y, 50);
    }

    update() {
        this.physics.overlap(this.bullets, this.enemies, this.hitEnemy, null, this);
    }

    hitEnemy(bullet, enemy) {
        bullet.destroy();
        enemy.destroy();
        this.score += 10; 
        this.scoreText.setText(`Score: ${this.score}`);
    }

    async enemyHitsPlayer(player, enemy) {
        enemy.destroy();
        this.playerHealth--;
        this.healthText.setText(`Health: ${this.playerHealth}`);
        await this.updateDiscordStatus();
        if (this.playerHealth <= 0) {
            await this.sendDiscordMessage("Game Over! Better luck next time.");
            // Check for high score and save it
            const highScore = localStorage.getItem('highScore');
            if (highScore === null || this.score > parseInt(highScore)) {
                localStorage.setItem('highScore', this.score);
            }
            this.scene.start("GameOver")
        }
    }

    async updateDiscordStatus() {
        try {
            await discordSdk.setActivity({
                state: `Playing: Health ${this.playerHealth}, Bullets ${this.maxShots - this.shots}`,
                details: "Playing My Phaser Game",
                startTimestamp: Date.now()
            });
        } catch (error) {
            console.error('Failed to update Discord status:', error);
        }
    }

    async sendDiscordMessage(message) {
        try {
            const channelId = process.env.VITE_DISCORD_CLIENT_ID;
            const url = `https://discord.com/api/v9/channels/${channelId}/messages`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: message })
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Failed to send Discord message:', error);
        }
    }
    
}