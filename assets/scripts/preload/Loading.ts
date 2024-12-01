import { _decorator, AudioClip, Component, ProgressBar } from 'cc';
// import * as i18n from '../../../extensions/i18n/assets/LanguageData';
import * as i18n from 'db://i18n/LanguageData';

import { AudioHandle } from '../lib/AudioManager';
import { ResHandle } from '../lib/ResManager';
const { ccclass, property } = _decorator;

@ccclass('Loading')
export class Loading extends Component {
    @property(AudioClip)
    private bgAudio:AudioClip = null;
    @property(ProgressBar)
    private progress:ProgressBar = null;

    start() {
        if (i18n._language === 'en') {
            i18n.init('zh')
        } else {
            i18n.init('en')
        }
        i18n.updateSceneRenderers();
        this.initAudio();
        this.goToGame();
    }

    update(deltaTime: number) {
        
    }

    initAudio() {
        AudioHandle.init();
        AudioHandle.play(this.bgAudio, 1);
    }

    test(data) {
        this.progress.progress = 1;
    }

    goToGame() {
        ResHandle.loadScene("game", "game", (finished: number, total:number) => {
            this.progress.progress = finished / total;
        });
    }
}

