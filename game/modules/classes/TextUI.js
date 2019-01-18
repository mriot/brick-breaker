class TextUI {
	constructor(text, x, y, color = '#fff', font = '16px Arial') {
		this.text = text;
		this.x = x;
		this.y = y;
		this.font = font;
		this.fillStyle = color;
		this.pulseInc = false;
		this.alpha = 1;

		this.pulse = () => {
			if (this.pulseInc) {
				if (this.alpha >= 0.8) this.pulseInc = false;
				this.alpha += 0.01;
			} else {
				if (this.alpha <= 0.1) this.pulseInc = true;
				this.alpha -= 0.01;
			}
			this.draw();
		}

		this.draw = () => {
			ctx.save();
			ctx.font = this.font;
			ctx.globalAlpha = this.alpha;
			ctx.fillStyle = this.fillStyle;
			if (this.x == 'center') this.x = viewport.w / 2 - ctx.measureText(this.text).width / 2;
			if (this.y == 'center') this.y = viewport.h / 2 + 10;
			ctx.fillText(this.text, this.x, this.y);
			ctx.restore();
		}
	}
}
