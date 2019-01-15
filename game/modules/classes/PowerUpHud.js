class PowerUpHud {
	constructor() {
		this.x = viewport.x + viewport.w - 100;
		this.y = viewport.y + viewport.h - 100;

		this.draw = () => {
			ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
			ctx.fillRect(this.x, this.y, this.w, this.h);
			ctx.fill();
		}
	}
}
