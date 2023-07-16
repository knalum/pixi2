import {AbstractGraphics} from "./AbstractGraphics";
import {Point} from "pixi.js";

export class Rectangle2 extends AbstractGraphics{

    constructor(point:Point) {
        super()
        this.draw(point.x,point.y)
    }


    rerender() {
        super.rerender();
    }

    private draw(x,y){
        this.beginFill(AbstractGraphics.DEFAULT_COLOR, 0.85);
        this.drawRect(0, 0, 50,50);
        this.position.set(x,y);
        this.addDragListeners(this)
    }
}