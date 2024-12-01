import { _decorator, AssetManager, assetManager, AudioClip, Component, director, Prefab, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ResManager')
export class ResManager extends Component {
    private bundleCache:Map<string, AssetManager.Bundle> = new Map<string, AssetManager.Bundle>();

    public async loadScene(bundle:string, scene:string, progress: (finished: number, total: number) => void) {
        let b = await this.getBundle(bundle);
        b.loadScene(scene, progress, (err, data) => {
            director.runScene(data);
        });
    }

    public async loadAudio(bundle:string, path:string) {
        let b = await this.getBundle(bundle);
        return new Promise<AudioClip>((resolve, reject) => {
            b.load(path, AudioClip, (err, data) => {
                if (err) {
                    reject(err);
                }

                resolve(data);
            });
        });
    }

    public async loadDragonBone(bundle:string, path:string) {
        let b = await this.getBundle(bundle);
        return new Promise((resolve, reject) => {
            b.load(path, (err, data) => {
                if (err) {
                    reject(err);
                }

                resolve(data);
            });
        });
    }

    public async loadPrefab(bundle:string, path:string) {
        let b = await this.getBundle(bundle);
        return new Promise<Prefab>((resolve, reject) => {
            b.load(path, Prefab, (err, data) => {
                if (err) {
                    reject(err);
                }

                resolve(data);
            });
        });
    }

    public async setSpriteFrame(bundle:string, path:string, target:Sprite) {
        let suffix = path.slice(-12);
        console.log(suffix);
        if (suffix != "/spriteFrame") {
            path += "/spriteFrame"
        }
        let b = await this.getBundle(bundle);
        b.load(path, SpriteFrame, (err, data) => {
            if (err) {
                console.log(err);
                return;
            }

            target.spriteFrame = data;
        });
    }

    private async getBundle(bundle) {
        if (this.bundleCache.has(bundle)) {
            return this.bundleCache.get(bundle);
        }

        let res = await this.loadBundle(bundle);

        return res;
    }

    private loadBundle(bundle:string):Promise<AssetManager.Bundle> {
        return new Promise((resolve, reject) => {
            assetManager.loadBundle(bundle, (err, data) => {
                if (err) {
                    return reject(err);
                }
    
                return resolve(data);
            });
        });
        
    }
}

export const ResHandle = new ResManager();