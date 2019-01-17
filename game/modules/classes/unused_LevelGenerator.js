class LevelGenerator {
	constructor(blocksPerRow, rowNumber) {
		this.offsetX = 0;

		this.center = () => {
			return ((blocksPerRow * 60) - viewport.w) / 2 * -1;
		}

		this.createRow = (blocksPerRow, rowNumber) => {
			for (var i = 0; i < blocksPerRow; i++) {
				this.offsetX = (i * 60) + this.center(blocksPerRow);
				game.bricks.push(new Brick(this.offsetX, game.brickArea.y + (rowNumber * 43)));
			}
		}
	}
}
