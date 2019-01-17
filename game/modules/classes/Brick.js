class Brick {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.w = 60;
		this.h = 40;
		this.hidden = false;
		this.hitsRequired = 1;
		this.texture = new Image(0, 0);
		this.texture.src = 'img/brick.png';

		this.within = segment => {
			if ((this.x + this.w) >= segment.x && this.x <= (segment.x + segment.w) && (this.y + this.h) >= segment.y && this.y <= (segment.y + segment.h)) {
				return true;
			}
		}

		// segment check
		for (let i = 0; i < game.gridSegments.length; i++) {
			if (this.within(game.gridSegments[i])) {
				game.gridSegments[i].contains.push(this);
			}
		}

		this.dropPowerUp = () => {
			if (Math.round(Math.random() * 5) === 1 || false) {
				let num = Math.round(Math.random() * 5);
				num = 0;
				if (num === 0) game.powerUps.push(new XXLBoard(this.x, this.y));
				if (num === 1) game.powerUps.push(new StickyBoard(this.x, this.y));
			}
		}

		this.draw = () => {
			ctx.save();
			// ctx.fillStyle = this.fillColor;
			// ctx.fillRect(this.x, this.y, this.w, this.h);
			ctx.drawImage(this.texture, this.x, this.y, this.w, this.h);
			ctx.fill();
			ctx.restore();
		}
	}
}
