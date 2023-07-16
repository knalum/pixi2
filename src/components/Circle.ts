import * as PIXI from 'pixi.js'
import {AbstractGraphics} from "./AbstractGraphics";
import {Point} from "pixi.js";

export class Circle extends AbstractGraphics{
    constructor(point:Point) {
        super()
        this.beginFill(0xfff8dc, 0.85);
        this.drawCircle(0, 0, 50);
        this.position.set(point.x,point.y);
        this.addDragListeners(this)

    }
}