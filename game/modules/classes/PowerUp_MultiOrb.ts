import { game } from "../global";
import { Orb } from "./Orb";
import { PowerUp } from "./PowerUp";

export class MultiOrb extends PowerUp {
    id: number;
    activate: () => void;

	constructor(x, y) {
		super(x, y, 'Multi Orb', 'brick_cracked.png');
		this.id = 2;

		this.activate = () => {
			if (!game.activePowerUp || game.activePowerUp.id !== this.id) {
				for (var i = 0; i < 2; i++) {
					game.orbs.push(new Orb(game.playerBoard.x, game.playerBoard.y - 10))
				}
				game.activePowerUp = game.equippedPowerUp;
				game.equippedPowerUp = null;
			}
		}
	}
}
