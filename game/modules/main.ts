import { canvas, ctx, viewport, game } from './global';
import { TextUI } from './classes/TextUI';
import { Grid } from './classes/Grid';
import { StatsUI } from './classes/StatsUI';
import { PowerUpUI } from './classes/PowerUpUI';
import { PlayerBoard } from './classes/PlayerBoard';
import { Orb } from './classes/Orb';
import { level_1 } from './level/level-1';
import { PowerUp } from './classes/PowerUp';
import { Brick } from './classes/Brick';
import { DevOrb } from './classes/Orb_DevOrb';
import { FX } from './classes/FX';
import { XXLBoard } from './classes/PowerUp_XXLBoard';
import { FireOrb } from './classes/PowerUp_FireOrb';
import { GridSegment } from './classes/GridSegment';
import { MultiOrb } from './classes/PowerUp_MultiOrb';
import { xorNum } from './utilities/functions';

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
	game.misc.texts.usePowerUp = new TextUI('E = PowerUp', 'center', viewport.h - 75, '#fff', '30px Impact');
	
	// game setup
	new Grid(0, 45, viewport.w, viewport.h - 45);
	new StatsUI();
	new PowerUpUI();
	new PlayerBoard();
	new Orb(PlayerBoard.instance.x, PlayerBoard.instance.y - 10);
	new DevOrb();
	// new FireOrb(PlayerBoard.instance.x, PlayerBoard.instance.y);
	// new MultiOrb(PlayerBoard.instance.x, PlayerBoard.instance.y-200);
	
	level_1();

	// console.log(GridSegment.instances[GridSegment.instances.length - 1].id);

	gameLoop();
}

const gameLoop = () => {
	// clear canvas
	ctx.clearRect(0, 0, viewport.w, viewport.h);
	
	// draw background image
	ctx.drawImage(game.misc.background, 0, 0, viewport.w, viewport.h);
	ctx.fillStyle = 'rgba(22, 22, 24, 0.7)';
	ctx.fillRect(0, 0, viewport.w, viewport.h);

	// display 'game start' text while game is not running
	if (!game.running) game.misc.texts.startGame.pulse();
	if (!game.running) game.misc.texts.moveLeft.draw();
	if (!game.running) game.misc.texts.moveRight.draw();
	if (!game.running) game.misc.texts.usePowerUp.draw();
	
	// GAME COMPONENTS
	Grid.render();
	StatsUI.render();
	PowerUpUI.render();
	Brick.render();
	PowerUp.render();
	PlayerBoard.render();
	Orb.render();
	// FX.render();

	if (game.misc.texts.calcs) game.misc.texts.calcs.draw();
	if (game.over) game.misc.texts.gameover.pulse();

	requestAnimationFrame(() => {
		// FPS display
		game.frameCounter++;
		let fps = 1 / ((performance.now() - game.lastFrameRendered) / 1000);
		game.lastFrameRendered = performance.now();
		if (game.frameCounter > 30) { game.fps = fps; game.frameCounter = 0; }
		gameLoop();
	});
}
