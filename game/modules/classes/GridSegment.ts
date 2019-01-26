import { ctx } from "../global";
import { BrickArea } from "./BrickArea";

export class GridSegment {
    x: number;
    y: number;
    w: number;
    h: number;
    color: string;
    id: number;
    contains: any[];
    draw: () => void;

	public static instances: GridSegment[] = [];
	public static render = () => {
		for (let i = 0; i < GridSegment.instances.length; i++) {
		    GridSegment.instances[i].draw();
		}
	}

	constructor(x: number, y: number, size: number, id: number) {
		this.x = x;
		this.y = y;
		this.w = BrickArea.instance.w / size;
		this.h = BrickArea.instance.h / size;
		this.color = 'rgba(0, 255, 255, 0.5)';
		this.id = id;
		this.contains = [];

		GridSegment.instances.push(this);

		this.draw = () => {
			ctx.save();
			ctx.strokeStyle = this.color;
			ctx.strokeRect(this.x, this.y, this.w, this.h);
			ctx.font = '20px Arial';
			ctx.fillStyle = '#000';
			ctx.fillText(this.id, this.x + this.w / 2.2, this.y + this.h / 1.6);
			ctx.restore();
		}
	}
}
