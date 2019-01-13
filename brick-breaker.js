document.addEventListener('DOMContentLoaded', () => {
	let canvas = document.querySelector('#canvas');
	let viewport = {w: window.innerWidth, h: window.innerHeight};
	let ctx = canvas.getContext('2d');
	let game = {
		running: false,
		devOrb: null,
		statsHud: null,
		playerBoard: null,
		brickArea: null,
		orbs: [],
		bricks: [],
		gridSegments: []
	};

	window.expose = {
		renderGrid: game.devRenderGrid,
		getGame: () => {return game}
	};

	document.addEventListener('mousemove', e => {
		if (game.running) {
			game.playerBoard.move(e);
		}
		// game.devOrb.move(e);
	});
	document.addEventListener('keypress', e => {
		if (e.keyCode === 32 && !game.running) {
			game.running = true;
		}
	});

	canvas.width = viewport.w;
	canvas.height = viewport.h;


	const InitCanvas = () => {
		ctx.fillStyle = '#161618';
		ctx.fillRect(0, 0, viewport.w, viewport.h);
	}

	const Init = () => {
		game.brickArea = new BrickArea(viewport.w / 100 * 5, 50, viewport.w / 100 * 90, viewport.h / 2, true);
		game.statsHud = new StatsHud();
		game.playerBoard = new PlayerBoard();
		game.orbs.push(new Orb(game.playerBoard.x, game.playerBoard.y - 10));
		// game.devOrb = new DevOrb();

		// TEMP: lvl generator
		offsetX = game.brickArea.x + 2.5;
		for (let i = 0; i < 10; i++) {
			game.bricks.push(new Brick(offsetX, game.brickArea.y, 'brown'));
			offsetX += game.brickArea.w / 10;
		}

		offsetX = game.brickArea.x + 2.5 + game.brickArea.w / 10 - (game.brickArea.w / 10) / 2;
		for (let i = 0; i < 9; i++) {
			game.bricks.push(new Brick(offsetX, game.brickArea.y + 20, 'brown'));
			offsetX += game.brickArea.w / 10;
		}

		offsetX = game.brickArea.x + 2.5 + game.brickArea.w / 10;
		for (let i = 0; i < 8; i++) {
			game.bricks.push(new Brick(offsetX, game.brickArea.y + 40, 'brown'));
			offsetX += game.brickArea.w / 10;
		}

		offsetX = game.brickArea.x + 2.5 + game.brickArea.w / 10 + (game.brickArea.w / 10) / 2;
		for (let i = 0; i < 7; i++) {
			game.bricks.push(new Brick(offsetX, game.brickArea.y + 60, 'brown'));
			offsetX += game.brickArea.w / 10;
		}

		console.log(game);
		Update();
	}

	const Update = () => {
		InitCanvas();

		if (game.brickArea.renderGrid) {
			game.brickArea.draw();
			let segments = game.gridSegments.length;
			for (let i = 0; i < segments; i++) {
				game.gridSegments[i].draw();
			}
		}

		Ruler();

		game.statsHud.draw();
		game.playerBoard.draw();
		// game.devOrb.isColliding();
		// game.devOrb.draw();

		let bricks = game.bricks.length;
		for (let i = 0; i < bricks; i++) {
			if (!game.bricks[i].hidden) {
				game.bricks[i].draw();
			}
		}

		for (let i = 0; i < game.orbs.length; i++) {
			if (game.running) {
				game.orbs[i].isColliding();
				game.orbs[i].y += game.orbs[i].vy;
				game.orbs[i].x += game.orbs[i].vx;
			}
			game.orbs[i].draw();
		}

		requestAnimationFrame(Update);
	}

	class BrickArea {
		constructor(x, y, w, h, renderGrid = false) {
			this.x = x;
			this.y = y;
			this.w = w;
			this.h = h;
			this.renderGrid = renderGrid;
			this.segmentsPerRow = 4;// grid

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
				ctx.fillStyle = "rgba(0, 255, 0, 0.1)";
				ctx.fillRect(game.brickArea.x, game.brickArea.y, game.brickArea.w, game.brickArea.h);
				ctx.fill();
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
				ctx.strokeStyle = this.color;
				ctx.strokeRect(this.x, this.y, this.w, this.h);
				ctx.fillText(this.id, this.x + this.w / 2.2, this.y + this.h / 1.6);
			}
		}
	}

	class StatsHud {
		constructor() {
			this.x = 5;
			this.y = 5;
			this.w = viewport.w / 100 * 25;
			this.h = 35;

			this.draw = () => {
				ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
				ctx.fillRect(this.x, this.y, this.w, this.h);
				ctx.fill();

				ctx.font = "16px Arial";
				ctx.fillText("Time: 0s // Score: 0", 10, this.h / 1.3);

				// top wall
				ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
				ctx.fillRect(0, 0, viewport.w, game.brickArea.y);
				ctx.fill();
			}
		}
	}

	class Brick {
		constructor(x, y, color) {
			this.x = x;
			this.y = y;
			this.w = game.brickArea.w / 15 - 5;
			this.h = this.w / 2.5;
			this.fillColor = color;
			this.hidden = false;

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

			this.draw = () => {
				ctx.fillStyle = this.fillColor;
				ctx.fillRect(this.x, this.y, this.w, this.h);
				ctx.fill();
			}
		}
	}

	class Orb {
		constructor(x, y) {
			this.x = x;
			this.y = y;
			this.vx = 0;
			this.vy = -5;
			this.radius = 6;
			this.fillColor = 'cyan';

			this.hits = (obj) => {
				return (this.x + this.radius) >= obj.x && this.x + this.radius <= (obj.x + obj.w + this.radius * 2) && (this.y + this.radius) >= obj.y && this.y + this.radius <= (obj.y + obj.h + this.radius * 2);
			}

			this.isColliding = () => {
				if (this.y - this.radius <= game.brickArea.y) this.vy *= -1;// top
				let segments = game.gridSegments;
				for (let i = 0; i < segments.length; i++) {
					if (this.hits(segments[i])) {
						segments[i].color = 'rgb(0, 255, 0)';
						for (let j = 0; j < segments[i].contains.length; j++) {
							// segments[i].contains[j].fillColor = 'dodgerblue';
							if (!segments[i].contains[j].hidden && this.hits(segments[i].contains[j])) {
								// segments[i].contains[j].fillColor = 'red';
								segments[i].contains[j].hidden = true;
								this.vy *= -1;
							}
						}
					} else {
						segments[i].color = 'rgba(0, 255, 255, 0.5)';
					}

				}

				// check for collisions if outside brick area
				if (this.x - this.radius <= 0) this.vx *= -1;// left wall
				if (this.x + this.radius >= viewport.w) this.vx *= -1;// right wall

				let distX = (this.x + this.radius) - (game.playerBoard.x - game.playerBoard.w / 2);
				let distY = (this.y + this.radius) - game.playerBoard.y;
				if ((distX >= 0 && distX <= game.playerBoard.w + this.radius * 2) && (distY >= 0 && distY <= game.playerBoard.h + this.radius * 2)) {
					this.vy *= -1;
				}
			}

			this.draw = () => {
				ctx.fillStyle = this.fillColor;
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
				ctx.fill();

				ctx.font = "14px Arial";
				// ctx.fillText('x:'+this.x.toFixed(0)+' y:'+this.y.toFixed(0), this.x + this.radius + 10, this.y);
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

	class PlayerBoard {
		constructor() {
			this.x = viewport.w / 2;
			this.y = viewport.h - 25;
			this.vx = 50;
			this.vy = 10;
			this.w = viewport.w / 100 * 10;
			this.h = 7;
			this.fillColor = '#fff';

			this.move = event => {
				this.x = event.pageX;
			}

			this.draw = () => {
				ctx.fillStyle = this.fillColor;
				ctx.fillRect(this.x - this.w / 2, this.y, this.w, this.h);
				ctx.fill();

				ctx.font = "14px Arial";
				ctx.fillText('x:'+this.x.toFixed(0)+' y:'+this.y.toFixed(0), this.x + this.w / 2 + 10, this.y);
			}
		}
	}


	const Ruler = () => {
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


	Init();
});
