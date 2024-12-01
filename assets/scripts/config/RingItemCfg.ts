import { _decorator } from 'cc';
const { ccclass, property } = _decorator;

interface WinLine {
    col:number;
    row:number;
}

export class RingItemCfg {
    public static FreeGameItemId:number = 201;
    public static ItemIds:number[] = [101,201,300,401,402,403,404,405,406,407];
    public static WinLines:WinLine[][] = [
        [{col:0, row:0},{col:1, row:0},{col:2, row:0},{col:3, row:0},{col:4, row:0}],
        [{col:0, row:1},{col:1, row:1},{col:2, row:1},{col:3, row:1},{col:4, row:1}],
        [{col:0, row:2},{col:1, row:2},{col:2, row:2},{col:3, row:2},{col:4, row:2}],

        [{col:0, row:2},{col:1, row:1},{col:2, row:0},{col:3, row:1},{col:4, row:2}],
        [{col:0, row:0},{col:1, row:1},{col:2, row:2},{col:3, row:1},{col:4, row:0}],

        [{col:0, row:1},{col:1, row:2},{col:2, row:2},{col:3, row:2},{col:4, row:1}],
        [{col:0, row:1},{col:1, row:0},{col:2, row:0},{col:3, row:0},{col:4, row:1}],

        [{col:0, row:2},{col:1, row:2},{col:2, row:1},{col:3, row:0},{col:4, row:0}],
        [{col:0, row:0},{col:1, row:0},{col:2, row:1},{col:3, row:2},{col:4, row:2}],

        [{col:0, row:1},{col:1, row:0},{col:2, row:1},{col:3, row:2},{col:4, row:1}],
        [{col:0, row:1},{col:1, row:2},{col:2, row:1},{col:3, row:0},{col:4, row:1}],

        [{col:0, row:2},{col:1, row:1},{col:2, row:1},{col:3, row:1},{col:4, row:2}],
        [{col:0, row:0},{col:1, row:1},{col:2, row:1},{col:3, row:1},{col:4, row:0}],

        [{col:0, row:2},{col:1, row:1},{col:2, row:2},{col:3, row:1},{col:4, row:2}],
        [{col:0, row:0},{col:1, row:1},{col:2, row:0},{col:3, row:1},{col:4, row:0}],

        [{col:0, row:1},{col:1, row:1},{col:2, row:2},{col:3, row:1},{col:4, row:1}],
        [{col:0, row:1},{col:1, row:1},{col:2, row:0},{col:3, row:1},{col:4, row:1}],

        [{col:0, row:2},{col:1, row:2},{col:2, row:0},{col:3, row:2},{col:4, row:2}],
        [{col:0, row:0},{col:1, row:0},{col:2, row:2},{col:3, row:0},{col:4, row:0}],

        [{col:0, row:2},{col:1, row:0},{col:2, row:0},{col:3, row:0},{col:4, row:2}],
        [{col:0, row:0},{col:1, row:2},{col:2, row:2},{col:3, row:2},{col:4, row:0}],

        [{col:0, row:1},{col:1, row:0},{col:2, row:2},{col:3, row:0},{col:4, row:1}],
        [{col:0, row:1},{col:1, row:2},{col:2, row:0},{col:3, row:2},{col:4, row:1}],

        [{col:0, row:2},{col:1, row:0},{col:2, row:2},{col:3, row:0},{col:4, row:2}],
        [{col:0, row:0},{col:1, row:2},{col:2, row:0},{col:3, row:2},{col:4, row:0}],
    ];
}

