interface AutoSettingInfo {
    Select:number;
    CurrentNum:number;
    //Pause:boolean;
}

export class GlobalData {
    public autoSettingData:AutoSettingInfo = {Select:25, CurrentNum: 0};
}

export const GlobalHandle = new GlobalData();