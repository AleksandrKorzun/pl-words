import Scene from '@holywater-tech/ads-builder/framework/components/Scene';
import Utils from '@holywater-tech/ads-builder/framework/Utils';
import Item from './Item';
import { EVENTS, LAYERS_DEPTH, POSITION4x4, SHEETS } from './constants/Constants';
// import { AUDIO, SHEETS } from './constants/assets';

export default class Items extends Phaser.GameObjects.Container {
    constructor(scene, options) {
        super(scene, 0, 0);
        const { itemsArray, isOnce, isOpenStore } = options;

        this.tweens = scene.tweens;
        this.itemsArray = itemsArray || [];
        this.lengthItem = itemsArray.length;
        this.isOnce = isOnce || false;
        this.isOpenStore = isOpenStore || false;
        this.isPortrait = this.scene.game.size.isPortrait;
        this.gap = this.isPortrait ? 170 : 180;

        this.counter = 0;
        this.initAssets();
        this.buildItems();
        if (!this.isOnce) {
            this.addDisableButton();
        }
    }

    initAssets() {
        this.addProperties(['pos', 'scale'])
            .setCustomPosition(0, -80, 0, -80)
            .setCustomScale(0, 0, 0, 0)
            .setCustomAlign('Center')
            .setDepth(30);
        this.half = Math.floor(this.lengthItem / 2) * 0.5;

        this.scene.emitter.on(EVENTS.ON_ITEM_CLICK, this.onItemClick, this);
    }

    buildItems() {
        // Utils.addAudio(this.scene, AUDIO.TRANSITION, 0.5, false);
        this.items = [];

        this.itemsArray.forEach((img, index) => {
            const x = POSITION4x4[index].x;
            const y = POSITION4x4[index].y;
            const item = new Item(this.scene, {
                item: img,
                isOnce: this.isOnce,
                scale: img.scale,
                isOpenStore: this.isOpenStore,
            })
                .setDepth(2)
                .setScale(0.22)
                .setPosition(x, y);
            this.items.push(item);
            this.add([item]);
        });
        this._sort();
        this.addHand();
        return this.items;
    }

    wrongAnswerAnim() {
        this.items.forEach((item) => {
            if (item.isGlow) {
                this.tweens.add({
                    targets: item,
                    y: '-=15',
                    duration: 500,
                    yoyo: true,
                    ease: 'Sine.in',
                });
                this.tweens.add({
                    targets: item,
                    x: '-=15',
                    delay: 200,
                    duration: 100,
                    yoyo: true,
                    repeat: 2,
                    ease: 'Sine.in',
                });
            }
        });
    }

    correctAnswer() {
        this.items.forEach((item) => {
            if (item.isGlow) {
                this.tweens.add({
                    targets: item,
                    y: -330 + (this.scene.correct - 1) * 130,
                    x: 0,
                    duration: 1000,
                    ease: 'Sine.in',
                });
                this.tweens.add({
                    targets: item,
                    alpha: 0,
                    delay: 900,
                    duration: 200,
                    ease: 'Sine.in',
                });

                item.isSelected = true;
            }
        });
    }
    // addDisableButton() {
    //     const x = this.isPortrait ? -210 : 280;
    //     const y = this.isPortrait ? 180 : 180;

    //     this.buttonOk = this.scene.add
    //         .image(0, 0, 'atlas', SHEETS.BUTTON_DISABLE)
    //         .setScale(0)
    //         .setPosition(x, y)
    //         .setDepth(LAYERS_DEPTH.BUTTON);
    //     this.add([this.buttonOk]);
    //     this._sort();
    //     this.buttonOkGlow = this.scene.add
    //         .image(0, 0, 'atlas', SHEETS.BUTTON_ENABLE_GLOW)
    //         .setScale(1.1)
    //         .setAlpha(0)
    //         .setPosition(x, y)
    //         .setDepth(LAYERS_DEPTH.BUTTON - 1);
    //     this.add([this.buttonOk, this.buttonOkGlow]);
    //     this._sort();
    //     this.tweens.add({
    //         targets: this.buttonOk,
    //         scale: 1.1,
    //         duration: 500,
    //         delay: 1000,
    //         ease: 'Sine.out',
    //     });
    // }

    // addEnableButton() {
    //     this.buttonOk.setTexture('atlas', SHEETS.BUTTON_ENABLE);
    //     this.tweens.add({
    //         targets: this.buttonOkGlow,
    //         alpha: 1,
    //         duration: 500,
    //         delay: 500,
    //         yoyo: true,
    //         repeat: -1,
    //         ease: 'Sine.out',
    //     });
    //     this.buttonOk.setInteractive().once('pointerdown', this.onClick, this);
    // }

    removeButtonOk() {
        this.tweens.add({
            targets: [this.buttonOk, this.buttonOkGlow],
            alpha: 0,
            scale: 0,
            duration: 300,
            delay: 300,
            ease: 'Sine.out',
        });
    }

    removeTint() {
        this.items.forEach((obj, index) => {
            if (this.counter === index) {
                obj.removeTint();
            }
        });
    }

    show(options = {}) {
        this.tweens.add({
            targets: this,
            lScaleX: 0.95,
            lScaleY: 0.95,
            pScaleX: 0.8,
            pScaleY: 0.8,
            duration: 500,
            delay: 700,
            ease: 'Sine.out',
            ...options,
            // onStart: () => this.showHand(),
        });
        return this;
    }

    remove() {
        this.tweens.add({
            targets: this,
            lScaleX: 0,
            lScaleY: 0,
            pScaleX: 0,
            pScaleY: 0,
            delay: 500,
            duration: 500,
            onComplete: () => {
                this.setVisible(false);
                if (!this.isOnce) {
                    this.scene.emitter.emit(EVENTS.SHOW_NEXT_ITEM, this);
                }
            },
        });
        return this;
    }

    removeVisible() {
        this.items &&
            this.items.forEach((obj) => {
                obj.disable();
                this.tweens.add({
                    targets: obj,
                    ly: 300,
                    py: 300,
                    scale: 0,
                    delay: 500,
                    duration: 500,
                    ease: 'Sine.out',
                });
            });
    }

    hide() {
        this.tweens.add({
            targets: this,
            lx: Scene.LANDSCAPE_MAX_WIDTH,
            px: Scene.PORTRAIT_MAX_WIDTH,
            duration: 750,
        });
        return this;
    }

    clear() {
        if (!this.items) {
            return this;
        }
        Utils.destroy([this.items]);
        return this;
    }

    get Items() {
        return this.items;
    }

    addHand() {
        this.handX = -100;
        this.handY = 400;
        this.hand = this.scene.add
            .image(0, 0, 'atlas', SHEETS.HAND_TUTORIAL)
            .setDepth(LAYERS_DEPTH.HAND_TUTORIAL)
            .setPosition(this.handX, this.handY)
            .setAlpha(0)
            .setScale(0);
        this.add([this.hand]);
        this._sort();
    }

    showHand() {
        this.tweens.add({
            targets: this.hand,
            alpha: 1,
            scale: 1,
            duration: 300,
            delay: 300,
            onStart: () => (this.isDrag ? this.addHandTutorialDrag() : this.addHandTutorial()),
        });
    }

    addHandTutorial() {
        if (this.items.length === 0) {
            return;
        }

        this.handX = this.items[0].x;
        this.hand.setAlpha(1).setPosition(this.handX + 20, 200);
        const tweensParam = [];
        this.items
            .filter(({ img }) => ['LEIA', 'HAN', 'LUKE', 'ANAKIN'].includes(img.toUpperCase()))
            .forEach((item) => {
                const press = {
                    scale: 0.9,
                    yoyo: true,
                    duration: 300,
                    startDelay: 300,
                    targets: this.hand,
                };
                const param = {
                    delay: 300,
                    duration: 300,
                    x: item.x + 75,
                    y: item.y + 90,
                    onComplete: () => item.onBaseSelect(),
                };

                tweensParam.push(param, press);
            });

        this.tweensHand = this.tweens.timeline({
            targets: this.hand,
            tweens: [...tweensParam],
            onComplete: () => this.removeHandTutorial(),
        });
    }

    removeHandTutorial() {
        this.hand.setAlpha(0);
        this.tweens.remove(this.tweensHand);
        return this;
    }

    onItemClick() {
        // this.counter += 1;
        // if (this.counter === 1 && !this.isOnce) {
        //     this.addEnableButton();
        // }
        // if (this.isOnce) {
        //     // this.removeHandTutorial();
        //     // this.remove();
        //     // this.items.forEach((obj) => {
        //     //     // obj.disable();
        //     //     obj.removeInteractive();
        //     // });
        // }
    }

    onClick() {
        this.removeHandTutorial();
        this.remove();
        this.removeButtonOk();
        this.items.forEach((obj) => {
            obj.disable();
            obj.removeInteractive();
        });
    }

    hideAllGlow() {
        this.items.forEach((obj) => obj.removeGlow());
        return this;
    }
}
