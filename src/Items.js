import Scene from '@holywater-tech/ads-builder/framework/components/Scene';
import Utils from '@holywater-tech/ads-builder/framework/Utils';
import Item from './Item';
import { EVENTS, LAYERS_DEPTH, POSITION, POSITION4x4, SHEETS } from './constants/Constants';
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
        this.tutorialWords = ['leia', 'han', 'luke', 'anakin'];
        this.initAssets();
        this.buildItems();
        if (!this.isOnce) {
            this.addDisableButton();
        }
    }

    removeInteractive() {
        this.items.forEach((item) => {
            item.base.disableInteractive();
        });
    }

    initAssets() {
        this.addProperties(['pos', 'scale'])
            .setCustomPosition(...POSITION.choices)
            .setCustomScale(0, 0, 0, 0)
            .setCustomAlign('Top')
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
            lScaleX: 0.7,
            lScaleY: 0.7,
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

    showHand(item, delay) {
        this.tweens.add({
            targets: this.hand,
            alpha: 1,
            scale: 1,
            duration: 300,
            delay: delay || 300,
            onStart: () => this.addHandTutorial(item),
        });
    }

    addHandTutorial(current) {
        if (this.items.length === 0 && current) {
            return;
        }

        this.handX = 0;
        this.hand.setAlpha(1).setPosition(this.handX + 20, 400);
        const tweensParam = [];
        this.items
            .filter(({ img }) => current === img.toUpperCase())
            .forEach((item) => {
                this.tweensHand && this.tweens.remove(this.tweensHand);
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
                    // onComplete: () => item.onBaseSelect(),
                };

                tweensParam.push(param, press);
            });

        this.tweensHand = this.tweens.timeline({
            loop: -1,
            targets: this.hand,
            tweens: [...tweensParam],
            // onComplete: () => this.removeHandTutorial(),
        });
    }

    removeHandTutorial() {
        this.hand?.setAlpha(0);
        this.hand.setPosition(20, 200);
        this.tweensHand && this.tweens.remove(this.tweensHand);
        this.tweensHand = null;
        // return this;
    }

    onItemClick() {
        this.removeHandTutorial();
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
