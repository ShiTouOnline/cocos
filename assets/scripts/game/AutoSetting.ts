import { _decorator, Component, Toggle } from 'cc';
import { EventCfg } from '../config/EventCfg';
import { EventHandle } from '../lib/EventManager';
import { PopupHandle } from '../lib/PopupManager';
import { GlobalHandle } from './GlobalData';
const { ccclass, property } = _decorator;

@ccclass('AutoSetting')
export class AutoSetting extends Component {
    @property([Toggle])
    private toggles:Toggle[] = [];

    protected start(): void {
        for (let i = 0; i < this.toggles.length; i++) {
            if (GlobalHandle.autoSettingData.Select == Number(this.toggles[i].checkEvents[0].customEventData)) {
                this.toggles[i].isChecked = true;
            }
        }
    }

    onCheckToggle(toggle:Toggle, customData:string) {
        if (toggle.isChecked) {
            GlobalHandle.autoSettingData.Select = Number(customData);
        }
    }

    onClickClose() {
        PopupHandle.close(this.node);
    }

    onClickConfirm() {
        GlobalHandle.autoSettingData.CurrentNum = GlobalHandle.autoSettingData.Select;
        //GlobalHandle.autoSettingData.Pause = true;
        EventHandle.emit(EventCfg.AutoSetting);
        PopupHandle.close(this.node);
    }
}

