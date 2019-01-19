import { game, ctx } from "../global";
import { MultiOrb } from "./PowerUp_MultiOrb";
import { XXLBoard } from "./PowerUp_XXLBoard";
import { GridSegment } from "./GridSegment";

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

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
		this.w = 60;
		this.h = 40;
		this.hidden = false;
		this.hitsRequired = 1;
		this.texture = new Image(0, 0);
		this.texture.src = 'img/brick.png';

		let within = (segment: GridSegment) => {
			if ((this.x + this.w) >= segment.x && this.x <= (segment.x + segment.w) && (this.y + this.h) >= segment.y && this.y <= (segment.y + segment.h)) {
				return true;
			}
		}

		// segment check
		for (let i = 0; i < game.gridSegments.length; i++) {
			if (within(game.gridSegments[i])) {
				game.gridSegments[i].contains.push(this);
			}
		}

		this.dropPowerUp = () => {
			if (Math.round(Math.random() * 5) === 1 || true) {
				let num = Math.round(Math.random() * 2);
				num = 0;
				if (num === 0) game.powerUps.push(new XXLBoard(this.x, this.y));
				if (num === 1) game.powerUps.push(new MultiOrb(this.x, this.y));
			}
		}

		this.draw = () => {
			ctx.save();
			ctx.drawImage(this.texture, this.x, this.y, this.w, this.h);
			ctx.fill();
			ctx.restore();
		}
	}
}
