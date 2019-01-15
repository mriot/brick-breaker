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
