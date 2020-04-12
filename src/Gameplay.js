var game = new Phaser.Game(370, 550, Phaser.CANVAS, 'gameblock');

var Gameplay = {



    preload: function() {
        game.stage.backgroundColor = '#000000';

        game.load.image('background', 'assets/img/background.png');
        game.load.image('ship', 'assets/img/ship.png');
        game.load.image('laser', 'assets/img/laser.png');
        game.load.image('enemy', 'assets/img/enemy1_1.png');
        game.load.image('explosion', 'assets/img/explosionpurple.png');

    },
    create: function() {
        this.bgGame = game.add.tileSprite(0, 0, 370, 550, 'background');
        this.bulletTime = 0; //tiempo de la ultima bala

        this.ship = game.add.sprite(game.width / 2, 500, 'ship');
        this.ship.anchor.setTo(0.5);

        game.physics.arcade.enable(this.ship);
        this.ship.body.collideWorldBounds = true;

        this.cursors = game.input.keyboard.createCursorKeys();
        this.shoot_key = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        this.bullets = game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

        this.bullets.createMultiple(30, 'laser');

        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 1);

        this.bullets.setAll('outOfBoundsKill', true);
        this.bullets.setAll('checkWorldBounds', true);

        //enemigos

        this.enemies = game.add.group();
        this.enemies.enableBody = true;
        this.enemies.physicsBodyType = Phaser.Physics.ARCADE;

        for (var y = 0; y < 6; y++) {
            for (var x = 0; x < 7; x++) {
                this.enemy = this.enemies.create(x * 40, y * 20, 'enemy');
                this.enemy.anchor.setTo(0.5);
                this.enemy.scale.setTo(0.112, 0.112);
            }
        }

        this.enemies.x = 25;
        this.enemies.y = 50;

        this.animationEnemies = game.add.tween(this.enemies).to({ x: 100 }, 1000, Phaser.Easing.Linear.None, true, 0, 1000, true);

        this.animationEnemies.onLoop.add(this.descender, this);

        this.explosionGroup = game.add.group();
        this.explosionGroup.x = 25;
        this.explosionGroup.y = 50;

        for (var i = 0; i < 10; i++) {
            this.explosion = this.explosionGroup.create(100, 100, 'explosion'); //se agrega la imagen de explosion (grupo)
            this.explosion.tweenScale = game.add.tween(this.explosion.scale).to({
                x: [0.4, 0.8, 0.4],
                y: [0.4, 0.8, 0.4]

            }, 600, Phaser.Easing.Exponential.Out, false, 0, 0, false);

            this.explosion.tweenAlpha = game.add.tween(this.explosion).to({
                alpha: [1, 0.6, 0]
            }, 600, Phaser.Easing.Exponential.Out, false, 0, 0, false);

            this.explosion.anchor.setTo(0.5);
            this.explosion.scale.setTo(0.112, 0.112);
            this.explosion.kill();

        }

        this.explosion.tweenScale = game.add.tween(this.explosion.scale).to({
            x: [0.4, 0.8, 0.4],
            y: [0.4, 0.8, 0.4]

        }, 600, Phaser.Easing.Exponential.Out, false, 0, 0, false);

        this.explosion.tweenAlpha = game.add.tween(this.explosion).to({
            alpha: [1, 0.6, 0]
        }, 600, Phaser.Easing.Exponential.Out, false, 0, 0, false);

        this.animationExplosion = game.add.tween(this.explosionGroup).to({ x: 100 }, 1000, Phaser.Easing.Linear.None, true, 0, 1000, true);
        this.animationExplosion.onLoop.add(this.descender, this);
    },

    descender: function() {
        this.explosionGroup.y += 10;
    },

    colision: function(bullet, enemy) {
        bullet.kill();
        enemy.kill();

        this.explosion.reset(enemy.x, enemy.y);
        this.explosion.tweenScale.start();
        this.explosion.tweenAlpha.start();
        this.explosion.tweenAlpha.onComplete.add(function(currentTarget, currentTween) {
            currentTarget.kill();
        }, this);
    },

    update: function() {
        if (this.cursors.right.isDown) {

            this.ship.position.x += 3;

        } else if (this.cursors.left.isDown) {

            this.ship.position.x -= 3;

        }
        if (this.shoot_key.isDown) {

            if (game.time.now > this.bulletTime) {

                this.bullet = this.bullets.getFirstExists(false); //se toma una bala
            }

            if (this.bullet) {

                this.bullet.reset(this.ship.x, this.ship.y);
                this.bullet.body.velocity.y = -300;
                this.bulletTime = game.time.now + 50;

            }
        }

        game.physics.arcade.overlap(this.bullets, this.enemies, this.colision, null, this);

    }

};

game.state.add('Main', Gameplay);
game.state.start('Main');