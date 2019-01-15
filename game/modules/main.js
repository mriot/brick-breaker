document.addEventListener('DOMContentLoaded', () => {
	// VARS AND STUFF ============================================================
	window.canvas = document.querySelector('#canvas');
	window.viewport = {w: window.innerWidth, h: window.innerHeight};
	window.ctx = canvas.getContext('2d');
	window.game = {
		running: false,
		boardControl: {left: false, right: false, top: false, bottom: false},
		devOrb: null,
		playerBoard: null,
		brickArea: null,
		orbs: [],
		bricks: [],
		gridSegments: [],
		powerUps: [],
		equippedPowerUp: null,
		huds: {
			statsHud: null,
			powerUpHud: null
		},
		misc: {
			pipes: [],
			background: null
		}
	};

	// INIT GAME ============================================================
	init();
});


const init = () => {
	// canvas dimensions
	canvas.width = viewport.w;
	canvas.height = viewport.h;

	game.misc.background = new Image(0, 0);
	game.misc.background.src = 'img/background.jpg';

	// setup
	game.brickArea = new BrickArea(viewport.w / 100 * 5, 50, viewport.w / 100 * 90, viewport.h / 2, false);
	// game.misc.pipes.push(new Pipe(0, 50, 64, viewport.h - 50));
	// game.misc.pipes.push(new Pipe(viewport.w - 64, 50, 64, viewport.h - 50));
	game.huds.statsHud = new StatsHud();
	game.huds.powerUpHud = new PowerUpHud();
	game.playerBoard = new PlayerBoard();
	game.orbs.push(new Orb(game.playerBoard.x, game.playerBoard.y - 10));
	// game.devOrb = new DevOrb();
	// game.powerUps.push(new xxlBoard(0, 0));

	level_0();

	gameLoop();
}


const gameLoop = () => {
	// refresh canvas
	ctx.drawImage(game.misc.background, 0, 0, viewport.w, viewport.h);

	ctx.fillStyle = 'rgba(22, 22, 24, 0.75)';
	ctx.fillRect(0, 0, viewport.w, viewport.h);

	for (let i = 0; i < game.misc.pipes.length; i++) {
		game.misc.pipes[i].draw();
	}

	// whether to render grid or not
	if (game.brickArea.renderGrid) {
		game.brickArea.draw();
		let segments = game.gridSegments.length;
		for (let i = 0; i < segments; i++) {
			game.gridSegments[i].draw();
		}
		// ruler
		ctx.strokeStyle = 'darkred';
		ctx.beginPath();
		ctx.moveTo(viewport.w / 2, 0);
		ctx.lineTo(viewport.w / 2, viewport.h);
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(0, viewport.h / 2);
		ctx.lineTo(viewport.w, viewport.h / 2);
		ctx.stroke();
	}

	// player board movement
	if (game.boardControl.left) game.playerBoard.moveLeft();
	if (game.boardControl.right) game.playerBoard.moveRight();

	// GAME COMPONENTS
	game.huds.statsHud.draw();
	game.huds.powerUpHud.draw();
	game.playerBoard.draw();
	// game.devOrb.isColliding();
	// game.devOrb.draw();

	// BRICKS
	let bricks = game.bricks.length;
	for (let i = 0; i < bricks; i++) {
		if (!game.bricks[i].hidden) {
			game.bricks[i].draw();
		}
	}

	// POWERUPS
	for (let i = 0; i < game.powerUps.length; i++) {
		game.powerUps[i].collected();
		if (!game.powerUps[i].hidden) {
			game.powerUps[i].y += game.powerUps[i].vy;
			game.powerUps[i].draw();
		}
	}

	// ORBS
	for (let i = 0; i < game.orbs.length; i++) {
		if (game.running) {
			game.orbs[i].isColliding();
			game.orbs[i].x += game.orbs[i].vx;
			game.orbs[i].y += game.orbs[i].vy;
		} else {
			// stick orb to player board until game is running
			game.orbs[i].x = game.playerBoard.x;
			game.orbs[i].y = game.playerBoard.y - 10;
		}
		game.orbs[i].draw();
	}

	requestAnimationFrame(gameLoop);
}


// EVENT LISTENER ============================================================
// keyCodes: 65 = A // 68 = D // 87 = W // 83 = S // 96 = E // 32 = SPACE
document.addEventListener('mousemove', e => {
	// game.devOrb.move(e);
	// game.powerUps[0].x = e.pageX;
	// game.powerUps[0].y = e.pageY;
});

document.addEventListener('keydown', e => {
	// console.log(e.keyCode);
	// spacebar to launch orb from board (and start the game)
	if (!game.running && e.keyCode === 32) {
		game.running = true;
	}
	if (game.running && game.equippedPowerUp && e.keyCode === 69) {// E
		game.equippedPowerUp.activate();
	}
	if (e.keyCode === 68) {// D
		game.boardControl.right = true;
		game.boardControl.left = false;
	}
	if (e.keyCode === 65) {// A
		game.boardControl.left = true;
		game.boardControl.right = false;
	}
});

document.addEventListener('keyup', e => {
	if (e.keyCode === 68) game.boardControl.right = false;
	if (e.keyCode === 65) game.boardControl.left = false;
});


// CLASSES ============================================================
