class PlayerBoard {
	constructor() {
		this.x = viewport.w / 2;
		this.y = viewport.h - 25;
		this.vx = 15;
		this.vy = 5;
		this.w = viewport.w / 100 * 10;
		this.h = 7;
		this.sticky = false;
		this.fillColor = '#fff';

		this.moveLeft = () => {
			if(this.x - this.w / 2 > 0) this.x -= this.vx
		}

		this.moveRight = () => {
			if(this.x + this.w / 2 < viewport.w) this.x += this.vx
		}

		this.draw = () => {
			ctx.save();
			ctx.fillStyle = this.fillColor;
			ctx.shadowBlur = 20;
			ctx.shadowColor = "cyan";
			ctx.fillRect(this.x - this.w / 2, this.y, this.w, this.h);
			ctx.fill();
			ctx.restore();

			// ctx.font = "14px Arial";
			// ctx.fillText('x:'+this.x.toFixed(0)+' y:'+this.y.toFixed(0), this.x + this.w / 2 + 10, this.y);
		}
	}
}
