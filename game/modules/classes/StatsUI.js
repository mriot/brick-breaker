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
