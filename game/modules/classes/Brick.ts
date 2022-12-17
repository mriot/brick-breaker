import { ctx } from "../global";
import { MultiOrb } from "./PowerUp_MultiOrb";
import { XXLBoard } from "./PowerUp_XXLBoard";
import { GridSegment } from "./GridSegment";
import { FX } from "./FX";
import { FireOrb } from "./PowerUp_FireOrb";

export class Brick {
    x: number;
    y: number;
    w: number;
    h: number;
    destroyed: boolean;
    hitsRequired: number;
	texture: HTMLImageElement;
	inside: any[];
    dropPowerUp: () => void;
    draw: () => void;
	poof: () => void;

	public static instances: Brick[] = [];
	public static render = () => {
		for (let i = 0; i < Brick.instances.length; i++) {
			if (!Brick.instances[i].destroyed) {
				Brick.instances[i].draw();
			}
		}
	}

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
		this.w = 60;
		this.h = 40;
		this.inside = [];
		this.destroyed = false;
		this.hitsRequired = 1;
		this.texture = new Image(0, 0);
		this.texture.src = 'img/brick.png';

		Brick.instances.push(this);

		// segment assignment
		for (let i = 0; i < GridSegment.instances.length; i++) {
			let seg = GridSegment.instances[i];
			if (this.x + this.w >= seg.x && this.x <= seg.x + seg.w && this.y + this.h >= seg.y && this.y <= seg.y + seg.h) {
				GridSegment.instances[i].contains.push(this);
				this.inside.push(GridSegment.instances[i]);
			}
		}

		this.dropPowerUp = () => {
			if (Math.round(Math.random() * 6) === 1 || false) {
				switch (Math.floor(Math.random() * 3)) {
					case 0:
						new MultiOrb(this.x, this.y)
						break;
					case 1:
						new XXLBoard(this.x, this.y)
						break;
					case 2:
						new FireOrb(this.x, this.y)
						break;
					default:
						console.warn('Brick.ts : dropPowerUp() : Out of range!');
				}
			}
		}

		this.poof = () => {
			this.destroyed = true;
			// remove brick from segments
			this.inside.forEach(seg => {
				for (let i = 0; i < seg.contains.length; i++) {
					if (seg.contains[i].destroyed) seg.contains.splice(i, 1);
				}
			});
			this.dropPowerUp();
			// new FX('poof', this.x, this.y);
		}

		this.draw = () => {
			ctx.save();
			// ctx.strokeStyle = '#fff';
			// ctx.strokeRect(this.x, this.y, this.w, this.h);
			ctx.drawImage(this.texture, this.x, this.y, this.w, this.h);
			ctx.restore();
		}
	}
}
