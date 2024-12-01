import { _decorator, Button, Component, dragonBones, find, instantiate, Label, Node, Prefab, Sprite, Vec3 } from 'cc';
import * as i18n from 'db://i18n/LanguageData';
import { CoinsCfg } from '../config/CoinsCfg';
import { EventCfg } from '../config/EventCfg';
import { RingItemCfg } from '../config/RingItemCfg';
import { AudioHandle } from '../lib/AudioManager';
import { EventHandle } from '../lib/EventManager';
import { GameUtils } from '../lib/GameUtils';
import { PopupHandle } from '../lib/PopupManager';
import { ResHandle } from '../lib/ResManager';
import { CoinItem } from './CoinItem';
import { Column } from './Column';
import { FireBorder } from './FireBorder';
import { GlobalHandle } from './GlobalData';
import { RewardNum } from './RewardNum';

const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {
    @property(Node)
    private coinList:Node = null;
    @property(Node)
    private grids:Node = null;
    @property(Node)
    private light:Node = null;
    @property(Node)
    private fireBorder:Node = null;
    @property(Node)
    private freeTipNode:Node = null;
    @property(Node)
    private bonusTipNode:Node = null;
    @property(Node)
    private autoSettingBtn:Node = null;
    @property(Node)
    private increseBtn:Node = null;
    @property(Node)
    private reduceBtn:Node = null;
    @property(Node)
    private helpBtn:Node = null;
    @property(Node)
    private startBtn:Node = null;
    @property(Node)
    private bigWin:Node = null;

    @property(Prefab)
    private coinItemPrefab:Prefab = null;
    @property(Prefab)
    private columnPrefab:Prefab = null;

    @property(Label)
    private coinTitle:Label = null;
    @property(Label)
    private coinNum:Label = null;
    @property(Label)
    private lastWin:Label = null;

    @property(Label)
    private topTips:Label = null;
    @property(Label)
    private bottomTips:Label = null;

    @property(Label)
    private freeNum:Label = null;

    @property(Sprite)
    private bg:Sprite = null;

    @property(dragonBones.ArmatureDisplay)
    private dragon:dragonBones.ArmatureDisplay = null;
    @property(dragonBones.ArmatureDisplay)
    private fire:dragonBones.ArmatureDisplay = null;
    @property(dragonBones.ArmatureDisplay)
    private scene:dragonBones.ArmatureDisplay = null;
    @property(dragonBones.ArmatureDisplay)
    private stoneRain:dragonBones.ArmatureDisplay = null;


    private columns:Node[] = [];
    private columnsWidth:number = 174;
    private columnsGap:number = -348;
    private freeTime:number = 0;
    private gameStatus:number = CoinsCfg.GamePlayStatusNormal; // 0 normal 1 playing
    private isAuto:boolean = false;
    private dragonStatus:number = 0; // 0 无 1进 2喷火 3 喷火完成 4 出金币 5 出金币完成 6 飞走

    async start() {
        EventHandle.on(EventCfg.Settle, this.Settle.bind(this));
        EventHandle.on(EventCfg.AutoSetting, this.autoPlay.bind(this));

        this.initAudio();
        this.initDragon();
        this.initCoins();
        this.initColumn();
    }

    update(deltaTime: number) {
        
    }

    initAudio() {
        AudioHandle.playByBundle("game", "audio/game", 1);
    }

    initColumn() {
        for (let i = 0; i < 5; i++) {
            let col = instantiate(this.columnPrefab);
            col.setPosition(new Vec3(i *this.columnsWidth + this.columnsGap, 0, 1));
            col.getComponent(Column).init();
            this.grids.addChild(col);
            this.columns.push(col);
        }
    }

    initCoins() {
        EventHandle.on(EventCfg.ChangeCoin, this.changeCoin.bind(this));

        for (let k in CoinsCfg.List) {
            let item = instantiate(this.coinItemPrefab);
            item.getComponent(CoinItem).init(CoinsCfg.List[k].Title, 100);
            this.coinList.addChild(item);
        }
    }

    initDragon() {
        this.dragon.node.active = false;
        this.fire.node.active = false;
        this.dragon.addEventListener(dragonBones.EventObject.COMPLETE, this.dragonActionComplete, this);
    }

    async Settle(d) {
        let fireBorderPfb = await ResHandle.loadPrefab("game", "prefab/FireBorder");

        let data = [];
        let freeGames = [];
        let alreayFire = [];
        for (let k in this.columns) {
            let colContent = this.columns[k].getComponent(Column).getContent();
            for (let j in colContent) {
                if (colContent[j] == RingItemCfg.FreeGameItemId) {
                    freeGames.push(Number(k) * 100 + Number(j));
                }
            }
            data.push(colContent);
        }

        // 判断线
        for (let k in RingItemCfg.WinLines) {
            let fstCol = RingItemCfg.WinLines[k][0].col;
            let fstRow = RingItemCfg.WinLines[k][0].row;
            let checkCount = 0;
            for (let m in RingItemCfg.WinLines[k]) {
                let col = RingItemCfg.WinLines[k][m].col;
                let row = RingItemCfg.WinLines[k][m].row;
                if (data[col][row] == data[fstCol][fstRow]) {
                    checkCount++;
                }
            }
            if (checkCount == 5) {
                // win
                for (let m in RingItemCfg.WinLines[k]) {
                    let x = RingItemCfg.WinLines[k][m].col *this.columnsWidth + this.columnsGap;
                    let y = (RingItemCfg.WinLines[k][m].row - 1) * this.columnsWidth;

                    // 记录正在播的动画 免费游戏去重操作
                    alreayFire.push(RingItemCfg.WinLines[k][m].col * 100 + RingItemCfg.WinLines[k][m].row);

                    let fireItem = instantiate(fireBorderPfb);
                    fireItem.setPosition(new Vec3(x, y, 1));
                    fireItem.getComponent(FireBorder).playBorder();
                    this.fireBorder.addChild(fireItem);

                    fireItem = instantiate(fireBorderPfb);
                    fireItem.setPosition(new Vec3(x, y, 1));
                    fireItem.getComponent(FireBorder).playBg();
                    this.light.addChild(fireItem);

                    this.columns[RingItemCfg.WinLines[k][m].col].getComponent(Column).playActionByIndex(RingItemCfg.WinLines[k][m].row, "active");
                }

                // sort
                this.sortFireEffect();
            }
        }

        // 判断是否有法师进入免费游戏
        if (freeGames.length >= 3) {
            for (let j in freeGames) {
                let play = true;
                for (let l in alreayFire) {
                    if (alreayFire[l] == freeGames[j]) {
                        play = false;
                    }
                }

                if (play) {
                    let col = Math.floor(freeGames[j] / 100);
                    let row = freeGames[j] % 100;

                    let x = col *this.columnsWidth + this.columnsGap;
                    let y = (row - 1) * this.columnsWidth;
                    let fireItem = instantiate(fireBorderPfb);
                    fireItem.setPosition(new Vec3(x, y, 1));
                    fireItem.getComponent(FireBorder).playBorder();
                    this.fireBorder.addChild(fireItem);

                    fireItem = instantiate(fireBorderPfb);
                    fireItem.setPosition(new Vec3(x, y, 1));
                    fireItem.getComponent(FireBorder).playBg();
                    this.light.addChild(fireItem);

                    this.columns[col].getComponent(Column).playActionByIndex(row, "active");
                }
            }
            // sort
            this.sortFireEffect();
            this.freeTime += CoinsCfg.FreeTimes;
            this.gameStatus = CoinsCfg.GamePlayStatusFree;

            // 2秒后出龙
            this.scheduleOnce(() => {
                this.dragonStatus = 1;
                this.dragonAction("enter");
                this.playStoneRain();
                this.freeTipNode.active = true;
                this.bonusTipNode.active = false;
                // 自动玩5次
                this.freeNum.string = `${this.freeTime}`;
            }, 2);
        } else if (this.gameStatus == CoinsCfg.GamePlayStatusPlaying) {
            // free status cant change to normal
            this.gameStatus = CoinsCfg.GamePlayStatusNormal;
        }

        if (this.freeTime > 0) {
            this.scheduleOnce(this.freePlay, 3);
        } else {
            // 普通状态下 如果有自动情况 则结算后自动开始
            this.gameStatus = CoinsCfg.GamePlayStatusNormal;
            this.setButtonStyle();
            if (this.isAuto) {
                this.scheduleOnce(this.autoPlay, 3);
            }

            if (this.dragonStatus == 2) {
                this.dragonAction("fire");
                this.dragonStatus = 3;
            }
        }
        
    }

    freePlay() {
        if (this.freeTime <= 0) {
            return;
        }

        this.freeTime--;
        this.freeNum.string = `${this.freeTime}`;
        this.play();
        if (this.freeTime <= 0) {
            this.dragonStatus = 2;
        }
    }

    autoPlay() {
        let autoIcon = find("auto", this.autoSettingBtn);
        let pauseIcon = find("pause", this.autoSettingBtn);
        let numIcon = find("num", this.autoSettingBtn);

        autoIcon.active = GlobalHandle.autoSettingData.CurrentNum <= 0;
        pauseIcon.active = !autoIcon.active;
        numIcon.active = pauseIcon.active;

        if (GlobalHandle.autoSettingData.CurrentNum <= 0) {
            this.isAuto = false;
            return;
        } else {
            this.isAuto = true;
        }

        GlobalHandle.autoSettingData.CurrentNum--;
        this.gameStatus = CoinsCfg.GamePlayStatusPlaying;
        this.play();
        numIcon.getComponent(Label).string = `${GlobalHandle.autoSettingData.CurrentNum}`;
        if (GlobalHandle.autoSettingData.CurrentNum <= 0) {
            autoIcon.active = true;
            pauseIcon.active = false;
            numIcon.active = false;
        }
    }

    onClickCoins(event, customData) {
        this.coinList.active = !this.coinList.active;
        find("arrow", this.coinList.parent).scale = new Vec3(1, this.coinList.active? -1 : 1, 1);
    }

    onClickPlay() {
        if (this.gameStatus != CoinsCfg.GamePlayStatusNormal) {
            this.notice("game.gaming", 1);
            return;
        }
        if (GlobalHandle.autoSettingData.CurrentNum > 0) {
            this.notice("game.autoing", 1);
            return;
        }

        this.gameStatus = CoinsCfg.GamePlayStatusPlaying;
        this.play();
    }

    play() {
        this.setButtonStyle();
        this.fireBorder.removeAllChildren();
        this.light.removeAllChildren();

        for (let k in this.columns) {
            this.columns[k].getComponent(Column).roll();
        }

        // todo
        this.scheduleOnce(this.onClickStop, 2);
    }

    onClickStop(event, customData) {

        let rand = GameUtils.getRandomInt(1, 10);
        if (rand <=4) {
            let WinLinesindex = GameUtils.getRandomInt(1, RingItemCfg.WinLines.length -1);
            let index = GameUtils.getRandomInt(0, RingItemCfg.ItemIds.length - 1);
            let itemId = RingItemCfg.ItemIds[index];
            for (let k in this.columns) {
                let reward = [];
                for (let i = 0; i < 3; i++) {
                    if (RingItemCfg.WinLines[WinLinesindex][k].row == i) {
                        reward.push(itemId);
                    } else {
                        let index = GameUtils.getRandomInt(0, RingItemCfg.ItemIds.length - 1);
                        let nitemId = RingItemCfg.ItemIds[index];
                        reward.push(nitemId);
                    }
                }
                this.columns[k].getComponent(Column).reward(reward);
            }
        } else {
            for (let k in this.columns) {
                let reward = [];
                for (let i = 0; i < 3; i++) {
    
                    let index = GameUtils.getRandomInt(0, RingItemCfg.ItemIds.length - 1);
                    let itemId = RingItemCfg.ItemIds[index];
                    reward.push(itemId);
                }
                this.columns[k].getComponent(Column).reward(reward);
            }
        }


        this.scheduleOnce(this.Settle, 0.5);
    }

    async onClickAutoSetting(event, customData) {
        if (GlobalHandle.autoSettingData.CurrentNum>0) {
            GlobalHandle.autoSettingData.CurrentNum = 0;
            this.autoPlay();
            return;
        }

        // load auto setting
        PopupHandle.open("game", "prefab/AutoSetting");
    }

    changeCoin(data) {
        this.coinList.active = false;
        this.coinTitle.string = `${data.title}`;
        this.coinNum.string = `${data.num}`;
        find("arrow", this.coinList.parent).scale = new Vec3(1, 1, 1);
    }

    setLastWin(win:number) {
        this.lastWin.string = `${win}`;
    }

    // 1 top 2 bottom
    notice(key:string, category:number) {
        let msg = String(i18n.t(key));
        if (category == 1) {
            this.topTips.node.parent.active = true;
            this.topTips.string = msg;
            this.scheduleOnce(() => {
                this.topTips.node.parent.active = false;
            }, 3);
        } else {
            this.bottomTips.node.parent.active = true;
            this.bottomTips.string = msg;
            this.scheduleOnce(() => {
                this.bottomTips.node.parent.active = false;
            }, 3);
        }
    }

    private sortFireEffect() {
        let allFireItems = this.fireBorder.children;
        let allFireItemsLen = allFireItems.length;
        for (let j in allFireItems) {
            let siblingIndex = allFireItemsLen;
            switch (allFireItems[j].position.x) {
                case 0:
                    siblingIndex = allFireItemsLen;
                    break;
                case 174:
                    siblingIndex = allFireItemsLen - 1;
                    break;
                case -174:
                    siblingIndex = allFireItemsLen - 1;
                    break;
                case 348:
                    siblingIndex = allFireItemsLen - 2;
                    break;
                case -348:
                    siblingIndex = allFireItemsLen - 2;
                    break;
            }
            allFireItems[j].setSiblingIndex(siblingIndex);
        }
    }

    /**
     * Dragon 动作
     */
    dragonAction(act:string) {
        switch (act) {
            case "fire":
                this.fire.node.active = true;
                this.dragon.playAnimation("active", 1);
                this.fire.playAnimation("fire", 1);
                break;
            case "enter":
                ResHandle.setSpriteFrame("game", "texture/bg/bonus", this.bg);
                AudioHandle.playOneShotByBundle("game", "audio/enter", 1);
                if (!this.dragon.node.active) {
                    this.dragon.playAnimation("enter", 1);
                    this.dragon.node.active = true;
                }
                this.scene.playAnimation("changjing-2", 0);
                this.playStoneRain();
                break;
            case "exit":
                this.dragon.playAnimation("exit", 1);
                break;
            case "idle":
                this.dragon.playAnimation("idle", 0);
                break;

        }
    }


    dragonActionComplete() {
        switch (this.dragon.animationName) {
            case "enter":
                this.dragonAction("idle");
                break;
            case "active":
                this.dragonFireComplete();
                break;
            case "exit":
                this.dragonExitComplete();
                break;
        }
    }

    playStoneRain() {
        this.stoneRain.node.active = true;
        this.stoneRain.playAnimation("yunshiyu", 1);
        this.stoneRain.addEventListener(dragonBones.EventObject.COMPLETE, this.stoneRainComplete, this);
    }

    dragonFireComplete() {
        this.dragonAction("idle");
        this.freeTipNode.active = false;
        this.bonusTipNode.active = true;
        if (this.dragonStatus == 3) {
            this.dragonStatus = 4;
            this.playBigWin(100);
        }
    }

    dragonExitComplete() {
        this.dragon.node.active = false;
        ResHandle.setSpriteFrame("game", "texture/bg/default", this.bg);
        this.scene.playAnimation("changjing-1", 0);
    }

    stoneRainComplete() {
        this.stoneRain.node.active = false;
        this.stoneRain.removeEventListener(dragonBones.EventObject.COMPLETE, this.stoneRainComplete, this);
    }

    playBigWin(winNum:number) {
        this.bigWin.active = true;
        let anim = find("anim", this.bigWin);
        let armature = anim.getComponent(dragonBones.ArmatureDisplay);
        armature.playAnimation("active", 1);
        armature.addEventListener(dragonBones.EventObject.COMPLETE, () => {
            this.dragonAction("exit");
            armature.removeEventListener(dragonBones.EventObject.COMPLETE, () => {}, this);
            this.bigWin.active = false;
            this.dragonStatus = 0;
        }, this);

        let boxNum = find("RewardNum", this.bigWin);
        let boxLabel = boxNum.getComponent(RewardNum);
        boxLabel.setNum(winNum, 3, 9);
    }

    setButtonStyle() {
        console.log("setButtonStyle", this.gameStatus);
        let startSprite = this.startBtn.getComponent(Sprite);
        let startButton = this.startBtn.getComponent(Button);
        let startIcon = find("stratIcon", this.startBtn);

        let helpSprite = this.helpBtn.getComponent(Sprite);
        let helpButton = this.helpBtn.getComponent(Button);
        let helpIcon = find("icon", this.helpBtn);


        let autoSprite = this.autoSettingBtn.getComponent(Sprite);
        let autoButton = this.autoSettingBtn.getComponent(Button);
        let autoIcon = find("auto", this.autoSettingBtn);
        let pauseIcon = find("pause", this.autoSettingBtn);

        let increseSprite = this.increseBtn.getComponent(Sprite);
        let increseButton = this.increseBtn.getComponent(Button);

        let reduceSprite = this.reduceBtn.getComponent(Sprite);
        let reduceButton = this.reduceBtn.getComponent(Button);

        if (this.gameStatus == CoinsCfg.GamePlayStatusNormal) {
            startButton.interactable = true;
            startSprite.grayscale = false;
            startIcon.getComponent(Sprite).grayscale = false;

            autoSprite.grayscale = false;
            autoButton.interactable = true;

            helpSprite.grayscale = false;
            helpButton.interactable = true;
            helpIcon.getComponent(Sprite).grayscale = false;
            autoIcon.getComponent(Sprite).grayscale = false;
            pauseIcon.getComponent(Sprite).grayscale = false;


            increseSprite.grayscale = false;
            increseButton.interactable = true;

            reduceSprite.grayscale = false;
            reduceButton.interactable = true;

        } else if (this.gameStatus == CoinsCfg.GamePlayStatusFree) {
            startButton.interactable = true;
            startSprite.grayscale = false;

            autoSprite.grayscale = true;
            autoButton.interactable = false;

            helpSprite.grayscale = true;
            helpButton.interactable = false;
            helpIcon.getComponent(Sprite).grayscale = true;

            autoSprite.grayscale = true;
            autoButton.interactable = false;
            autoIcon.getComponent(Sprite).grayscale = true;
            pauseIcon.getComponent(Sprite).grayscale = true;

            increseSprite.grayscale = true;
            increseButton.interactable = false;

            reduceSprite.grayscale = true;
            reduceButton.interactable = false;
        } else if (this.gameStatus == CoinsCfg.GamePlayStatusPlaying) {
            startButton.interactable = false;
            startSprite.grayscale = true;
            startIcon.getComponent(Sprite).grayscale = true;

            helpSprite.grayscale = true;
            helpButton.interactable = false;

            helpIcon.getComponent(Sprite).grayscale = true;
            if (this.isAuto) {
                autoSprite.grayscale = false;
                autoButton.interactable = true;
                autoIcon.getComponent(Sprite).grayscale = false;
                pauseIcon.getComponent(Sprite).grayscale = false;
            } else {
                autoSprite.grayscale = true;
                autoButton.interactable = false;
                autoIcon.getComponent(Sprite).grayscale = true;
                pauseIcon.getComponent(Sprite).grayscale = true;
            }

            increseSprite.grayscale = true;
            increseButton.interactable = false;

            reduceSprite.grayscale = true;
            reduceButton.interactable = false;
        }
    }
}

