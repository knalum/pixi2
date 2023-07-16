import * as PIXI from 'pixi.js'
import {Viewport} from "pixi-viewport";

export class Background extends PIXI.Graphics{
    private LINE_THICKNESS=1;
    private LINE_COLOR=0x80b7ff;

    constructor(viewport: Viewport) {
        super();

        viewport.on("moved-end",e=>{
            // TODO: Adjust grid on move
        })

        for (let i = 0; i <= 30; i++) {
            this.drawVerticalLine(i*30)
        }
        for (let i = 0; i <= 30; i++) {

            this.drawHorizontalLine(i*30)
        }
    }

    private drawVerticalLine(number: number) {
        this.lineStyle(this.LINE_THICKNESS, this.LINE_COLOR);
        this.moveTo(number,0);
        this.lineTo(number,900);
    }

    private drawHorizontalLine(number: number) {
        let color = 0xFF0000;
        this.lineStyle(this.LINE_THICKNESS, this.LINE_COLOR);
        this.moveTo(0,number);
        this.lineTo(900,number);
    }
}