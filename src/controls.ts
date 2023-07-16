import {viewport} from "./main";
import {Rectangle2} from "./components/Rectangle2";
import {Circle} from "./components/Circle";
import {Polygon} from "./components/Polygon";
import {LineSegment} from "./components/LineSegment";
import {AbstractGraphics} from "./components/AbstractGraphics";
import {Point} from "pixi.js";
import {SvgObject} from "./components/SvgObject";

function createControl(id:string,cb:Function){
    document.getElementById(id)?.addEventListener("click",cb)
}


createControl("addRectangle",()=>{
    console.log()
    viewport.addChild(new Rectangle2(viewport.center));
})
createControl("addCircle",()=>viewport.addChild(new Circle(viewport.center)))
createControl("addPolygon",()=>viewport.addChild(new Polygon(viewport.center)))
createControl("addLine",()=>{
    viewport.addChild(new LineSegment(new Point(100,100),4))
})
document.getElementById("svg").addEventListener("change",e=>{
    viewport.addChild(new SvgObject(new Point(200,200),e.currentTarget.value))
    document.getElementById("svg").value="default"
})