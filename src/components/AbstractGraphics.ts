import * as PIXI from 'pixi.js'
import {viewport} from "../main";
import {SelectionManager} from "../SelectionManager";
import {Renderer} from "pixi.js";

export interface AbstractGraphicsEvent {
    element: AbstractGraphics
}

// @ts-ignore
export class AbstractGraphics extends PIXI.Graphics {
    public static DEFAULT_COLOR: number = 0xfff8dc
    public static SELECTED_COLOR: number = 0xfff9dc
    private _id: string;
    private static _seq: number = 0;


    constructor() {
        super();
        this.cursor = 'pointer';
        this.id = "Object_" + AbstractGraphics._seq;
        AbstractGraphics._seq += 1;

        this.on('pointerenter', (e) => {
            document.dispatchEvent(new CustomEvent<AbstractGraphicsEvent>("enter", {detail: {element: this}}))
        })


        this.on('pointerleave', (e) => {
            document.dispatchEvent(new CustomEvent<AbstractGraphicsEvent>("exit"))
        })

        this.on("pointerdown", (e) => {
            if (e.shiftKey) {
                if (SelectionManager.getSelected().includes(this)) {
                    SelectionManager.removeSelected(this)
                    this.setSelected(false)
                } else {
                    SelectionManager.addSelected(this)
                    this.setSelected(true)

                }
            }else{
                if(SelectionManager.getSelected().length>1){
                    // Multiple selected?
                }else{
                    SelectionManager.clearSelected();
                    SelectionManager.addSelected(this)
                    this.setSelected(true)
                }
            }
        });

    }


    setSelected(isSelected: boolean) {
        if (isSelected) {
            this.tint = 0xFF0000
            this.children?.forEach(ch => {
                ch.tint = 0xFF0000
            });
            document.dispatchEvent(new CustomEvent<AbstractGraphicsEvent>("selected",{detail:{element:this}}))
        } else {
            this.tint = AbstractGraphics.DEFAULT_COLOR;
            this.children?.forEach(ch => {
                ch.tint = AbstractGraphics.DEFAULT_COLOR
            })
            document.dispatchEvent(new CustomEvent<AbstractGraphicsEvent>("selected"))
        }
    }

    public rerender() {

    }


    get id(): string {
        return this._id;
    }

    public set id(value: string) {
        this._id = value;
    }

    public addDragListeners(dragObject) {
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
                    cmp.x += event.movementX * (1 / viewport.scale._x);
                    cmp.y += event.movementY * (1 / viewport.scale._x);
                })
            } else {
                let x = newPoint.x - dragPoint.x;
                let y = newPoint.y - dragPoint.y;
                dragObject.x = x;
                dragObject.y = y;
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