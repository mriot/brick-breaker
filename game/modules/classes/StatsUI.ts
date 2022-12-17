import { viewport, ctx, game } from "../global";

export class StatsUI {
    w: number;
    h: number;
    level: number;
    draw: () => void;

	public static instance: StatsUI = null;
	public static render = () => {
		StatsUI.instance.draw();
	}

	constructor() {
		this.w = viewport.w / 100 * 25;
		this.h = 30;
		this.level = 0;

		StatsUI.instance = this;

		this.draw = () => {
			ctx.save();
			// container
			ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
			ctx.fillRect(0, 0, viewport.w, this.h + 10);
			// level
			ctx.fillStyle = '#aaa';
			ctx.font = "16px Arial";
			ctx.fillText(`LEVEL ${this.level}`, 10, this.h - 5);
			// fps
			ctx.font = '16px Arial';
			let fps = `${game.fps.toFixed(0)} FPS`;
			ctx.fillText(fps, viewport.w - ctx.measureText(fps).width - 10, this.h - 5);
			ctx.restore();
		}
	}
}