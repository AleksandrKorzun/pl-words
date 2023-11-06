import { LAYERS_DEPTH } from './constants/Constants';

export default class Mistakes extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene, 0, 0);
        this.counter = [0, 1, 2, 3];
        this.countLives = 4;
        this.addText();
        this.addMistakes();
        this.initAssets();
    }

    initAssets() {
        this.addProperties(['pos'])
            .setCustomPosition(0, 180, 0, 180)
            .setScale(1)
            .setCustomAlign('Center')
            .setDepth(LAYERS_DEPTH.ITEMS);
    }

    addText() {
        this.text = this.scene.add
            .text(0, 0, 'Mistakes remaining:', {
                fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
                fontSize: '24px',
                color: 'black',
            })
            .setDepth(37)
            .setOrigin(0.5, 0.5)
            .setPosition(-100, 0);

        this.add([this.text]);
        this._sort();
    }

    addMistakes() {
        this.lives = [];
        this.counter.forEach((idx) => {
            const pos = [50, 90, 130, 170];
            const circle = this.scene.add
                .image(0, 0, 'atlas', 'circle')
                .setPosition(pos[idx], 0)
                .setScale(0.7)
                .setDepth(LAYERS_DEPTH.MISTAKES);
            this.lives.push(circle);
            this.add([circle]);
            this._sort();
        });
    }

    removeLives() {
        this.countLives -= 1;
        if (this.countLives >= 0) {
            this.scene.tweens.add({
                targets: this.lives,
                y: '-=10',
                duration: 500,
                yoyo: true,
                ease: 'Sine.in',
                onComplete: () => {
                    this.lives[this.countLives]?.destroy();
                },
            });
        }
    }
}
