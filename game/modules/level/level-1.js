const level_1 = () => {
	let blocksPerRow, offsetX = 0;
	let center = (blocksPerRow) => {
		return ((blocksPerRow * 60) - viewport.w) / 2 * -1;
	}


	const createRow = (blocksPerRow, rowNumber) => {
		for (var i = 0; i < blocksPerRow; i++) {
			offsetX = (i * 60) + center(blocksPerRow);
			game.bricks.push(new Brick(offsetX, game.brickArea.y + (rowNumber * 43)));
		}
	}

	createRow(20, 0);
	createRow(10, 1);
	createRow(15, 2);
	createRow(2, 3);
	createRow(11, 4);
	createRow(6, 5);
}
