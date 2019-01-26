export let canvas: any = document.querySelector('#canvas');
export let ctx: any = canvas.getContext('2d');
export let viewport: any = {
	w: window.innerWidth < 1000 ? 1000 : window.innerWidth,
	h: window.innerHeight < 600 ? 600 : window.innerHeight,
};

export let game: any = {
	running: false,
	fps: 0,
	lastFrameRendered: 0,
	frameCounter: 0,
	misc: {
		texts: {
			startGame: ''
		},
		background: null
	}
};
