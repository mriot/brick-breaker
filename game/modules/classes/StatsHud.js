class StatsHud {
	constructor() {
		this.w = viewport.w / 100 * 25;
		this.h = 30;

		this.draw = () => {
			ctx.fillStyle = '#aaa';
			ctx.font = "16px Arial";
			ctx.fillText("Time: 0s // Score: 0", 10, this.h - 5);

			// top wall
			ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
			ctx.fillRect(0, 0, viewport.w, this.h + 10);
			ctx.fill();
		}
	}
}
