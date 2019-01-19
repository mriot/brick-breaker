import { game, ctx } from "../global";

export class PowerUp {
    x: any;
    y: any;
    vy: number;
    w: number;
    h: number;
    hidden: boolean;
    icon: HTMLImageElement;
    color: string;
    collected: () => boolean;
	draw: () => void;

	constructor(x, y, name, icon) {
		this.x = x;
		this.y = y;
		this.vy = 5;
		this.w = 50;
		this.h = 25;
		this.hidden = false;
		this.icon = new Image(100, 100);
		this.icon.src = 'img/' + icon;
		this.color = 'purple';

		this.collected = () => {
			if (!this.hidden && (this.x + this.w) >= game.playerBoard.x - game.playerBoard.w / 2 && this.x <= (game.playerBoard.x + game.playerBoard.w / 2) && (this.y + this.h) >= game.playerBoard.y && this.y <= (game.playerBoard.y + game.playerBoard.h)) {
				this.hidden = true;
				console.log('power up ' + name + ' equipped!');
				game.equippedPowerUp = this;
				// TODO: remove from array
				return true;
			}
		}

		this.draw = () => {
			ctx.save();
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x, this.y, this.w, this.h);
			ctx.drawImage(this.icon, this.x, this.y);
			ctx.restore();
		}
	}
}
