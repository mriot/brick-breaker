import { game } from "../global";
import { Orb } from "./Orb";
import { PowerUp } from "./PowerUp";
import { PlayerBoard } from "./PlayerBoard";

export class MultiOrb extends PowerUp {
    activate: () => void;

	constructor(x: number, y: number) {
		super(x, y, 'Multi Orb', 'powerup_multiorb.png');

		this.activate = () => {
			new Orb(PlayerBoard.instance.x, PlayerBoard.instance.y - 10);
			new Orb(PlayerBoard.instance.x, PlayerBoard.instance.y - 10);

			PowerUp.equipped = null;
		}
	}
}
