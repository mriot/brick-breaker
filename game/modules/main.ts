import { canvas, ctx, viewport, game } from './global';
import { TextUI } from './classes/TextUI';
import { BrickArea } from './classes/BrickArea';
import { StatsUI } from './classes/StatsUI';
import { PowerUpUI } from './classes/PowerUpUI';
import { PlayerBoard } from './classes/PlayerBoard';
import { Orb } from './classes/Orb';
import { level_1 } from './level/level-1';

// INIT GAME ============================================================
document.addEventListener('DOMContentLoaded', () => init())

const init = () => {
	// keyCodes: 65 = A // 68 = D // 87 = W // 83 = S // 96 = E // 32 = SPACE
	document.addEventListener('keydown', e => {
		// console.log(e.keyCode);
		// spacebar to launch orb from board (and start the game)
		if (e.keyCode === 32 && !game.running) {
			game.running = true;
		}
		if (e.keyCode === 69 && game.running && game.equippedPowerUp) {// E
			game.equippedPowerUp.activate();
		}
		// let boardControl: any = {left: false, right: false};
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

	// document.addEventListener('mousemove', e => {
	//
	// });

	// canvas dimensions
	canvas.width = viewport.w;
	canvas.height = viewport.h;

	// background image
	game.misc.background = new Image(0, 0);
	game.misc.background.src = 'img/background.jpg';

	// game-start text
	game.misc.texts.startGame = new TextUI('Press [SPACE] to start', 'center', viewport.h / 1.15, '#fff', '40px Arial');

	// game setup
	game.brickArea = new BrickArea(0, 45, viewport.w, viewport.h / 2, false);
	game.UIs.statsUI = new StatsUI();
	game.UIs.powerUpUI = new PowerUpUI();
	game.playerBoard = new PlayerBoard();
	game.orbs.push(new Orb(game.playerBoard.x, game.playerBoard.y - 10));

	level_1();

	gameLoop();
}

const gameLoop = () => {
	// draw background image
	ctx.drawImage(game.misc.background, 0, 0, viewport.w, viewport.h);

	// refresh canvas
	ctx.fillStyle = 'rgba(22, 22, 24, 0.75)';
	ctx.fillRect(0, 0, viewport.w, viewport.h);

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
	game.UIs.statsUI.draw();
	game.UIs.powerUpUI.draw();
	game.playerBoard.draw();

	// display 'game start' text while game is not running
	if (!game.running) game.misc.texts.startGame.pulse();

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
		game.orbs[i].drawTrail();
	}

	requestAnimationFrame(() => {
		gameLoop()
	});
}
