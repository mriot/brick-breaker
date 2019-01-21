export let canvas: any = document.querySelector('#canvas');
export let ctx: any = canvas.getContext('2d');
export let viewport: any = {w: window.innerWidth, h: window.innerHeight};

export let game: any = {
	running: false,
	misc: {
		texts: {
			startGame: ''
		},
		background: null
	}
};
