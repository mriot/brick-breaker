document.addEventListener('DOMContentLoaded', () => {
	let canvas = document.querySelector('#canvas');
	let viewport = {w: window.innerWidth, h: window.innerHeight};
	let ctx = canvas.getContext('2d');
	let rand = {
		x: () => {return Math.random() * viewport.w},
		y: () => {return Math.random() * viewport.h}
	};

	canvas.width = viewport.w;
	canvas.height = viewport.h;

	let items = {
		wobble: 5,
		maxArcs: 10,
		arcs: [],
		wire: []
	}


	const InitCanvas = () => {
		ctx.fillStyle = '#161618';
		ctx.fillRect(0, 0, viewport.w, viewport.h);
	}


	const Init = () => {
		let percentX = 15;
		for (let i = 0; i < items.maxArcs; i++) {
			items.arcs.push(new Arc(viewport.w/100*(percentX-10), viewport.h/100*60));
			items.arcs.push(new Arc(viewport.w/100*percentX, viewport.h/100*30));

			if (i > 0) {
				new Wire(items.arcs[i-1].x, items.arcs[i-1].y, items.arcs[i].x, items.arcs[i].y).draw();
			}

			percentX += 20;
			items.arcs[i].draw();
		}
		Update();
	}


	const Update = () => {
		InitCanvas();

		for (let i = 0; i < items.maxArcs; i++) {
			// items.arcs[i].x += items.arcs[i].vx;
			// items.arcs[i].y += items.arcs[i].vy;

			if (i > 0) {
				new Wire(items.arcs[i-1].x, items.arcs[i-1].y, items.arcs[i].x, items.arcs[i].y).draw();
			}

			// items.arcs[i].vx *= -1;
			// items.arcs[i].vy *= -1;

			items.arcs[i].draw();
		}
		requestAnimationFrame(Update);
	}


	class Arc {
		constructor(x, y) {
			this.x = x;
			this.y = y;
			this.vx = Math.round(Math.random()) * 2;
			this.vy = Math.round(Math.random()) * 2;
			this.radius = 4;

			this.draw = () => {
				ctx.fillStyle = '#fff';
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
				ctx.fill();
			}
		}
	}


	class Wire {
		constructor(x1, y1, x2, y2) {
			this.x1 = x1;
			this.y1 = y1;
			this.x2 = x2;
			this.y2 = y2;

			this.draw = () => {
				ctx.strokeStyle = 'cyan';
				ctx.beginPath();
				ctx.moveTo(this.x1, this.y1);
				ctx.lineTo(this.x2, this.y2);
				ctx.stroke();
			}
		}
	}


	Init();
});
