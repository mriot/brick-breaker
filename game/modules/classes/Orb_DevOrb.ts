import { Orb } from "./Orb";
import { viewport } from "../global";

export class DevOrb extends Orb {
    vx: number;
    vy: number;
    x: any;
	y: any;

	constructor() {
		super(viewport.w, viewport.y - 10);
		this.vx = 0;
		this.vy = 0;
		this.fillColor = 'red';

		Orb.instances.push(this);

		document.addEventListener('mousemove', e => {
			this.x = e.pageX;
			this.y = e.pageY;
		})
	}
}
