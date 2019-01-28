import { viewport, ctx } from "../global";
import { PowerUp } from "./PowerUp";

export class PowerUpUI {
    x: number;
    y: number;
    w: any;
    h: number;
    powerUpLifetime: number;
    initLifetime: number;
	icon: HTMLImageElement;
    timer: (lifetime: number) => void;
	draw: () => void;

	public static instance: PowerUpUI = null;
	public static render = () => {
		PowerUpUI.instance.draw()
	}

	constructor() {
		this.x = viewport.w - 40;
		this.y = 0;
		this.w = viewport.w;
		this.h = 5;
		this.powerUpLifetime = 0;
		this.initLifetime = 0;
		this.icon = new Image(0, 0);

		PowerUpUI.instance = this;

		this.timer = lifetime => {
			this.powerUpLifetime = this.initLifetime = lifetime;
			let timer = setInterval(() => {
				this.powerUpLifetime -= 0.016;
				if (this.powerUpLifetime <= 0) clearInterval(timer);
			}, 1000/60);
		}

		this.draw = () => {
			ctx.save();
			if (PowerUp.equipped) {
				ctx.drawImage(this.icon, 0, viewport.h - this.icon.naturalHeight);
			}
			if (this.powerUpLifetime > 0) {
				let fill = this.w / this.initLifetime * this.powerUpLifetime;
				ctx.shadowBlur = 15;
				ctx.shadowColor = '#000';
				ctx.fillStyle = 'darkred';
				ctx.fillRect(viewport.w / 2 - fill / 2, viewport.h - this.h, fill, this.h);
			}
			ctx.restore();
		}
	}
}
