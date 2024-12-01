import { _decorator } from 'cc';
const { ccclass, property } = _decorator;

interface ICoinItem {
    Title:string;
}

export class CoinsCfg {
    public static List:ICoinItem[] = [
        {Title:"USDT"},
        {Title:"ELF"}
    ];

    public static GamePlayStatusNormal:number = 0;
    public static GamePlayStatusPlaying:number = 1;
    public static GamePlayStatusFree:number = 2;

    public static FreeTimes:number = 2;
}

