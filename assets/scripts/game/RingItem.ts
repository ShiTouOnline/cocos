import { _decorator, Component, dragonBones, find, instantiate } from 'cc';
import { ResHandle } from '../lib/ResManager';
import { BoxNum } from './BoxNum';
const { ccclass, property } = _decorator;

@ccclass('RingItem')
export class RingItem extends Component {
    @property(dragonBones.ArmatureDisplay)
    private item:dragonBones.ArmatureDisplay = null;

    private row:number = -1;
    private col:number = -1;
    private id:number = 0;
    private isReal:boolean = false;
    
    async init(id:number, row:number, col:number, isReal?:boolean) {

        this.id = id;
        this.row = row;
        this.col = col;
        this.isReal = isReal;
        if (id == 0) {
            return;
        }
        let item = find(`${id}`, this.node);

        this.item = item.getComponent(dragonBones.ArmatureDisplay);
        this.item.node.active = true;
        this.item.addEventListener(dragonBones.EventObject.COMPLETE, this.animCompleted, this);
        
        this.playDefault();
    }

    getReal():boolean {
        return this.isReal;
    }

    getId():number {
        return this.id;
    }

    playRoll() {
        if (this.id == 0) {
            return;
        }
        this.item.playAnimation("roll", 0);
    }

    playDefault() {
        if (this.id == 0) {
            return;
        }
        this.item.playAnimation("default", 0);
    }

    playActive() {
        if (this.id == 0) {
            return;
        }
        this.item.playAnimation("active", 0);
    }

    playElastic() {
        if (this.id == 0) {
            return;
        }
        this.item.playAnimation("elastic", 1);
    }

    async showNum(num:number) {
        let bnPrefab = await ResHandle.loadPrefab("game", "prefab/BoxNum");
        let bn = instantiate(bnPrefab);
        bn.getComponent(BoxNum).setNum(num);
        this.node.addChild(bn);
    }

    animCompleted() {
        switch (this.item.animationName) {
            case "elastic":
                this.playDefault();
                break;
        }
    }
}

