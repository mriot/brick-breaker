import { Orb } from "./Orb";

export class DevOrb extends Orb {
    vx: number;
    vy: number;
    x: any;
    y: any;
    move: (event: any) => void;

	constructor() {
		super(500, 500);
		this.vx = 0;
		this.vy = 0;

		this.move = event => {
			this.x = event.pageX;
			this.y = event.pageY;
		}
	}
}
