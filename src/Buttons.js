// import Utils from '@holywater-tech/ads-builder/framework/Utils';
import { EVENTS, LAYERS_DEPTH, SHEETS } from './constants/Constants';

export default class Buttons extends Phaser.GameObjects.Container {
    constructor(scene, img, pos, onClick) {
        super(scene, 0, 0);
        // this.addBase();
        // this.addItem();
        // this.addGlow();
        // this.addShuffle();
        // this.addDeselect();
        this.onClick = onClick;
        this.img = img;
        this.addButton(pos);
        setTimeout(() => this.addBaseInteractive(), 11000);
        this.initAssets();
        // this.initListener();
        // this.addText();
    }

    // initListener() {

    // }

    initAssets() {
        this.addProperties(['pos']).setCustomPosition(0, 250, 0, 250).setCustomAlign('Center').setDepth(LAYERS_DEPTH.ITEM);
    }

    addButton(pos) {
        this.button = this.scene.add.image(pos.x, pos.y, 'atlas', this.img).setScale(1.1).setDepth(LAYERS_DEPTH.ITEM);
        this.glow = this.scene.add
            .image(pos.x, pos.y, 'atlas', `${this.img}_glow`)
            .setScale(1.1)
            .setDepth(LAYERS_DEPTH.ITEM)
            .setAlpha(0);
        this.add([this.button, this.glow]);
        this._sort();
    }

    addDeselect() {
        this.deselect = this.scene.add.image(0, 0, 'atlas', 'btn_deselect').setScale(1.1).setDepth(LAYERS_DEPTH.ITEM);
        this.add([this.deselect]);
        this._sort();
    }

    addSubmit() {
        this.submit = this.scene.add.image(200, 0, 'atlas', 'btn_submit').setScale(1.1).setDepth(LAYERS_DEPTH.ITEM);
        this.add([this.submit]);
        this._sort();
    }

    disable() {
        this.item.off('pointerdown');
        return this;
    }

    removeGlow() {
        this.glow?.setAlpha(0);
        return this;
    }

    addGlow() {
        this.glow = this.scene.add.image(0, 0, 'atlas', SHEETS.ITEM_GLOW).setDepth(LAYERS_DEPTH.ITEM_GLOW).setAlpha(0);
        this.add([this.glow]);
        this._sort();
    }

    addBase() {
        this.base = this.scene.add.image(0, 0, 'atlas', SHEETS.ITEM_BASE).setDepth(LAYERS_DEPTH.ITEM_BASE);
        this.add([this.base]);
        this._sort();
    }

    onBtnClick() {
        this.scene.tweens.add({
            targets: this,
            scale: 0.98,
            yoyo: true,
            duration: 300,
            ease: 'Sine.out',
        });
        this.scene.tweens.add({
            targets: this.glow,
            alpha: 1,
            duration: 400,
            yoyo: true,
            ease: 'Sine.in',
        });
        this.onClick();
    }

    addBaseInteractive() {
        if (this.isOnce) {
            this.button.setInteractive().once('pointerdown', this.onBtnClick, this);
        } else {
            this.button.setInteractive().on('pointerdown', this.onBtnClick, this);
        }
    }
}
