let canvas: any = document.querySelector('#canvas');
let ctx: any = canvas.getContext('2d');
let viewport: any = {w: window.innerWidth, h: window.innerHeight};
let game: any = {
	boardControl: {left: false, right: false},
	running: false,
	devOrb: null,
	playerBoard: null,
	brickArea: null,
	orbs: [],
	bricks: [],
	gridSegments: [],
	powerUps: [],
	equippedPowerUp: null,
	activePowerUp: null,
	UIs: {
		statsUI: null,
		powerUpUI: null
	},
	misc: {
		texts: {
			startGame: ''
		},
		pipes: [],
		background: null
	}
}

export {canvas, ctx, viewport, game}
