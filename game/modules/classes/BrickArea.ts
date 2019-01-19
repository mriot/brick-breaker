import { game, ctx } from "../global";
import { GridSegment } from "./GridSegment";

export class BrickArea {
    x: number;
    y: number;
    w: number;
    h: number;
    renderGrid: boolean;
    segmentsPerRow: number;
    draw: () => void;

	constructor(x: number, y: number, w: number, h: number, renderGrid = false) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.renderGrid = renderGrid;
		this.segmentsPerRow = 5;// grid

		// generate grid
		let offsetX = this.x;
		let offsetY = this.y;
		let col = 1;// "next line" -controller
		for (let i = 0; i < this.segmentsPerRow * this.segmentsPerRow; i++) {
			// the object parameter contains width and height of THIS (= BrickArea).
			game.gridSegments.push(new GridSegment(offsetX, offsetY, this.segmentsPerRow, i, {w: this.w, h: this.h}));
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
			ctx.fillRect(game.brickArea.x, game.brickArea.y, game.brickArea.w, game.brickArea.h);
			ctx.fill();
			ctx.restore();
		}
	}
}
