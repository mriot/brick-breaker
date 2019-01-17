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
		UIs: {
			statsUI: null,
			powerUpUI: null
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
	game.brickArea = new BrickArea(0, 45, viewport.w, viewport.h / 2, true);
	game.UIs.statsUI = new StatsUI();
	game.UIs.powerUpUI = new PowerUpUI();
	game.playerBoard = new PlayerBoard();
	game.orbs.push(new Orb(game.playerBoard.x, game.playerBoard.y - 10));
	// game.devOrb = new DevOrb();
	// game.powerUps.push(new xxlBoard(0, 0));

	// level_0();
	level_1();

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
	game.UIs.statsUI.draw();
	game.UIs.powerUpUI.draw();
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
		game.orbs[i].drawTrail();
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

const level_0 = () => {
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

class Brick {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.w = 60;
		this.h = 40;
		this.hidden = false;
		this.hitsRequired = 1;
		this.texture = new Image(0, 0);
		this.texture.src = 'img/brick.png';

		this.within = segment => {
			if ((this.x + this.w) >= segment.x && this.x <= (segment.x + segment.w) && (this.y + this.h) >= segment.y && this.y <= (segment.y + segment.h)) {
				return true;
			}
		}

		// segment check
		for (let i = 0; i < game.gridSegments.length; i++) {
			if (this.within(game.gridSegments[i])) {
				game.gridSegments[i].contains.push(this);
			}
		}

		this.dropPowerUp = () => {
			if (Math.round(Math.random() * 5) === 1 || false) {
				let num = Math.round(Math.random() * 5);
				num = 0;
				if (num === 0) game.powerUps.push(new XXLBoard(this.x, this.y));
				if (num === 1) game.powerUps.push(new StickyBoard(this.x, this.y));
			}
		}

		this.draw = () => {
			ctx.save();
			// ctx.fillStyle = this.fillColor;
			// ctx.fillRect(this.x, this.y, this.w, this.h);
			ctx.drawImage(this.texture, this.x, this.y, this.w, this.h);
			ctx.fill();
			ctx.restore();
		}
	}
}

class BrickArea {
	constructor(x, y, w, h, renderGrid = false) {
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

class GridSegment {
	constructor(x, y, size, id, brickAreaSize) {
		this.x = x;
		this.y = y;
		this.w = brickAreaSize.w / size;
		this.h = brickAreaSize.h / size;
		this.color = 'rgba(0, 255, 255, 0.5)';
		this.id = id;
		this.contains = [];

		this.draw = () => {
			ctx.save();
			ctx.strokeStyle = this.color;
			ctx.strokeRect(this.x, this.y, this.w, this.h);
			ctx.fillText(this.id, this.x + this.w / 2.2, this.y + this.h / 1.6);
			ctx.restore();
		}
	}
}

class Orb {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.vx = Math.floor(Math.random() * 5 + 3);
		this.vy = 1;
		this.radius = 6;
		this.fillColor = 'cyan';
		this.maxTrailLength = 5;
		this.trail = [];

		this.hits = (obj) => {
			return (this.x + this.radius) >= obj.x && this.x + this.radius <= (obj.x + obj.w + this.radius * 2) && (this.y + this.radius) >= obj.y && this.y + this.radius <= (obj.y + obj.h + this.radius * 2);
		}

		this.isColliding = () => {
			let segments = game.gridSegments;
			for (let i = 0; i < segments.length; i++) {
				if (this.hits(segments[i])) {
					for (let j = 0; j < segments[i].contains.length; j++) {
						let brick = segments[i].contains[j];
						if (!brick.hidden && this.hits(brick)) {
							brick.hidden = true;
							brick.dropPowerUp();
							this.vy *= -1;
						}
					}
				}
			}

			// wall collision
			if (this.y - this.radius < game.brickArea.y) {this.vy *= -1; this.y = game.brickArea.y + this.radius}// top
			if (this.x - this.radius < 0) {this.vx *= -1; this.x = this.radius}// left wall
			if (this.x + this.radius > viewport.w) {this.vx *= -1; this.x = viewport.w - this.radius;}// right wall

			// board collision
			let distX = (this.x + this.radius) - (game.playerBoard.x - game.playerBoard.w / 2);
			let distY = (this.y + this.radius) - game.playerBoard.y;
			if ((distX >= 0 && distX <= game.playerBoard.w + this.radius * 2) && (distY >= 0 && distY <= game.playerBoard.h + this.radius * 2)) {
				if (game.playerBoard.sticky) {
					this.vy = 0;
					this.vx = 0;
				} else {
					this.vy = Math.floor(Math.random() * 5 + 5) * -1;
					// this.vx = Math.floor(Math.random() * 5 + 5) * -1;
				}
			}
		}

		this.drawTrail = () => {
			ctx.save();
			this.trail.push({x: this.x, y: this.y});
			if (this.trail.length > this.maxTrailLength) this.trail.shift();

			let radius = this.radius - 2;
			let opacity = 0.1;
			for (let i = 0; i < this.trail.length; i++) {
				ctx.fillStyle = 'rgba(0, 255, 255, '+opacity+')';
				ctx.beginPath();
				ctx.arc(this.trail[i].x, this.trail[i].y, radius, 0, Math.PI * 2, false);
				ctx.fill();
				radius += 0.5;
				opacity += 0.1;
			}
			ctx.restore();
		}

		this.draw = () => {
			ctx.save();
			ctx.fillStyle = this.fillColor;
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
			ctx.fill();
			ctx.restore();
		}
	}
}

class DevOrb extends Orb {
	constructor() {
		super(500, 500);
		this.vx = 0;
		this.vy = 0;

		this.move = event => {
			this.x = event.pageX;
			this.y = event.pageY;
		}
	}
}

class Pipe {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;

		this.texture = new Image(0, 0);
		this.texture.src = 'img/wall_vertical.png';

		this.draw = () => {
			ctx.save();
			let pat = ctx.createPattern(this.texture, 'repeat-y');
			ctx.fillStyle = pat;
			ctx.fillRect(this.x, this.y, this.w, this.h);
			ctx.restore();
		}
	}
}

class PlayerBoard {
	constructor() {
		this.x = viewport.w / 2;
		this.y = viewport.h - 25;
		this.vx = 15;
		this.vy = 5;
		this.w = viewport.w / 100 * 10;
		this.h = 7;
		this.sticky = false;
		this.fillColor = '#fff';
		this.texture = new Image(0, 0);
		// this.texture.src = 'img/paddle.png';

		this.moveLeft = () => {
			if(this.x - this.w / 2 > 0) this.x -= this.vx
		}

		this.moveRight = () => {
			if(this.x + this.w / 2 < viewport.w) this.x += this.vx
		}

		this.draw = () => {
			ctx.save();
			ctx.fillStyle = this.fillColor;
			ctx.shadowBlur = 10;
			ctx.shadowColor = "rgba(255, 255, 255, 0.2)";
			ctx.fillRect(this.x - this.w / 2, this.y, this.w, this.h);
			ctx.drawImage(this.texture, this.x - this.w / 2, this.y, this.w, this.h);
			ctx.fill();
			ctx.restore();

			// ctx.font = "14px Arial";
			// ctx.fillText('x:'+this.x.toFixed(0)+' y:'+this.y.toFixed(0), this.x + this.w / 2 + 10, this.y);
		}
	}
}

class PowerUp {
	constructor(x, y, name) {
		this.x = x;
		this.y = y;
		this.vy = 5;
		this.w = 50;
		this.h = 25;
		this.hidden = false;
		this.color = 'purple';

		this.collected = () => {
			if (!this.hidden && (this.x + this.w) >= game.playerBoard.x - game.playerBoard.w / 2 && this.x <= (game.playerBoard.x + game.playerBoard.w / 2) && (this.y + this.h) >= game.playerBoard.y && this.y <= (game.playerBoard.y + game.playerBoard.h)) {
				this.hidden = true;
				console.log('power up ' + name + ' equipped!');
				game.equippedPowerUp = this;
				// TODO: remove from array
				return true;
			}
		}

		this.draw = () => {
			ctx.save();
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x, this.y, this.w, this.h);
			ctx.fill();
			ctx.restore();
		}
	}
}

class PowerUpUI {
	constructor() {
		this.x = viewport.w - 40;
		this.y = 0;
		this.w = 40;
		this.h = 40;

		this.draw = () => {
			ctx.save();
			ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
			ctx.fillRect(this.x, this.y, this.w, this.h);
			ctx.fill();
			ctx.restore();
		}
	}
}

class StickyBoard extends PowerUp {
	constructor(x, y) {
		super(x, y, 'Sticky Board');
		this.lifetime = 30;

		this.activate = () => {
			game.playerBoard.sticky = true;
			game.equippedPowerUp = null;
			setTimeout(() => {
				game.playerBoard.sticky = false;
			}, this.lifetime * 1000)
		}
	}
}

class XXLBoard extends PowerUp {
	constructor(x, y) {
		super(x, y, 'XXL Board');
		this.lifetime = 30;// seconds

		this.activate = () => {
			game.playerBoard.w *= 2;
			game.equippedPowerUp = null;
			setTimeout(() => {
				game.playerBoard.w /= 2;
			}, this.lifetime * 1000)
		}
	}
}

class StatsUI {
	constructor() {
		this.w = viewport.w / 100 * 25;
		this.h = 30;

		this.level = 0;

		this.draw = () => {
			ctx.save();
			ctx.fillStyle = '#aaa';
			ctx.font = "16px Arial";
			ctx.fillText(`Level ${this.level}`, 10, this.h - 5);

			// container
			ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
			ctx.fillRect(0, 0, viewport.w, this.h + 10);
			ctx.restore();
		}
	}
}

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
