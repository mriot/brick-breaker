import { ctx } from "../global";

export class GridSegment {
    x: number;
    y: number;
    w: number;
    h: number;
    color: string;
    id: number;
    contains: any[];
    draw: () => void;
	
	constructor(x: number, y: number, size: number, id: number, brickAreaSize: any) {
		this.x = x;
		this.y = y;
		this.w = brickAreaSize.w / size;
		this.h = brickAreaSize.h / size;
		this.color = 'rgba(0, 255, 255, 0.5)';
		this.id = id;
		this.contains = [];

		this.draw = () => {
			ctx.save();
			ctx.strokeStyle = this.color;
			ctx.strokeRect(this.x, this.y, this.w, this.h);
			ctx.fillText(this.id, this.x + this.w / 2.2, this.y + this.h / 1.6);
			ctx.restore();
		}
	}
}
