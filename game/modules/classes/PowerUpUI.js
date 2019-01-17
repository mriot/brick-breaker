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
