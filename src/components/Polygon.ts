import {AbstractGraphics} from "./AbstractGraphics";
import {Point} from "pixi.js";


export class Polygon extends AbstractGraphics{
    private points:number[];
    constructor(point:Point) {
        super()
        this.position.set(point.x,point.y);
        this.addDragListeners(this)
        this.points = [30,30,100,30,100,40,30,100];
        this.draw()
    }

    public setPoints(points:number[]){
        console.log("Set points: ",points)
        this.points=points;
        this.draw()
    }

    public draw(){
        this.clear()
        this.beginFill(0xfff8dc)
        this.drawPolygon(this.points)
        //this.position.set(point.x,point.y)
    }
}