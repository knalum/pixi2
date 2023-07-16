import * as PIXI from "pixi.js";
import {Viewport} from "pixi-viewport";
import {AbstractGraphicsEvent} from "./components/AbstractGraphics";
import {SelectionManager} from "./SelectionManager";
import {Polygon} from "./components/Polygon";

export class DebugArea extends PIXI.Container{


    constructor(viewport: Viewport) {
        super();

        const debugDiv = document.getElementById("debug");

        // Mouse position
        const position_x = document.createElement("div")
        debugDiv.appendChild(position_x);
        const position_y = document.createElement("div")
        debugDiv.appendChild(position_y);
        viewport.on("pointermove",(e)=>{
            position_x.innerText=`x=${Math.floor(e.data.getLocalPosition(viewport).x)}`;
            position_y.innerText=`y=${Math.floor(e.data.getLocalPosition(viewport).y)}`;
        })


        // Enter
        const id=document.createElement("div")
        debugDiv.appendChild(id);
        id.innerText="id=";
        document.addEventListener("enter",(e:CustomEvent<AbstractGraphicsEvent>)=>{
            id.innerText=`id=${e.detail.element.id}`;
        })
        document.addEventListener("exit",(e:CustomEvent<AbstractGraphicsEvent>)=>{
            id.innerText="id="
        })

        // Selection
        const selected = document.createElement("div")
        debugDiv.appendChild(selected)
        selected.innerText="Selected:"

        const inputWidth=document.createElement("input")
        debugDiv.appendChild(inputWidth);
        inputWidth.onchange=(e)=>{
            SelectionManager.getSelected()[0].width=parseInt(e.target.value)
        }

        const deleteBtn = document.createElement("button")
        deleteBtn.innerText="Delete";
        deleteBtn.onclick = (e)=>{
            SelectionManager.getSelected().forEach(ch=>ch.destroy());
            SelectionManager.clearSelected()
        }
        debugDiv.appendChild(deleteBtn)
        document.addEventListener("selected",(e:CustomEvent<AbstractGraphicsEvent>)=>{
            if(e.detail){
                selected.innerText=`Selected: ${e.detail.element.id}`
                inputWidth.value=""+e.detail.element.width;
            }else{
                selected.innerText="";
            }
        })

    }

}