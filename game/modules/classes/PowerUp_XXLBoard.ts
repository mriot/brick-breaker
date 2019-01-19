import { game } from "../global";
import { PowerUp } from "./PowerUp";

export class XXLBoard extends PowerUp {
    lifetime: number;
    id: number;
    activate: () => void;

	constructor(x, y) {
		super(x, y, 'XXL Board', 'expand.png');
		this.lifetime = 15;// seconds
		this.id = 1;

		this.activate = () => {
			if (!game.activePowerUp || game.activePowerUp.id !== this.id) {
				game.playerBoard.w *= 2;

				game.activePowerUp = game.equippedPowerUp;
				game.equippedPowerUp = null;

				game.UIs.powerUpUI.timer(this.lifetime);
				// game.UIs.powerUpUI.icon(this.icon);

				setTimeout(() => {
					game.playerBoard.w /= 2;
					game.activePowerUp = null;
				}, this.lifetime * 1000)
			}
		}
	}
}
