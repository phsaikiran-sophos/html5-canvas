import Canvas from "./classes/canvas";

export type Color = {
    readonly pallet: string[]
}

export type Mouse = {
    x: number,
    y: number
}

export type CircleConfig = {
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
    canvas: Canvas,
    updateFunction?: UpdateFunction,
    fillColor?: string
}

export type CanvasConfig = {
    id: string,
    height?: number,
    width?: number
}

export type UpdateFunction = "random" | "gravity" | "collision";