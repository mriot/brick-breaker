import { ctx } from "../global";
import { Grid } from "./Grid";

export class GridSegment {
    x: number;
    y: number;
    w: number;
    h: number;
    id: number;
    contains: any[];
    draw: () => void;

	public static instances: GridSegment[] = [];
	public static render = () => {
		for (let i = 0; i < GridSegment.instances.length; i++) {
		    GridSegment.instances[i].draw();
		}
	}

	constructor(x: number, y: number, w: number, h: number, id: number) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.id = id;
		this.contains = [];// bricks

		GridSegment.instances.push(this);

		this.draw = () => {
			ctx.save();
			ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
			ctx.strokeRect(this.x, this.y, this.w, this.h);
			ctx.font = '20px Arial';
			ctx.fillStyle = '#000';
			ctx.fillText(this.id, this.x + this.w / 2 - 10, this.y + this.h / 1.8);
			ctx.restore();
		}
	}
}
