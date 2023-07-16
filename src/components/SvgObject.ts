import {AbstractGraphics} from "./AbstractGraphics";
import {SVG} from "pixi-svg";
import {Point} from "pixi.js";
import f from "../svgdata.json";

export  class SvgObject extends AbstractGraphics{

    constructor(point:Point,svgId:string) {
        super();
        this.position.set(point.x,point.y)
        const svg = new SVG(f[svgId]);
        this.addChild(svg)
        this.addDragListeners(this)
    }
}