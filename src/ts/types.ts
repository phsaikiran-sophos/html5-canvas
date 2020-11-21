import Screen from "./classes/screen";

export type Color = {
    readonly pallet: string[]
}

export type Mouse = {
    x: number,
    y: number
}

export type Scroll = {
    top: number,
    left: number
}

export class sObject<T> {
    update = () => {
        console.log("Update not defined");
    }

    // @ts-ignore
    colliding = (that: T) => {
        console.log("Colliding not defined");
    }
}

export type CircleConfig = {
    scr: Screen,
    temp?: boolean,
    m?: number,
    x?: number,
    y?: number,
    dx?: number,
    dy?: number,
    r?: number,
    dr?: number,
    minR?: number,
    maxR?: number,
    influenceR?: number,
    gravity?: number,
    friction?: number,
    updateFunction?: UpdateFunction,
    fillColor?: string,
    opacity?: number
}

export type TextConfig = {
    scr: Screen,
    text?: string
    x?: number,
    y?: number,
    fontSize?: string,
    fontFamily?: string,
    fillColor?: string,
}

export type ScreenConfig = {
    id: string,
    name?: string,
    type?: "canvas" | "svg",
    height?: number,
    width?: number
}

export type UpdateFunction = "random" | "gravity" | "collision";