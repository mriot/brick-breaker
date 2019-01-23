import { viewport, ctx } from "../global";

export class PlayerBoard {
    x: number;
    y: number;
    vx: number;
    vy: number;
    w: number;
    h: number;
    sticky: boolean;
    fillColor: string;
    texture: HTMLImageElement;
    draw: () => void;
    moveLeft: () => void;
    moveRight: () => void;

	public static controls: any = {left: false, right: false}
	public static instance: PlayerBoard = null;
	public static render = () => {
		PlayerBoard.instance.draw();
	}

	constructor() {
		this.x = viewport.w / 2;
		this.y = viewport.h - 25;
		this.vx = 15;
		this.vy = 5;
		this.w = viewport.w / 100 * 10;
		this.h = 7;
		this.sticky = false;
		this.fillColor = '#fff';
		this.texture = new Image(0, 0);
		this.texture.src = 'img/paddle2.png';

		PlayerBoard.instance = this;

		this.moveLeft = () => {
			if (this.x - this.w / 2 > 0) this.x -= this.vx
		}

		this.moveRight = () => {
			if (this.x + this.w / 2 < viewport.w) this.x += this.vx
		}

		this.draw = () => {
			if (PlayerBoard.controls.left) this.moveLeft();
			if (PlayerBoard.controls.right) this.moveRight();

			ctx.save();
			ctx.fillStyle = this.fillColor;
			ctx.shadowBlur = 10;
			ctx.shadowColor = "rgba(255, 255, 255, 0.1)";
			ctx.drawImage(this.texture, this.x - this.w / 2, this.y, this.w, this.h);
			ctx.restore();

		}
	}
}
