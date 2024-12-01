import { _decorator, Component, instantiate, Node, Prefab, tween, Vec3 } from 'cc';
import { RingItemCfg } from '../config/RingItemCfg';
import { GameUtils } from '../lib/GameUtils';
import { RingItem } from './RingItem';
const { ccclass, property } = _decorator;

const ColumnStatusNormal = 0;
const ColumnStatusRoll = 1;
const ColumnStatusReward = 2;


@ccclass('Column')
export class Column extends Component {
    @property(Prefab)
    private ringItemPrefab:Prefab = null;

    private colId:number = -1;
    private itemHeight:number = 174;
    private speed:number = 1800;
    private maxNum:number = 5;

    private list:Node[] = [];
    private status:number = ColumnStatusNormal;

    init() {
        console.log("init column");
        // 随机三个
        for (let i = 0; i < this.maxNum; i++) {
            this.addItem(-1, false);
        }
    }

    protected update(dt: number): void {
        if (this.status == ColumnStatusRoll || this.status == ColumnStatusReward) {
            let moveY = this.speed * dt;

            for (let k in this.list) {
                let pos = this.list[k].getPosition();
                let move = pos.y - moveY;

                if (move < -522) {
                    this.list[k].setPosition(new Vec3(pos.x, move));
                    let snode = this.list.shift();
                    this.node.removeChild(snode);
                } else {
                    this.list[k].setPosition(new Vec3(pos.x, move));
                }
            }

            if (this.list.length < this.maxNum && this.status == ColumnStatusRoll) {
                this.addItem(-1, false);
            } else if (this.status == ColumnStatusReward) {
                let current = 0;
                let tempList = [];
                for (let k in this.list) {
                    let ringItem = this.list[k].getComponent(RingItem);
                    if (ringItem.getReal()) {
                        let finalY = (current - 1) * this.itemHeight;
                        if (ringItem.node.position.y <= finalY) {
                            ringItem.node.setPosition(new Vec3(0, finalY, 1));
                            tween(ringItem.node).by(0.1, {position:new Vec3(0, -50, 1)}).by(0.1, {position:new Vec3(0, 50, 1)}).start();
                            ringItem.playElastic();
                            current++;
                            tempList.push(this.list[k]);
                        }
                    }
                }
                if (current == 3) {
                    for (let k in this.list) {
                        let ringItem = this.list[k].getComponent(RingItem);
                        if (!ringItem.getReal()) {
                            this.node.removeChild(this.list[k]);
                        }
                    }
                    this.list = tempList;
                    this.status = ColumnStatusNormal;
                }
            }
        }
    }

    addItem(itemId:number, isReal:boolean) {
        let i = this.list.length;
        let posY = (i - 1) * this.itemHeight;
        if (i > 0) {
            posY = this.list[i - 1].position.y + this.itemHeight;
        }
        if (itemId == -1) {
            let index = GameUtils.getRandomInt(0, RingItemCfg.ItemIds.length - 1);
            itemId = RingItemCfg.ItemIds[index];
        }
        let ringItem = instantiate(this.ringItemPrefab);
        ringItem.setPosition(new Vec3(0, posY, 1));
        ringItem.getComponent(RingItem).init(itemId, i, this.colId, isReal);
        if (this.status == ColumnStatusRoll) {
            ringItem.getComponent(RingItem).playRoll();
        }
        this.node.addChild(ringItem);
        this.list.push(ringItem);
    }

    reward(itemIds: number[]) {
        console.log("reward");
        this.status = ColumnStatusReward;
        for (let k in itemIds) {
            this.addItem(itemIds[k], true);
        }

        for (let k in this.list) {
            this.list[k].getComponent(RingItem).playDefault();
        }
    }

    getContent():number[] {
        let res:number[] = [];
        for (let k in this.list) {
            let ringItem = this.list[k].getComponent(RingItem);
            res.push(ringItem.getId());
        }

        return res;
    }

    roll() {
        this.status = ColumnStatusRoll;
        for (let k in this.list) {
            this.list[k].getComponent(RingItem).playRoll();
        }
    }

    playActionByIndex(index:number, action:string) {
        if (this.list.length <= index) {
            return;
        }

        let ring = this.list[index].getComponent(RingItem);
        switch(action) {
            case "default":
                ring.playDefault();
                break;
            case "active":
                ring.playActive();
                break;
            case "elastic":
                ring.playElastic();
                break;
        }
    }
}

