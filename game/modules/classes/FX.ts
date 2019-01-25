import { ctx } from "../global";

export class FX {

    public static instances: FX[] = [];
    x: number;
    y: number;
    dead: boolean;
    drawn: number;
    img: HTMLImageElement;
    effect: any;
    draw: () => void;

    public static render = () => {
        for (let i = 0; i < FX.instances.length; i++) {
            if (FX.instances[i].dead) {
                FX.instances.splice(i, 1);
            } else {
                FX.instances[i].draw();
            }
        }
    }

    constructor(effect: string, x: number, y: number) {
        let fxType = {
            'poof': {
                src: 'img/blackSmoke11.png',
                lifespan: 500,
            }
        }

        this.x = x;
        this.y = x;
        this.effect = fxType[effect];
        this.img = new Image(0, 0);
        this.img.src = this.effect.src;
        this.dead = false;
        this.drawn = 0;
        FX.instances.push(this);

        this.draw = () => {
            ctx.save();
            ctx.drawImage(this.img, this.x, this.y, 100, 100);
            ctx.restore();
            this.drawn++;
            if (this.drawn >= 60 / (1000 / this.effect.lifespan)) this.dead = true;
        }
    }
}