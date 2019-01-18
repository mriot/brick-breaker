class DevOrb extends Orb {
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
