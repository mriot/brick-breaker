import { game, ctx, viewport } from "../global";
import { PlayerBoard } from "./PlayerBoard";

export class PowerUp {
    x: number;
    y: number;
    vy: number;
    w: number;
    h: number;
    hidden: boolean;
    icon: HTMLImageElement;
	color: string;
	activate: () => void;
    gotCollected: () => boolean;
	draw: () => void;
    kill: () => void;
	
	public static equipped: PowerUp = null;
	public static active: PowerUp = null;
	public static instances: PowerUp[] = [];// contains all powerups on screen
	// render all powerups on screen
	public static render = () => {
		for (let i = 0; i < PowerUp.instances.length; i++) {
			PowerUp.instances[i].draw();
		}
	}

	constructor(x: number, y: number, name: string, icon: string) {
		this.x = x;
		this.y = y;
		this.vy = 5;
		this.w = 50;
		this.h = 25;
		this.icon = new Image(100, 100);
		this.icon.src = 'img/' + icon;
		// once constructed, push instance into array
		PowerUp.instances.push(this);

		// remove instance from array
		this.kill = () => {
			for (let i = 0; i < PowerUp.instances.length; i++) {
				if (PowerUp.instances[i] === this) {
					PowerUp.instances.splice(i, 1);
				}
			}
		}

		// check if powerup got collected by player
		this.gotCollected = () => {
			if ((this.x + this.w) >= PlayerBoard.instance.x - PlayerBoard.instance.w / 2 && this.x <= (PlayerBoard.instance.x + PlayerBoard.instance.w / 2) && (this.y + this.h) >= PlayerBoard.instance.y && this.y <= (PlayerBoard.instance.y + PlayerBoard.instance.h)) {
				console.log('power up ' + name + ' equipped!');
				PowerUp.equipped = this;
				return true;
			}
		}

		this.draw = () => {		
			if (!this.gotCollected() && this.y < viewport.h) {
				ctx.save();
				this.y += this.vy;
				ctx.drawImage(this.icon, this.x, this.y, this.w, this.h);
				ctx.restore();
			} else {
				// remove from instances array if powerup got collected or fell out of viewport
				this.kill();
			}
		}
	}
}
