import { game } from "../global";
import { PowerUp } from "./PowerUp";
import { PowerUpUI } from "./PowerUpUI";
import { PlayerBoard } from "./PlayerBoard";

export class XXLBoard extends PowerUp {
    lifetime: number;
    activate: () => void;

	constructor(x: number, y: number) {
		super(x, y, 'XXL Board', 'powerup_xxlboard.png');
		this.lifetime = 15;// seconds

		this.activate = () => {
			if (!PowerUp.active) {
				PlayerBoard.instance.w *= 2;

				PowerUp.active = PowerUp.equipped;
				PowerUp.equipped = null;

				PowerUpUI.instance.timer(this.lifetime);
				// game.UIs.powerUpUI.icon(this.icon);

				setTimeout(() => {
					PlayerBoard.instance.w /= 2;
					PowerUp.active = null;
				}, this.lifetime * 1000)
			}
		}
	}
}
