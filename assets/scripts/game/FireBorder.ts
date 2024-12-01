import { _decorator, Component, dragonBones, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FireBorder')
export class FireBorder extends Component {
    @property(Node)
    private bg:Node = null;
    @property(Node)
    private border = null;


    playBg() {
        this.bg.active = true;
        this.border.active = false;
        this.bg.getComponent(dragonBones.ArmatureDisplay).playAnimation("tubiao-dibuguang", 0);
    }

    playBorder() {
        this.bg.active = false;
        this.border.active = true;
        this.bg.getComponent(dragonBones.ArmatureDisplay).playAnimation("xiao-tubiaoguang", 0);
    }
}

