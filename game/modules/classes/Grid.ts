import { ctx, viewport } from "../global";
import { GridSegment } from "./GridSegment";

export class Grid {
    x: number;
    y: number;
    w: number;
    h: number;
    draw: () => void;

	public static instance: Grid = null;
	public static render = () => {
		Grid.instance.draw();
	}

	constructor(x: number, y: number, w: number, h: number) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;

		Grid.instance = this;

		// generate grid segments
		let offsetX = this.x;
		let offsetY = this.y;
		let col = 1;
		let maxRows = 4;
		let colsPerRow = 5;
		// generate grid
		for (let i = 0; i < colsPerRow * maxRows; i++) {
			new GridSegment(offsetX, offsetY, this.w / colsPerRow, this.h / colsPerRow, i);
			offsetX += this.w / colsPerRow;
			if (col === colsPerRow) {
				offsetX = this.x;
				offsetY += this.h / colsPerRow;
				col = 0;
			}
			col++;
		}
		// bottom segment
		new GridSegment(this.x, offsetY, this.w, this.h / colsPerRow, 20);


		this.draw = () => {
			ctx.save();
			ctx.fillStyle = "rgba(0, 255, 0, 0.1)";
			ctx.fillRect(this.x, this.y, this.w, this.h);
			ctx.fill();
			ctx.restore();

			GridSegment.render();

			// RULER
			ctx.save();
			ctx.strokeStyle = 'darkred';
			// vertical
			ctx.beginPath();
			ctx.moveTo(viewport.w / 2, 0);
			ctx.lineTo(viewport.w / 2, viewport.h);
			ctx.stroke();
			// horizontal
			ctx.beginPath();
			ctx.moveTo(0, viewport.h / 2);
			ctx.lineTo(viewport.w, viewport.h / 2);
			ctx.stroke();
			ctx.restore();
		}
	}
}
