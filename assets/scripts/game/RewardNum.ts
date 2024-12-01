import { _decorator, Component, Node, Sprite, SpriteFrame, Vec3 } from 'cc';
import { GameUtils } from '../lib/GameUtils';
const { ccclass, property } = _decorator;

@ccclass('RewardNum')
export class RewardNum extends Component {
    @property([SpriteFrame])
    private numSpriteFrame:SpriteFrame[] = [];
    private interval:number = 0;
    private num:number = 0;
    private step:number = 0;
    private current:number = 0;
    private speed:number = 10;
    private pow:number = 0;
    private count:number = 0;

    protected update(dt: number): void {
        if (this.interval == 0) {
            return;
        }

        this.count+=dt;
        if (this.count > this.interval) {
            this.updateUI(this.current);
            this.current = Math.floor((this.current +this.step) * this.pow) / this.pow;
            if (this.current > this.num) {
                this.current = this.num;
                this.interval = 0;
            }
            this.updateUI(this.current);
            this.count = 0;
        }
    }

    setNum(num:number, decimal:number, sec:number) {
        this.num = num;
        this.pow = 10 ** decimal;
        this.step = Number(num) / (sec * this.speed);
        this.step = Math.floor(this.step * this.pow) / this.pow;
        let current = Number(0);
        this.interval = Math.floor(1 / (sec * this.speed) * 1000) / 1000;
        this.updateUI(current);
    }

    stop () {
        this.interval = 0;
    }

    updateUI(num:number) {
        this.node.removeAllChildren();
        let numStr = `${num}`;
        let decLen = GameUtils.getDecimalPlaces(num);
        if (decLen == 0) {
            numStr += ".000";
        } else {
            for (let i = 3; i > decLen; i--) {
                numStr += "0";
            }
        }
        
        let half = Math.floor(numStr.length / 2);
        let amend = 0;
        if (half == numStr.length / 2) {
            amend = 28;
        }
        for (let i = 0; i < numStr.length; i++) {
            let char = numStr[i];
            let node = new Node();
            let sprite = node.addComponent(Sprite);
            let index = Number(char);
            let y = 0;
            if (char == ".") {
                index = 10;
                y = -30;
            }
            sprite.spriteFrame = this.numSpriteFrame[index];
            node.setPosition(new Vec3((i - half)*60 + amend, y, 1));

            this.node.addChild(node);
        }

    }
}

