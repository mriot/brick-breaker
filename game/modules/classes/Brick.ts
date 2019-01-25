import { ctx } from "../global";
import { MultiOrb } from "./PowerUp_MultiOrb";
import { XXLBoard } from "./PowerUp_XXLBoard";
import { GridSegment } from "./GridSegment";
import { FX } from "./FX";

export class Brick {
    x: number;
    y: number;
    w: number;
    h: number;
    hidden: boolean;
    hitsRequired: number;
	texture: HTMLImageElement;
    dropPowerUp: () => void;
    draw: () => void;
	poof: () => void;

	public static instances: Brick[] = [];
	public static render = () => {
		for (let i = 0; i < Brick.instances.length; i++) {
			if (!Brick.instances[i].hidden) {
				Brick.instances[i].draw();
			}
		}
	}

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
		this.w = 60;
		this.h = 40;
		this.hidden = false;
		this.hitsRequired = 1;
		this.texture = new Image(0, 0);
		this.texture.src = 'img/brick.png';

		Brick.instances.push(this);

		// segment assignment
		for (let i = 0; i < GridSegment.instances.length; i++) {
			let seg = GridSegment.instances[i];
			if (this.x + this.w >= seg.x && this.x <= seg.x + seg.w && this.y + this.h >= seg.y && this.y <= seg.y + seg.h) {
				GridSegment.instances[i].contains.push(this);
			}
		}

		this.dropPowerUp = () => {
			if (Math.round(Math.random() * 5) === 1 || false) {
				let num = Math.round(Math.random() * 2);
				if (num === 0) new XXLBoard(this.x, this.y);
				if (num === 1) new MultiOrb(this.x, this.y);
			}
		}

		this.poof = () => {
			new FX('poof', this.x, this.y);
			this.hidden = true;
		}

		this.draw = () => {
			ctx.save();
			ctx.drawImage(this.texture, this.x, this.y, this.w, this.h);
			ctx.restore();
		}
	}
}
