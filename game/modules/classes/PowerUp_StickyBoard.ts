import { game } from "../global";
import { PowerUp } from "./PowerUp";

export class StickyBoard extends PowerUp {
    lifetime: number;
    activate: () => void;

	constructor(x, y) {
		super(x, y, 'Sticky Board', '');
		this.lifetime = 30;

		this.activate = () => {
			game.playerBoard.sticky = true;
			game.equippedPowerUp = null;
			setTimeout(() => {
				game.playerBoard.sticky = false;
			}, this.lifetime * 1000)
		}
	}
}
