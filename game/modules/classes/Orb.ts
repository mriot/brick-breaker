import { game, viewport, ctx } from "../global";

export class Orb {
    x: any;
    y: any;
    vx: number;
    vy: number;
    radius: number;
    fillColor: string;
    maxTrailLength: number;
    trail: any[];
    hits: (obj: any) => boolean;
    isColliding: () => void;
    drawTrail: () => void;
    draw: () => void;

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
			let segments = game.gridSegments;
			for (let i = 0; i < segments.length; i++) {
				if (this.hits(segments[i])) {
					for (let j = 0; j < segments[i].contains.length; j++) {
						let brick = segments[i].contains[j];
						if (!brick.hidden && this.hits(brick)) {
							brick.hidden = true;
							brick.dropPowerUp();
							this.vy *= -1;
						}
					}
				}
			}

			// wall collision
			if (this.y - this.radius < game.brickArea.y) {this.vy *= -1; this.y = game.brickArea.y + this.radius}// top
			if (this.x - this.radius < 0) {this.vx *= -1; this.x = this.radius}// left wall
			if (this.x + this.radius > viewport.w) {this.vx *= -1; this.x = viewport.w - this.radius;}// right wall

			// board collision
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
			ctx.save();
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
			ctx.restore();
		}

		this.draw = () => {
			ctx.save();
			ctx.fillStyle = this.fillColor;
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
			ctx.fill();
			ctx.restore();
		}
	}
}
