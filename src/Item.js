// import Utils from '@holywater-tech/ads-builder/framework/Utils';
import { EVENTS, LAYERS_DEPTH, SHEETS } from './constants/Constants';

export default class Item extends Phaser.GameObjects.Container {
    constructor(scene, options) {
        super(scene, 0, 0);
        const { item, isOnce, isOpenStore, scale } = options;

        this.tweens = scene.tweens;
        this.img = item;
        this.isOnce = false;
        this.isOpenStore = isOpenStore || false;
        this.scaleImg = scale;
        this.addBase();
        setTimeout(() => this.addBaseInteractive(), 11000);
        this.addGlow();
        this.initListener();
        this.isGlow = false;
        this.isSelected = false;
    }

    initListener() {
        this.scene.emitter.on(EVENTS.ON_ITEM_CLICK, this.onItemsClick, this);
    }

    removeGlow() {
        this.glow?.setAlpha(0);
        return this;
    }

    addGlow() {
        this.glow = this.scene.add.image(0, 0, `${this.img}_glow`).setDepth(LAYERS_DEPTH.ITEM_GLOW).setAlpha(0);
        this.add([this.glow]);
        this._sort();
    }

    addBase() {
        this.base = this.scene.add.image(0, 0, this.img).setDepth(LAYERS_DEPTH.ITEM_BASE);
        this.add([this.base]);
        this._sort();
    }

    addBaseInteractive() {
        if (this.isOnce) {
            this.base.setInteractive().once('pointerdown', this.onClick, this);
        } else {
            this.base.setInteractive().on('pointerdown', this.onClick, this);
        }
    }

    removeInteractive() {
        this.base.disableInteractive();
    }

    onBaseSelect() {
        this.tweens.add({
            targets: this,
            scale: 0.24,
            yoyo: true,
            duration: 300,
            ease: 'Sine.out',
        });

        if (this.scene.counter < 4 && !this.isGlow) {
            this.scene.counter += 1;
            this.tweens.add({
                targets: this.glow,
                alpha: 1,
                duration: this.scene.counter > 4 ? 100 : 300,
                yoyo: this.scene.counter > 4,
                ease: 'Sine.in',
            });
            this.scene.choice.push(this);

            this.isGlow = true;
            return this;
        }
        if (this.isGlow && this.scene.counter > 0) {
            this.scene.counter -= 1;
            this.tweens.add({
                targets: this.glow,
                alpha: 0,
                duration: this.scene.counter > 4 ? 100 : 300,
                yoyo: this.scene.counter > 4,
                ease: 'Sine.in',
            });
            const choice = this.scene.choice.filter((item) => item.img !== this.img);
            this.scene.choice = choice;
            this.isGlow = false;
        }

        return this;
    }

    onClick() {
        // const tapAudio = this.tap ? this.tap : AUDIO.TAP;
        // Utils.addAudio(this.scene, tapAudio, 0.5, false);
        if (this.isOpenStore) {
            this.scene.emitter.emit(EVENTS.OPEN_STORE, this);
        } else {
            this.scene.emitter.emit(EVENTS.ON_ITEM_CLICK, this);
        }
        this.onBaseSelect();
    }

    onItemsClick(obj) {
        // if (obj === this) {
        //     return;
        // }
        // this.isSelected = false;
    }
}
