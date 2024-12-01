import { _decorator, EventTarget } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EventManager')
export class EventManager {
    private  eventPool:Map<string, ((data:any)=>void)[]> = new Map<string, ((data:any)=>void)[]>();
    private eventTarget:EventTarget = new EventTarget();

    on(key:string, fn: (data) => void) {
        // let event = this.eventPool.get(key);
        // if (!event) {
        //     event = [fn];
        //     this.eventPool.set(key, event);
        // } else {
        //     event.push(fn);
        //     this.eventPool.set(key, event);
        // }
        this.eventTarget.on(key, fn);
    }

    emit(key:string, args:any):void;
    emit(key:string):void;
    emit(key:string, args?:any):void {
        // let event = this.eventPool.get(key);
        // if (!event) {
        //     return;
        // } else {
        //     let data = {};
        //     if (args) {
        //         data = args;
        //     }
        //     for (let k in event) {
        //         event[k](data);
        //     }
        // }
        try {
            this.eventTarget.emit(key, args);
        } catch(e) {
            console.error("emit call error", e);
        }
    }
}

export const EventHandle = new EventManager();