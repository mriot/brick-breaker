import { canvas, ctx, viewport, game } from './global';
import { TextUI } from './classes/TextUI';
import { BrickArea } from './classes/BrickArea';
import { StatsUI } from './classes/StatsUI';
import { PowerUpUI } from './classes/PowerUpUI';
import { PlayerBoard } from './classes/PlayerBoard';
import { Orb } from './classes/Orb';
import { level_1 } from './level/level-1';
import { PowerUp } from './classes/PowerUp';
import { Brick } from './classes/Brick';

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
		// E
		if (e.keyCode === 69 && game.running && PowerUp.equipped) {
			PowerUp.equipped.activate();
		}
		// D
		if (e.keyCode === 68) {
			PlayerBoard.controls.right = true;
			PlayerBoard.controls.left = false;
		}
		// A
		if (e.keyCode === 65) {
			PlayerBoard.controls.left = true;
			PlayerBoard.controls.right = false;
		}
	});

	document.addEventListener('keyup', e => {
		if (e.keyCode === 65) PlayerBoard.controls.left = false;
		if (e.keyCode === 68) PlayerBoard.controls.right = false;
	});

	// canvas dimensions
	canvas.width = viewport.w;
	canvas.height = viewport.h;

	// background image
	game.misc.background = new Image(0, 0);
	game.misc.background.src = 'img/background.png';

	// game-start text
	game.misc.texts.startGame = new TextUI('Press [SPACE] to start', 'center', viewport.h - 200, '#fff', '60px Impact');
	game.misc.texts.moveLeft = new TextUI('<< A', viewport.w / 2 - 200, viewport.h - 35, '#fff', '40px Impact');
	game.misc.texts.moveRight = new TextUI('D >>', viewport.w / 2 + 125, viewport.h - 35, '#fff', '40px Impact');
	game.misc.texts.usePowerUp = new TextUI('E = PowerUp', 'center', viewport.h - 75, '#fff', '20px Impact');
	
	// game setup
	new BrickArea(0, 45, viewport.w, viewport.h / 2);
	new StatsUI();
	new PowerUpUI();
	new PlayerBoard();
	new Orb(PlayerBoard.instance.x, PlayerBoard.instance.y - 10);
	
	level_1();

	gameLoop();
}

const gameLoop = () => {
	// draw background image
	ctx.drawImage(game.misc.background, 0, 0, viewport.w, viewport.h);

	// clear canvas
	ctx.fillStyle = 'rgba(22, 22, 24, 0.75)';
	ctx.fillRect(0, 0, viewport.w, viewport.h);

	// display 'game start' text while game is not running
	if (!game.running) game.misc.texts.startGame.pulse();
	if (!game.running) game.misc.texts.moveLeft.draw();
	if (!game.running) game.misc.texts.moveRight.draw();
	if (!game.running) game.misc.texts.usePowerUp.draw();

	// GAME COMPONENTS
	// BrickArea.render();
	StatsUI.render();
	PowerUpUI.render();
	Brick.render();
	PowerUp.render();
	PlayerBoard.render();
	Orb.render();

	requestAnimationFrame(() => {
		gameLoop()
	});
}
