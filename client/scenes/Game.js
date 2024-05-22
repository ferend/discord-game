import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
        this.shots = 0;
        this.maxShots = 6;
        this.playerHealth = 3;
        this.isReloading = false;
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0x00ff00);

        const bg = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background');
        let scaleX = this.cameras.main.width / bg.width + 0.2;
        let scaleY = this.cameras.main.height / bg.height + 0.2;
        let scale = Math.max(scaleX, scaleY);
        bg.setScale(scale).setScrollFactor(0);

        this.player = this.physics.add.sprite(this.cameras.main.width / 2, this.cameras.main.height - 50, 'player');
        this.player.setCollideWorldBounds(true);
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

        this.physics.add.overlap(this.enemies, this.player, this.enemyHitsPlayer, null, this);
    }

    shoot(pointer) {
        if (this.isReloading) {
            return;
        }

        if (this.shots < this.maxShots) {
            const bullet = this.bullets.create(this.player.x, this.player.y, 'bullet');
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

    spawnEnemy() {
        const enemy = this.enemies.create(Phaser.Math.Between(0, this.cameras.main.width), 0, 'enemy');
        this.physics.moveTo(enemy, this.player.x, this.player.y, 50);
    }

    update() {
        this.physics.overlap(this.bullets, this.enemies, this.hitEnemy, null, this);
        this.physics.overlap(this.enemies, this.player, this.enemyHitsPlayer, null, this);
    }

    hitEnemy(bullet, enemy) {
        bullet.destroy();
        enemy.destroy();
    }

    enemyHitsPlayer(player, enemy) {
        enemy.destroy();
        this.playerHealth--;
        this.healthText.setText(`Health: ${this.playerHealth}`);
        if (this.playerHealth <= 0) {
            this.scene.start("GameOver" )
        }
    }
    
}