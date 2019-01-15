class Pipe {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;

		this.texture = new Image(0, 0);
		this.texture.src = 'img/pipe.png';

		this.draw = () => {
			ctx.save();
			let pat = ctx.createPattern(this.texture, 'repeat');
			ctx.fillStyle = pat;
			ctx.fillRect(this.x, this.y, this.w, this.h);
			ctx.restore();
		}
	}
}
