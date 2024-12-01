import { _decorator, Component, Label } from 'cc';
import { EventCfg } from '../config/EventCfg';
import { EventHandle } from '../lib/EventManager';
const { ccclass, property } = _decorator;

@ccclass('CoinItem')
export class CoinItem extends Component {
    @property(Label)
    private title:Label = null;

    @property(Label)
    private num:Label = null;

    private coinNum:number;

    init(title:string, num:number) {
        this.title.string = title;
        this.num.string = `${num}`;
        this.coinNum = num;
    }

    onClick() {
        EventHandle.emit(EventCfg.ChangeCoin, {title:this.title.string, num:this.coinNum});
    }
}

