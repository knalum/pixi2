import {Viewport} from 'pixi-viewport'
import "./controls";
import * as PIXI from "pixi.js";
import {Point, Ticker} from "pixi.js";
import {SelectionManager} from "./SelectionManager";
import {ViewportHandlers} from "./ViewportHandlers";
import {Background} from "./components/Background";
import {DebugArea} from "./DebugArea";
import {SvgObject} from "./components/SvgObject";

const app = new PIXI.Application({
    backgroundColor: 0xafcccb,
    antialias: true,

    resizeTo: document.getElementById("pixi")
})
const ticker: Ticker = Ticker.shared;
//const stats: Stats = addStats(document, app);
//ticker.add(stats.update, stats, UPDATE_PRIORITY.UTILITY);

const container = document.getElementById("pixi")
container.appendChild(app.view)

export const viewport = new Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    worldWidth: 1000,
    worldHeight: 1000,
    events: app.renderer.events,
})
app.stage.addChild(viewport);
viewport
    .drag()
    .pinch()
    .wheel()
    .decelerate()


viewport.addChild(new Background(viewport))
new DebugArea(viewport)
new ViewportHandlers(viewport);

// TODO: Move
document.addEventListener("keydown", e => {
    if (e.key === "Backspace") {
        const el = SelectionManager.getSelected().length > 0
        if (SelectionManager.getSelected()[0]) {
            SelectionManager.getSelected().forEach(ch => ch.destroy());
            SelectionManager.clearSelected();
        }
    }
})


// Simple culling
function addCulling() {
    viewport.on("moved-end", e => {
        const rect = new PIXI.Rectangle(e.corner.x, e.corner.y, e.bottom, e.right);
        let nRenderItems = 0;
        viewport.children?.forEach((ch) => {

            if (rect.contains(ch.x, ch.y)) {
                ch.renderable = true;
                nRenderItems++;
            } else {
                ch.renderable = false
            }
        })
    })
}

// TODO: Remove
viewport.addChild(new SvgObject(new Point(100, 100), "svg1"))
viewport.addChild(new SvgObject(new Point(200, 200), "svg2"))
viewport.addChild(new SvgObject(new Point(200, 400), "svg3"))