import {AbstractGraphics} from "./AbstractGraphics";
import {Circle} from "./Circle";
import * as PIXI from 'pixi.js'
import {viewport} from "../main";
import {SelectionManager} from "../SelectionManager";
import {Point} from "pixi.js";

export class LineSegment extends AbstractGraphics {
    private circles:PIXI.Graphics[]=[];
    private lines:PIXI.Graphics[]=[];
    public static LINE_THICKNESS=3;
    public static LINE_COLOR=0xfff8dc;
    public static CIRCLE_RADIUS=10;

    constructor(point:Point,numSegments:number) {
        let {x,y} = point;
        super();
        this.position.set(x,y);

        // Make numSegments+1 circles
        let circleX=x;
        for(let i=0;i<numSegments+1;i++){
            const circle = this.createCircle(circleX,y)
            this.circles.push(circle)

            circleX+=100;

        }

        // Make numSegment lines
        for (let i = 0; i < numSegments; i++) {
            const lineSeg = new PIXI.Graphics();
            this.drawLine(lineSeg,this.circles[i].x,this.circles[i].y,this.circles[i+1].x,this.circles[i+1].y)
            this.lines.push(lineSeg);
            //this.addChild(lineSeg);
        }

        this.lines.forEach(l=>this.addChild(l))
        this.circles.forEach(c=>this.addChild(c));

        this.circles.forEach(c=>{
            this.addDragListeners2(c)

        })

        // Add drag to whole
        this.addDragListeners2(this)

    }

    private createCircle(x:number,y:number){
        const circle1 = new PIXI.Graphics()
        this.drawCircle2(circle1,x,y)
        return circle1;
    }

    private drawCircle2(circle:PIXI.Graphics,x:number,y:number){
        circle.clear()
        circle.beginFill(0xfff8dc, 0.85);
        circle.drawCircle(0, 0, LineSegment.CIRCLE_RADIUS);
        circle.position.set(x, y)
        circle.cursor = 'pointer';
    }

    private drawLine(lineSeg,x:number,y:number,x2:number,y2:number){
        lineSeg.clear()
        lineSeg.lineStyle(LineSegment.LINE_THICKNESS, LineSegment.LINE_COLOR);
        lineSeg.moveTo(x,y);
        lineSeg.lineTo(x2, y2);
        lineSeg.eventMode = 'dynamic';
        lineSeg.cursor = 'pointer';
        lineSeg.hitArea = this.getHitArea(lineSeg,LineSegment.LINE_THICKNESS);
        return lineSeg;
    }

    private getHitArea(line, thickness) {
        const sc = thickness / 2;
        return new PIXI.Polygon([
            line.currentPath.points[0], line.currentPath.points[1] - sc,
            line.currentPath.points[2], line.currentPath.points[3] - sc,
            line.currentPath.points[2], line.currentPath.points[3] + sc,
            line.currentPath.points[0], line.currentPath.points[1] + sc,
        ])
    }


    rerender() {
        const scale = 1/viewport.scale.x;
        LineSegment.LINE_THICKNESS=scale*3;
        for (let i = 0; i < this.lines.length; i++) {
            const lineSeg =this.lines[i]
            this.drawLine(lineSeg,this.circles[i].x,this.circles[i].y,this.circles[i+1].x,this.circles[i+1].y)
        }

        LineSegment.CIRCLE_RADIUS=scale*5;
        for(let i=0;i<this.circles.length;i++){
            const circ = this.circles[i];
            this.drawCircle2(circ,circ.x,circ.y);
        }
    }

    public addDragListeners2(dragObject) {
        const parent = viewport;

        dragObject.eventMode = 'dynamic';
        let dragPoint;
        const onDragStart = (event) => {
            event.stopPropagation();
            dragPoint = event.data.getLocalPosition(parent);
            dragPoint.x -= dragObject.x;
            dragPoint.y -= dragObject.y;
            parent.on("pointermove", onDragMove);
        };

        const onDragMove = (event) => {
            const newPoint = event.data.getLocalPosition(parent);
            if (SelectionManager.getSelected().length > 1) {
                const sc = viewport.scale._x
                SelectionManager.getSelected().forEach(cmp => {
                    //cmp.x = newPoint.x - dragPoint.x;
                    //cmp.y = newPoint.y - dragPoint.y;
                    cmp.x+=event.movementX*(1/viewport.scale._x);
                    cmp.y+=event.movementY*(1/viewport.scale._x);
                })
            } else {
                dragObject.x = newPoint.x - dragPoint.x;
                dragObject.y = newPoint.y - dragPoint.y;
            }

            for (let i = 0; i < this.circles.length-1; i++) {
                this.drawLine(this.lines[i],this.circles[i].x,this.circles[i].y,this.circles[i+1].x,this.circles[i+1].y)
            }
        };

        const onDragEnd = (event) => {
            event.stopPropagation();
            parent.off("pointermove", onDragMove);
        };

        dragObject.on("pointerdown", onDragStart);
        dragObject.on("pointerup", onDragEnd);
        dragObject.on("pointerupoutside", onDragEnd);
    }


}