class Orb {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.vx = Math.floor(Math.random() * 5 + 3);
		this.vy = 1;
		this.radius = 6;
		this.fillColor = 'cyan';
		this.maxTrailLength = 5;
		this.trail = [];

		this.hits = (obj) => {
			return (this.x + this.radius) >= obj.x && this.x + this.radius <= (obj.x + obj.w + this.radius * 2) && (this.y + this.radius) >= obj.y && this.y + this.radius <= (obj.y + obj.h + this.radius * 2);
		}

		this.isColliding = () => {
			if (this.y - this.radius <= game.brickArea.y) this.vy *= -1;// top
			let segments = game.gridSegments;
			for (let i = 0; i < segments.length; i++) {
				if (this.hits(segments[i])) {
					segments[i].color = 'rgb(0, 255, 0)';
					for (let j = 0; j < segments[i].contains.length; j++) {
						// segments[i].contains[j].fillColor = 'dodgerblue';
						if (!segments[i].contains[j].hidden && this.hits(segments[i].contains[j])) {
							// segments[i].contains[j].fillColor = 'red';
							segments[i].contains[j].hidden = true;
							segments[i].contains[j].dropPowerUp();
							this.vy *= -1;
						}
					}
				} else {
					segments[i].color = 'rgba(0, 255, 255, 0.5)';
				}
			}

			// check for collisions if outside brick area
			if (this.x - this.radius <= 0) this.vx *= -1;// left wall
			if (this.x + this.radius >= viewport.w) this.vx *= -1;// right wall

			let distX = (this.x + this.radius) - (game.playerBoard.x - game.playerBoard.w / 2);
			let distY = (this.y + this.radius) - game.playerBoard.y;
			if ((distX >= 0 && distX <= game.playerBoard.w + this.radius * 2) && (distY >= 0 && distY <= game.playerBoard.h + this.radius * 2)) {
				if (game.playerBoard.sticky) {
					this.vy = 0;
					this.vx = 0;
				} else {
					this.vy = Math.floor(Math.random() * 5 + 5) * -1;
					// this.vx = Math.floor(Math.random() * 5 + 5) * -1;
				}
			}
		}

		this.drawTrail = () => {
			this.trail.push({x: this.x, y: this.y});
			if (this.trail.length > this.maxTrailLength) this.trail.shift();

			let radius = this.radius - 2;
			let opacity = 0.1;
			for (let i = 0; i < this.trail.length; i++) {
				ctx.fillStyle = 'rgba(0, 255, 255, '+opacity+')';
				ctx.beginPath();
				ctx.arc(this.trail[i].x, this.trail[i].y, radius, 0, Math.PI * 2, false);
				ctx.fill();
				radius += 0.5;
				opacity += 0.1;
			}
		}

		this.draw = () => {
			ctx.save();
			ctx.beginPath();
			ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
			ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
			ctx.fill();

			this.drawTrail();
			// ctx.font = "14px Arial";
			// ctx.fillText('x:'+this.x.toFixed(0)+' y:'+this.y.toFixed(0), this.x + this.radius + 10, this.y);
			ctx.restore();
		}
	}
}
