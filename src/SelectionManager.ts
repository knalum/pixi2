import {AbstractGraphics} from "./components/AbstractGraphics";

export class SelectionManager {
    private static selected: AbstractGraphics[] = [];


    public static addSelected(component: AbstractGraphics) {
        if (this.selected.includes(component)) {
        } else {
            this.selected.push(component);
        }
    }

    public static clearSelected() {
        this.selected.forEach((cmp) => {
            cmp.setSelected(false)
        })
        this.selected = [];
    }

    public static getSelected() {
        return this.selected;
    }

    static removeSelected(param: AbstractGraphics) {
        this.selected = this.selected.filter(sel => sel !== param)
    }
}