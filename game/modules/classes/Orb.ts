import { game, viewport, ctx } from "../global";
import { PlayerBoard } from "./PlayerBoard";
import { BrickArea } from "./BrickArea";
import { GridSegment } from "./GridSegment";

export class Orb {
    x: number;
    y: number;
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
	kill: () => void;

	public static instances: Orb[] = [];
	public static render = () => {
		for (let i = 0; i < Orb.instances.length; i++) {
			Orb.instances[i].draw();
		}
	}

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
		this.vx = Math.floor(Math.random() * 5 + 3);
		this.vy = 5;
		this.radius = 6;
		this.fillColor = 'rgb(0, 255, 255)';
		this.maxTrailLength = 7;
		this.trail = [];
		// once constructed, push instance into array
		Orb.instances.push(this);

		// remove instance from array
		this.kill = () => {
			for (let i = 0; i < Orb.instances.length; i++) {
				if (Orb.instances[i] === this) {
					Orb.instances.splice(i, 1);
				}
			}
			if (Orb.instances.length === 0) {
				console.log("GAME OVER");
			}
		}

		this.hits = (obj) => {
			return (this.x + this.radius) >= obj.x && this.x + this.radius <= (obj.x + obj.w + this.radius * 2) && (this.y + this.radius) >= obj.y && this.y + this.radius <= (obj.y + obj.h + this.radius * 2);
		}

		this.isColliding = () => {
			let segments = GridSegment.instances;
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
			if (this.y - this.radius < BrickArea.instance.y) {this.vy *= -1; this.y = BrickArea.instance.y + this.radius}// top wall
			if (this.x - this.radius < 0) {this.vx *= -1; this.x = this.radius}// left wall
			if (this.x + this.radius > viewport.w) {this.vx *= -1; this.x = viewport.w - this.radius}// right wall
			if (this.y + this.radius > viewport.h) {this.kill()}// bottom 'wall'

			// board collision
			let distX = (this.x + this.radius) - (PlayerBoard.instance.x - PlayerBoard.instance.w / 2);
			let distY = (this.y + this.radius) - PlayerBoard.instance.y;
			if ((distX >= 0 && distX <= PlayerBoard.instance.w + this.radius * 2) && (distY >= 0 && distY <= PlayerBoard.instance.h + this.radius * 2)) {
				if (PlayerBoard.instance.sticky) {
					this.vy = 0;
					this.vx = 0;
				} else {
					this.vy *= -1;
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
			if (game.running) {
				this.isColliding();
				this.x += this.vx;
				this.y += this.vy;
				this.drawTrail();
			} else {
				// stick orb to player board until game is running
				this.x = PlayerBoard.instance.x;
				this.y = PlayerBoard.instance.y - 10;
			}
			ctx.fillStyle = this.fillColor;
			ctx.shadowBlur = 10;
			ctx.shadowColor = "rgba(0, 255, 255, 0.5)";
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
			ctx.fill();
			ctx.restore();
		}
	}
}
