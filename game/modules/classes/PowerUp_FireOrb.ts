import { PowerUp } from "./PowerUp";
import { Orb } from "./Orb";
import { PowerUpUI } from "./PowerUpUI";

export class FireOrb extends PowerUp {
    lifetime: number;

    constructor(x: number, y: number) {
        super(x, y, 'FireOrb', 'powerup_fireorb.png');
        this.lifetime = 7;

        this.activate = () => {
            if (PowerUpUI.instance.initLifetime <= 0) {
                Orb.instances.forEach(orb => {
                    orb.fireOrb = true;
                });

                PowerUp.active = PowerUp.equipped;
                PowerUp.equipped = null;
                PowerUpUI.instance.timer(this.lifetime);

                setTimeout(() => {
                    Orb.instances.forEach(orb => {
                        orb.fireOrb = false;
                    });
                    PowerUp.active = null;
                }, this.lifetime * 1000)
            }
        }
    }
}