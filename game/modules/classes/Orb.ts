import { game, viewport, ctx } from "../global";
import { PlayerBoard } from "./PlayerBoard";
import { Grid } from "./Grid";
import { GridSegment } from "./GridSegment";
import { randNum, xorNum, randInt } from "../utilities/functions";
import { 
	OrbPaddle as orbHitsBoard,
	OrbBrick as orbHitsBrick,
	OrbEnters as orbEntersSegment
} from "../utilities/collision";

export class Orb {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    fillColor: string;
    trailLength: number;
	trail: any[];
	fireOrb: boolean;
    enters: (obj: any) => boolean;
    isColliding: () => void;
    drawTrail: () => void;
	draw: () => void;
	kill: () => void;
	collision: (brick: any) => boolean;

	public static instances: Orb[] = [];
	public static render = () => {
		for (let i = 0; i < Orb.instances.length; i++) {
			Orb.instances[i].draw();
		}
	}

	constructor(x: number, y: number) {
		Orb.instances.push(this);
		
		this.x = x;
		this.y = y;
		// this.vx = xorNum([-6, 6]);
		// this.vx = -5;
		this.vx = xorNum([-9, -5, -3, -2, 2, 3, 5, 9]);
		this.vy = 12 - Math.abs(this.vx);
		this.radius = 6;
		this.fillColor = 'rgb(0, 255, 255)';
		this.trailLength = 7;
		this.trail = [];
		this.fireOrb = Orb.instances[0].fireOrb;
		

		// remove instance from instances array
		this.kill = () => {
			for (let i = 0; i < Orb.instances.length; i++) {
				if (Orb.instances[i] === this) {
					Orb.instances.splice(i, 1);
				}
			}

			// check if that was the last orb -> game over ;-)
			if (Orb.instances.length === 0) {
				// GameOver.show();
				// game.over = true;
				// game.misc.texts.gameover = new TextUI('GAME OVER', 'center', viewport.h / 2 + 50, '#fff', '100px Impact', true);
			}
		}

		this.isColliding = () => {
			let segments = GridSegment.instances;
			for (let i = 0; i < segments.length; i++) {
				// segment check
				if (orbEntersSegment(this, segments[i])) {
					if (segments[i].id === segments.length - 1) {
						// if bottom segment -> check for board collision
						if (orbHitsBoard(this, PlayerBoard.instance)) {
							// player board 'push down' animation
							PlayerBoard.instance.springAnim();
						}
					} else {
						// brick collision
						// game.misc.texts.calcs = new TextUI(segments[i].contains.length + "", this.x, this.y - this.radius * 2, '#fff', '20px Arial');
						for (let j = 0; j < segments[i].contains.length; j++) {
							let brick = segments[i].contains[j];
							if (orbHitsBrick(this, brick)) {
								brick.poof();
							}
						}
					}
				}
			}
			
			// wall collision
			if (this.y - this.radius < Grid.instance.y) {this.vy *= -1; this.y = Grid.instance.y + this.radius}// top wall
			if (this.x - this.radius < 0) {this.vx *= -1; this.x = this.radius}// left wall
			if (this.x + this.radius > viewport.w) {this.vx *= -1; this.x = viewport.w - this.radius}// right wall
			if (this.y + this.radius > viewport.h) {this.kill()}// bottom 'wall'
		}

		this.drawTrail = () => {
			ctx.save();
			this.trail.push({x: this.x, y: this.y});
			if (this.trail.length > this.trailLength) this.trail.shift();

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
			if (this.fireOrb) ctx.fillStyle = 'red';
			ctx.shadowBlur = 10;
			ctx.shadowColor = "rgba(0, 255, 255, 0.5)";
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
			ctx.fill();
			ctx.restore();
		}
	}
}
