const level_0 = () => {
	game.UIs.statsUI.level = 0;

	let brickSize = {
		w: game.brickArea.w / 15 - 5,
		h: (game.brickArea.w / 15 - 5) / 1.5
	}

	let offsetX = game.brickArea.x + 2.5;
	for (let i = 0; i < 10; i++) {
		game.bricks.push(new Brick(offsetX, game.brickArea.y, 'brown'));
		offsetX += game.brickArea.w / 10;
	}

	offsetX = game.brickArea.x + 2.5 + game.brickArea.w / 10 - (game.brickArea.w / 10) / 2;
	for (let i = 0; i < 9; i++) {
		game.bricks.push(new Brick(offsetX, game.brickArea.y + brickSize.h + 10, 'brown'));
		offsetX += game.brickArea.w / 10;
	}

	offsetX = game.brickArea.x + 2.5 + game.brickArea.w / 10;
	for (let i = 0; i < 8; i++) {
		game.bricks.push(new Brick(offsetX, game.brickArea.y + brickSize.h + 30, 'brown'));
		offsetX += game.brickArea.w / 10;
	}

	offsetX = game.brickArea.x + 2.5 + game.brickArea.w / 10 + (game.brickArea.w / 10) / 2;
	for (let i = 0; i < 7; i++) {
		game.bricks.push(new Brick(offsetX, game.brickArea.y + brickSize.h + 10, 'brown'));
		offsetX += game.brickArea.w / 10;
	}
}
