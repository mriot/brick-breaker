class BrickArea {
	constructor(x, y, w, h, renderGrid = false) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.renderGrid = renderGrid;
		// grid
		this.segmentsPerRow = 9;

		if (this.renderGrid) {
			// brick area
			ctx.fillStyle = "rgba(0, 255, 0, 0.1)";
			ctx.fillRect(game.brickArea.x, game.brickArea.y, game.brickArea.w, game.brickArea.h);
			ctx.fill();
		}

		// grid
		let offsetX = this.x;
		let offsetY = this.y;
		let col = 1;// "next line" -controller
		for (let i = 0; i < this.segmentsPerRow * this.segmentsPerRow; i++) {
			game.brickArea.segments.push(new GridSegment(offsetX, offsetY, this.segmentsPerRow, i, this.renderGrid));
			offsetX += this.w / this.segmentsPerRow;
			if (col === this.segmentsPerRow) {
				offsetX = this.x;// initial value
				offsetY += this.h / this.segmentsPerRow;
				col = 0;
			}
			col++;
		}
	}
}
