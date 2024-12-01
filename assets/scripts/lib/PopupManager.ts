import { _decorator, Component, find, instantiate, Node, tween, Vec3 } from 'cc';
import { ResHandle } from './ResManager';
const { ccclass, property } = _decorator;

@ccclass('PopupManager')
export class PopupManager extends Component {

    async open(bundle:string, path:string, data?:any) {
        let bgPrefab = await ResHandle.loadPrefab("common", "prefab/MaskBg");
        let bgNode = instantiate(bgPrefab);
        bgNode.name = "__mask_bg_node__";

        let autoSettingPfb = await ResHandle.loadPrefab(bundle, path);
        let node = instantiate(autoSettingPfb);
        node.setScale(0.8, 0.8, 0.8);
        let canvas = find("/Canvas");
        canvas.addChild(bgNode);
        canvas.addChild(node);
        tween(node).to(0.1, {scale:new Vec3(1,1,1)}, {easing:"backIn"}).start();
    }

    close(node:Node) {
        let canvas = find("/Canvas");
        let bgNode = find("/Canvas/__mask_bg_node__");
        canvas.removeChild(bgNode);
        canvas.removeChild(node);
    }
}

export const PopupHandle = new PopupManager();