import * as PIXI from "pixi.js"
import {Viewport} from 'pixi-viewport'
import {SelectionManager} from "./SelectionManager";
import {opts, pressDrag, viewport} from "./main";
import {AbstractGraphics} from "./components/AbstractGraphics";

export class ViewportHandlers {
    private isSelectionBox: boolean;
    private x0: number = 0;
    private y0: number = 0;
    private x2: number = 0
    private y2: number = 0
    private rect: PIXI.Graphics;

    constructor(viewport: Viewport) {
        this.rect = new PIXI.Graphics()
        viewport.addChild(this.rect);


        viewport.on("pointerdown", (e) => {
            this.rect.clear()
            if (e.shiftKey) {
                this.isSelectionBox = true;
                const dragPoint = e.data.getLocalPosition(viewport);
                this.x0 = dragPoint.x;
                this.y0 = dragPoint.y;
            }
            SelectionManager.clearSelected()

        })

        viewport.on("pointerup", (e) => {
            this.isSelectionBox = false;
            this.onSelectUp();
            viewport.cursor = "default"
            viewport.pause=false;
        })

        this.rect.on("pointerup", (e) => {
            this.rect.clear();
            this.isSelectionBox=false;
            //this.onSelectUp();
        })

        viewport.on("pointermove", (e) => {
            if (this.isSelectionBox && e.shiftKey) {
                viewport.pause=true;
                viewport.cursor = "pointer"
                const dragPoint = e.data.getLocalPosition(viewport);
                this.x2 = dragPoint.x;
                this.y2 = dragPoint.y;
                this.drawRect()
            }else{

            }
        })

        // TODO: Zoom end rerender
        viewport.on("zoomed-end", (e) => {
            viewport.children.forEach((ch: AbstractGraphics) => {
                if (ch.id) ch.rerender()
            })
        })
    }

    private onSelectUp() {
        viewport.children.forEach((ch:AbstractGraphics) => {
            if (ch.id && this.isWithin( ch, this.rect)) {
                SelectionManager.addSelected(ch)
                ch.setSelected(true)
            }
        })

        this.rect.clear()
    }

    private isWithin(child: AbstractGraphics, rect: PIXI.Graphics) {
        const {x,y} = child.position
        const bounds = child.getBounds();
        const childRect = new PIXI.Rectangle(x,y,bounds.width,bounds.height);
        const out = rect.getLocalBounds().intersects(childRect);
        return out;
    }

    private drawRect() {

        this.rect.clear()
        this.rect.beginFill(0x008800);
        this.rect.lineStyle(1,0x00FF00)
        this.rect.alpha = 0.5;

        if(this.x2-this.x0>0 && this.y2-this.y0>0){
            this.rect.drawRect(this.x0, this.y0, this.x2 - this.x0, this.y2 - this.y0)
        }else if(this.x2-this.x0<0 && this.y2-this.y0>0){
            this.rect.drawRect(this.x2,this.y0,Math.abs(this.x2-this.x0),this.y2-this.y0)
        }else if(this.x2-this.x0>0 && this.y2-this.y0<0){
            this.rect.drawRect(this.x0,this.y2,this.x2-this.x0,Math.abs(this.y2-this.y0))
        }else if(this.x2-this.x0<0 && this.y2-this.y0<0){
            this.rect.drawRect(this.x2,this.y2,Math.abs(this.x2-this.x0),Math.abs(this.y2-this.y0))
        }

    }
}