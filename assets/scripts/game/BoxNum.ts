import { _decorator, Component, Node, Sprite } from 'cc';
import { ResHandle } from '../lib/ResManager';
const { ccclass, property } = _decorator;

@ccclass('BoxNum')
export class BoxNum extends Component {
    setNum(num:number) {
        this.node.removeAllChildren();
        let numStr = `${num}`;
        for (let i = 0; i < numStr.length; i++) {
            let char = numStr[i];
            let node = new Node();
            let sprite = node.addComponent(Sprite);
            if (char == ".") {
                char = "decimal";
            }
            ResHandle.setSpriteFrame("game", `texture/num/box/num-${char}`, sprite);
            this.node.addChild(node);
        }
    }

    setWinNum(num:number) {
        this.node.removeAllChildren();
        let numStr = `${num}`;
        for (let i = 0; i < numStr.length; i++) {
            let char = numStr[i];
            let node = new Node();
            let sprite = node.addComponent(Sprite);
            if (char == ".") {
                char = "decimal";
            }
            ResHandle.setSpriteFrame("game", `texture/num/win/win-num_${char}`, sprite);
            this.node.addChild(node);
        }
    }
}

