import { ctx, viewport } from "../global";
import { GridSegment } from "./GridSegment";

export class BrickArea {
    x: number;
    y: number;
    w: number;
    h: number;
    renderGrid: boolean;
    segmentsPerRow: number;
    draw: () => void;

	public static instance: BrickArea = null;
	public static render = () => {
		BrickArea.instance.draw();
	}

	constructor(x: number, y: number, w: number, h: number) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.segmentsPerRow = 5;

		BrickArea.instance = this;

		// generate grid segments
		let offsetX = this.x;
		let offsetY = this.y;
		let col = 1;
		for (let i = 0; i < this.segmentsPerRow * this.segmentsPerRow; i++) {
			new GridSegment(offsetX, offsetY, this.segmentsPerRow, i);
			offsetX += this.w / this.segmentsPerRow;
			if (col === this.segmentsPerRow) {
				offsetX = this.x;// initial value
				offsetY += this.h / this.segmentsPerRow;
				col = 0;
			}
			col++;
		}

		this.draw = () => {
			ctx.save();
				ctx.fillStyle = "rgba(0, 255, 0, 0.1)";
				ctx.fillRect(this.x, this.y, this.w, this.h);
				ctx.fill();
			ctx.restore();

			GridSegment.render();

			// Ruler
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
