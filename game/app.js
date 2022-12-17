(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const global_1 = require("../global");
const PowerUp_MultiOrb_1 = require("./PowerUp_MultiOrb");
const PowerUp_XXLBoard_1 = require("./PowerUp_XXLBoard");
const GridSegment_1 = require("./GridSegment");
const PowerUp_FireOrb_1 = require("./PowerUp_FireOrb");
class Brick {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 60;
        this.h = 40;
        this.inside = [];
        this.destroyed = false;
        this.hitsRequired = 1;
        this.texture = new Image(0, 0);
        this.texture.src = 'img/brick.png';
        Brick.instances.push(this);
        // segment assignment
        for (let i = 0; i < GridSegment_1.GridSegment.instances.length; i++) {
            let seg = GridSegment_1.GridSegment.instances[i];
            if (this.x + this.w >= seg.x && this.x <= seg.x + seg.w && this.y + this.h >= seg.y && this.y <= seg.y + seg.h) {
                GridSegment_1.GridSegment.instances[i].contains.push(this);
                this.inside.push(GridSegment_1.GridSegment.instances[i]);
            }
        }
        this.dropPowerUp = () => {
            if (Math.round(Math.random() * 6) === 1 || false) {
                switch (Math.floor(Math.random() * 3)) {
                    case 0:
                        new PowerUp_MultiOrb_1.MultiOrb(this.x, this.y);
                        break;
                    case 1:
                        new PowerUp_XXLBoard_1.XXLBoard(this.x, this.y);
                        break;
                    case 2:
                        new PowerUp_FireOrb_1.FireOrb(this.x, this.y);
                        break;
                    default:
                        console.warn('Brick.ts : dropPowerUp() : Out of range!');
                }
            }
        };
        this.poof = () => {
            this.destroyed = true;
            // remove brick from segments
            this.inside.forEach(seg => {
                for (let i = 0; i < seg.contains.length; i++) {
                    if (seg.contains[i].destroyed)
                        seg.contains.splice(i, 1);
                }
            });
            this.dropPowerUp();
            // new FX('poof', this.x, this.y);
        };
        this.draw = () => {
            global_1.ctx.save();
            // ctx.strokeStyle = '#fff';
            // ctx.strokeRect(this.x, this.y, this.w, this.h);
            global_1.ctx.drawImage(this.texture, this.x, this.y, this.w, this.h);
            global_1.ctx.restore();
        };
    }
}
Brick.instances = [];
Brick.render = () => {
    for (let i = 0; i < Brick.instances.length; i++) {
        if (!Brick.instances[i].destroyed) {
            Brick.instances[i].draw();
        }
    }
};
exports.Brick = Brick;

},{"../global":14,"./GridSegment":3,"./PowerUp_FireOrb":9,"./PowerUp_MultiOrb":10,"./PowerUp_XXLBoard":11}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const global_1 = require("../global");
const GridSegment_1 = require("./GridSegment");
class Grid {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        Grid.instance = this;
        // generate grid segments
        let offsetX = this.x;
        let offsetY = this.y;
        let col = 1;
        let maxRows = 4;
        let colsPerRow = 5;
        // generate grid
        for (let i = 0; i < colsPerRow * maxRows; i++) {
            new GridSegment_1.GridSegment(offsetX, offsetY, this.w / colsPerRow, this.h / colsPerRow, i);
            offsetX += this.w / colsPerRow;
            if (col === colsPerRow) {
                offsetX = this.x;
                offsetY += this.h / colsPerRow;
                col = 0;
            }
            col++;
        }
        // bottom segment
        new GridSegment_1.GridSegment(this.x, offsetY, this.w, this.h / colsPerRow, 20);
        this.draw = () => {
            global_1.ctx.save();
            global_1.ctx.fillStyle = "rgba(0, 255, 0, 0.1)";
            global_1.ctx.fillRect(this.x, this.y, this.w, this.h);
            global_1.ctx.fill();
            global_1.ctx.restore();
            GridSegment_1.GridSegment.render();
            // RULER
            global_1.ctx.save();
            global_1.ctx.strokeStyle = 'darkred';
            // vertical
            global_1.ctx.beginPath();
            global_1.ctx.moveTo(global_1.viewport.w / 2, 0);
            global_1.ctx.lineTo(global_1.viewport.w / 2, global_1.viewport.h);
            global_1.ctx.stroke();
            // horizontal
            global_1.ctx.beginPath();
            global_1.ctx.moveTo(0, global_1.viewport.h / 2);
            global_1.ctx.lineTo(global_1.viewport.w, global_1.viewport.h / 2);
            global_1.ctx.stroke();
            global_1.ctx.restore();
        };
    }
}
Grid.instance = null;
Grid.render = () => {
    Grid.instance.draw();
};
exports.Grid = Grid;

},{"../global":14,"./GridSegment":3}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const global_1 = require("../global");
class GridSegment {
    constructor(x, y, w, h, id) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.id = id;
        this.contains = []; // bricks
        GridSegment.instances.push(this);
        this.draw = () => {
            global_1.ctx.save();
            global_1.ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
            global_1.ctx.strokeRect(this.x, this.y, this.w, this.h);
            global_1.ctx.font = '20px Arial';
            global_1.ctx.fillStyle = '#000';
            global_1.ctx.fillText(this.id, this.x + this.w / 2 - 10, this.y + this.h / 1.8);
            global_1.ctx.restore();
        };
    }
}
GridSegment.instances = [];
GridSegment.render = () => {
    for (let i = 0; i < GridSegment.instances.length; i++) {
        GridSegment.instances[i].draw();
    }
};
exports.GridSegment = GridSegment;

},{"../global":14}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const global_1 = require("../global");
const PlayerBoard_1 = require("./PlayerBoard");
const Grid_1 = require("./Grid");
const GridSegment_1 = require("./GridSegment");
const functions_1 = require("../utilities/functions");
const collision_1 = require("../utilities/collision");
class Orb {
    constructor(x, y) {
        Orb.instances.push(this);
        this.x = x;
        this.y = y;
        // this.vx = xorNum([-6, 6]);
        // this.vx = -5;
        this.vx = functions_1.xorNum([-9, -5, -3, -2, 2, 3, 5, 9]);
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
        };
        this.isColliding = () => {
            let segments = GridSegment_1.GridSegment.instances;
            for (let i = 0; i < segments.length; i++) {
                // segment check
                if (collision_1.OrbEnters(this, segments[i])) {
                    if (segments[i].id === segments.length - 1) {
                        // if bottom segment -> check for board collision
                        if (collision_1.OrbPaddle(this, PlayerBoard_1.PlayerBoard.instance)) {
                            // player board 'push down' animation
                            PlayerBoard_1.PlayerBoard.instance.springAnim();
                        }
                    }
                    else {
                        // brick collision
                        // game.misc.texts.calcs = new TextUI(segments[i].contains.length + "", this.x, this.y - this.radius * 2, '#fff', '20px Arial');
                        for (let j = 0; j < segments[i].contains.length; j++) {
                            let brick = segments[i].contains[j];
                            if (collision_1.OrbBrick(this, brick)) {
                                brick.poof();
                            }
                        }
                    }
                }
            }
            // wall collision
            if (this.y - this.radius < Grid_1.Grid.instance.y) {
                this.vy *= -1;
                this.y = Grid_1.Grid.instance.y + this.radius;
            } // top wall
            if (this.x - this.radius < 0) {
                this.vx *= -1;
                this.x = this.radius;
            } // left wall
            if (this.x + this.radius > global_1.viewport.w) {
                this.vx *= -1;
                this.x = global_1.viewport.w - this.radius;
            } // right wall
            if (this.y + this.radius > global_1.viewport.h) {
                this.kill();
            } // bottom 'wall'
        };
        this.drawTrail = () => {
            global_1.ctx.save();
            this.trail.push({ x: this.x, y: this.y });
            if (this.trail.length > this.trailLength)
                this.trail.shift();
            let radius = this.radius - 2;
            let opacity = 0.1;
            for (let i = 0; i < this.trail.length; i++) {
                global_1.ctx.fillStyle = 'rgba(0, 255, 255, ' + opacity + ')';
                global_1.ctx.beginPath();
                global_1.ctx.arc(this.trail[i].x, this.trail[i].y, radius, 0, Math.PI * 2, false);
                global_1.ctx.fill();
                radius += 0.5;
                opacity += 0.1;
            }
            global_1.ctx.restore();
        };
        this.draw = () => {
            global_1.ctx.save();
            if (global_1.game.running) {
                this.isColliding();
                this.x += this.vx;
                this.y += this.vy;
                this.drawTrail();
            }
            else {
                // stick orb to player board until game is running
                this.x = PlayerBoard_1.PlayerBoard.instance.x;
                this.y = PlayerBoard_1.PlayerBoard.instance.y - 10;
            }
            global_1.ctx.fillStyle = this.fillColor;
            if (this.fireOrb)
                global_1.ctx.fillStyle = 'red';
            global_1.ctx.shadowBlur = 10;
            global_1.ctx.shadowColor = "rgba(0, 255, 255, 0.5)";
            global_1.ctx.beginPath();
            global_1.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            global_1.ctx.fill();
            global_1.ctx.restore();
        };
    }
}
Orb.instances = [];
Orb.render = () => {
    for (let i = 0; i < Orb.instances.length; i++) {
        Orb.instances[i].draw();
    }
};
exports.Orb = Orb;

},{"../global":14,"../utilities/collision":17,"../utilities/functions":18,"./Grid":2,"./GridSegment":3,"./PlayerBoard":6}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Orb_1 = require("./Orb");
const global_1 = require("../global");
class DevOrb extends Orb_1.Orb {
    constructor() {
        super(global_1.viewport.w, global_1.viewport.y - 10);
        this.vx = 0;
        this.vy = 0;
        this.fillColor = 'red';
        Orb_1.Orb.instances.push(this);
        document.addEventListener('mousemove', e => {
            this.x = e.pageX;
            this.y = e.pageY;
        });
    }
}
exports.DevOrb = DevOrb;

},{"../global":14,"./Orb":4}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const global_1 = require("../global");
class PlayerBoard {
    constructor() {
        this.x = global_1.viewport.w / 2;
        this.y = global_1.viewport.h - 25;
        this.vx = 15;
        this.vy = 5;
        this.w = global_1.viewport.w / 100 * 10;
        this.h = 7;
        this.sticky = false;
        this.fillColor = '#fff';
        this.texture = new Image(0, 0);
        this.texture.src = 'img/paddle2.png';
        PlayerBoard.instance = this;
        this.moveLeft = () => { if (this.x - this.w / 2 > 0)
            this.x -= this.vx; };
        this.moveRight = () => { if (this.x + this.w / 2 < global_1.viewport.w)
            this.x += this.vx; };
        this.springAnim = () => {
            this.y += 3;
            setTimeout(() => this.y -= 3, 70);
        };
        this.draw = () => {
            if (PlayerBoard.controls.left)
                this.moveLeft();
            if (PlayerBoard.controls.right)
                this.moveRight();
            global_1.ctx.save();
            global_1.ctx.fillStyle = this.fillColor;
            global_1.ctx.shadowBlur = 10;
            global_1.ctx.shadowColor = "rgba(255, 255, 255, 0.1)";
            global_1.ctx.drawImage(this.texture, this.x - this.w / 2, this.y, this.w, this.h);
            global_1.ctx.restore();
        };
    }
}
PlayerBoard.controls = { left: false, right: false };
PlayerBoard.instance = null;
PlayerBoard.render = () => {
    PlayerBoard.instance.draw();
};
exports.PlayerBoard = PlayerBoard;

},{"../global":14}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const global_1 = require("../global");
const PlayerBoard_1 = require("./PlayerBoard");
const PowerUpUI_1 = require("./PowerUpUI");
class PowerUp {
    constructor(x, y, name, icon) {
        this.x = x;
        this.y = y;
        this.vy = 5;
        this.icon = new Image(0, 0);
        this.icon.src = 'img/' + icon;
        this.w = this.icon.naturalWidth;
        this.h = this.icon.naturalHeight;
        // once constructed, push instance into array
        PowerUp.instances.push(this);
        // remove instance from array
        this.kill = () => {
            for (let i = 0; i < PowerUp.instances.length; i++) {
                if (PowerUp.instances[i] === this) {
                    PowerUp.instances.splice(i, 1);
                }
            }
        };
        // check if powerup got collected by player
        this.gotCollected = () => {
            if ((this.x + this.w) >= PlayerBoard_1.PlayerBoard.instance.x - PlayerBoard_1.PlayerBoard.instance.w / 2 && this.x <= (PlayerBoard_1.PlayerBoard.instance.x + PlayerBoard_1.PlayerBoard.instance.w / 2) && (this.y + this.h) >= PlayerBoard_1.PlayerBoard.instance.y && this.y <= (PlayerBoard_1.PlayerBoard.instance.y + PlayerBoard_1.PlayerBoard.instance.h)) {
                console.log('power up ' + name + ' equipped!');
                PowerUp.equipped = this;
                PowerUpUI_1.PowerUpUI.instance.icon = this.icon;
                return true;
            }
        };
        this.draw = () => {
            if (!this.gotCollected() && this.y <= global_1.viewport.h) {
                global_1.ctx.save();
                this.y += this.vy;
                global_1.ctx.drawImage(this.icon, this.x, this.y, this.w, this.h);
                global_1.ctx.restore();
            }
            else {
                // remove from instances array if powerup got collected or fell out of viewport
                this.kill();
            }
        };
    }
}
PowerUp.equipped = null;
PowerUp.active = null;
PowerUp.instances = []; // contains all powerups on screen
// render all powerups on screen
PowerUp.render = () => {
    for (let i = 0; i < PowerUp.instances.length; i++) {
        PowerUp.instances[i].draw();
    }
};
exports.PowerUp = PowerUp;

},{"../global":14,"./PlayerBoard":6,"./PowerUpUI":8}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const global_1 = require("../global");
const PowerUp_1 = require("./PowerUp");
class PowerUpUI {
    constructor() {
        this.x = global_1.viewport.w - 40;
        this.y = 0;
        this.w = global_1.viewport.w;
        this.h = 5;
        this.powerUpLifetime = 0;
        this.initLifetime = 0;
        this.icon = new Image(0, 0);
        PowerUpUI.instance = this;
        this.timer = lifetime => {
            this.powerUpLifetime = this.initLifetime = lifetime;
            let timer = setInterval(() => {
                this.powerUpLifetime -= 0.016;
                if (this.powerUpLifetime <= 0)
                    clearInterval(timer);
            }, 1000 / 60);
        };
        this.draw = () => {
            global_1.ctx.save();
            if (PowerUp_1.PowerUp.equipped) {
                global_1.ctx.drawImage(this.icon, 0, global_1.viewport.h - this.icon.naturalHeight);
            }
            if (this.powerUpLifetime > 0) {
                let fill = this.w / this.initLifetime * this.powerUpLifetime;
                global_1.ctx.shadowBlur = 15;
                global_1.ctx.shadowColor = '#000';
                global_1.ctx.fillStyle = 'darkred';
                global_1.ctx.fillRect(global_1.viewport.w / 2 - fill / 2, global_1.viewport.h - this.h, fill, this.h);
            }
            global_1.ctx.restore();
        };
    }
}
PowerUpUI.instance = null;
PowerUpUI.render = () => {
    PowerUpUI.instance.draw();
};
exports.PowerUpUI = PowerUpUI;

},{"../global":14,"./PowerUp":7}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PowerUp_1 = require("./PowerUp");
const Orb_1 = require("./Orb");
const PowerUpUI_1 = require("./PowerUpUI");
class FireOrb extends PowerUp_1.PowerUp {
    constructor(x, y) {
        super(x, y, 'FireOrb', 'powerup_fireorb.png');
        this.lifetime = 7;
        this.activate = () => {
            if (PowerUpUI_1.PowerUpUI.instance.initLifetime <= 0) {
                Orb_1.Orb.instances.forEach(orb => {
                    orb.fireOrb = true;
                });
                PowerUp_1.PowerUp.active = PowerUp_1.PowerUp.equipped;
                PowerUp_1.PowerUp.equipped = null;
                PowerUpUI_1.PowerUpUI.instance.timer(this.lifetime);
                setTimeout(() => {
                    Orb_1.Orb.instances.forEach(orb => {
                        orb.fireOrb = false;
                    });
                    PowerUp_1.PowerUp.active = null;
                }, this.lifetime * 1000);
            }
        };
    }
}
exports.FireOrb = FireOrb;

},{"./Orb":4,"./PowerUp":7,"./PowerUpUI":8}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Orb_1 = require("./Orb");
const PowerUp_1 = require("./PowerUp");
const PlayerBoard_1 = require("./PlayerBoard");
class MultiOrb extends PowerUp_1.PowerUp {
    constructor(x, y) {
        super(x, y, 'Multi Orb', 'powerup_multiorb.png');
        this.activate = () => {
            new Orb_1.Orb(PlayerBoard_1.PlayerBoard.instance.x, PlayerBoard_1.PlayerBoard.instance.y - 10);
            new Orb_1.Orb(PlayerBoard_1.PlayerBoard.instance.x, PlayerBoard_1.PlayerBoard.instance.y - 10);
            PowerUp_1.PowerUp.equipped = null;
        };
    }
}
exports.MultiOrb = MultiOrb;

},{"./Orb":4,"./PlayerBoard":6,"./PowerUp":7}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PowerUp_1 = require("./PowerUp");
const PowerUpUI_1 = require("./PowerUpUI");
const PlayerBoard_1 = require("./PlayerBoard");
class XXLBoard extends PowerUp_1.PowerUp {
    constructor(x, y) {
        super(x, y, 'XXL Board', 'powerup_xxlboard.png');
        this.lifetime = 15; // seconds
        this.activate = () => {
            if (!PowerUp_1.PowerUp.active) {
                PlayerBoard_1.PlayerBoard.instance.w *= 2;
                PowerUp_1.PowerUp.active = PowerUp_1.PowerUp.equipped;
                PowerUp_1.PowerUp.equipped = null;
                PowerUpUI_1.PowerUpUI.instance.timer(this.lifetime);
                setTimeout(() => {
                    PlayerBoard_1.PlayerBoard.instance.w /= 2;
                    PowerUp_1.PowerUp.active = null;
                }, this.lifetime * 1000);
            }
        };
    }
}
exports.XXLBoard = XXLBoard;

},{"./PlayerBoard":6,"./PowerUp":7,"./PowerUpUI":8}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const global_1 = require("../global");
class StatsUI {
    constructor() {
        this.w = global_1.viewport.w / 100 * 25;
        this.h = 30;
        this.level = 0;
        StatsUI.instance = this;
        this.draw = () => {
            global_1.ctx.save();
            // container
            global_1.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            global_1.ctx.fillRect(0, 0, global_1.viewport.w, this.h + 10);
            // level
            global_1.ctx.fillStyle = '#aaa';
            global_1.ctx.font = "16px Arial";
            global_1.ctx.fillText(`LEVEL ${this.level}`, 10, this.h - 5);
            // fps
            global_1.ctx.font = '16px Arial';
            let fps = `${global_1.game.fps.toFixed(0)} FPS`;
            global_1.ctx.fillText(fps, global_1.viewport.w - global_1.ctx.measureText(fps).width - 10, this.h - 5);
            global_1.ctx.restore();
        };
    }
}
StatsUI.instance = null;
StatsUI.render = () => {
    StatsUI.instance.draw();
};
exports.StatsUI = StatsUI;

},{"../global":14}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const global_1 = require("../global");
class TextUI {
    constructor(text, x, y, color = '#fff', font = '16px Arial', backdrop = false) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.font = font;
        this.fillStyle = color;
        this.pulseInc = false;
        this.backdrop = backdrop;
        this.alpha = 1;
        this.pulse = () => {
            if (this.pulseInc) {
                if (this.alpha >= 0.8)
                    this.pulseInc = false;
                this.alpha += 0.01;
            }
            else {
                if (this.alpha <= 0.1)
                    this.pulseInc = true;
                this.alpha -= 0.01;
            }
            this.draw();
        };
        this.draw = () => {
            global_1.ctx.save();
            global_1.ctx.font = this.font;
            if (this.backdrop) {
                global_1.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
                global_1.ctx.fillRect(0, 0, global_1.viewport.w, global_1.viewport.h);
            }
            global_1.ctx.globalAlpha = this.alpha;
            global_1.ctx.fillStyle = this.fillStyle;
            if (this.x == 'center')
                this.x = global_1.viewport.w / 2 - global_1.ctx.measureText(this.text).width / 2;
            if (this.y == 'center')
                this.y = global_1.viewport.h / 2 + 10;
            global_1.ctx.fillText(this.text, this.x, this.y);
            global_1.ctx.restore();
        };
    }
}
exports.TextUI = TextUI;

},{"../global":14}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canvas = document.querySelector('#canvas');
exports.ctx = exports.canvas.getContext('2d');
exports.viewport = {
    w: window.innerWidth < 1000 ? 1000 : window.innerWidth,
    h: window.innerHeight < 600 ? 600 : window.innerHeight,
};
exports.game = {
    running: true,
    fps: 0,
    lastFrameRendered: 0,
    frameCounter: 0,
    misc: {
        texts: {},
        background: null
    }
};

},{}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const global_1 = require("../global");
const Brick_1 = require("../classes/Brick");
const Grid_1 = require("../classes/Grid");
const StatsUI_1 = require("../classes/StatsUI");
exports.level_1 = () => {
    StatsUI_1.StatsUI.instance.level = 1;
    let rowCount = 0, offsetX = 0;
    let center = blocksPerRow => {
        return ((blocksPerRow * 60) - global_1.viewport.w) / 2 * -1;
    };
    const createRow = blocksPerRow => {
        for (var i = 0; i < blocksPerRow; i++) {
            offsetX = (i * 60) + center(blocksPerRow);
            new Brick_1.Brick(offsetX, Grid_1.Grid.instance.y + (rowCount * 43));
        }
        rowCount++;
    };
    createRow(17);
    createRow(10);
    createRow(15);
    createRow(2);
    createRow(11);
    createRow(4);
    createRow(1);
    createRow(3);
    createRow(7);
};

},{"../classes/Brick":1,"../classes/Grid":2,"../classes/StatsUI":12,"../global":14}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const global_1 = require("./global");
const TextUI_1 = require("./classes/TextUI");
const Grid_1 = require("./classes/Grid");
const StatsUI_1 = require("./classes/StatsUI");
const PowerUpUI_1 = require("./classes/PowerUpUI");
const PlayerBoard_1 = require("./classes/PlayerBoard");
const Orb_1 = require("./classes/Orb");
const level_1_1 = require("./level/level-1");
const PowerUp_1 = require("./classes/PowerUp");
const Brick_1 = require("./classes/Brick");
const Orb_DevOrb_1 = require("./classes/Orb_DevOrb");
// INIT GAME ============================================================
document.addEventListener('DOMContentLoaded', () => init());
const init = () => {
    // keyCodes: 65 = A // 68 = D // 87 = W // 83 = S // 96 = E // 32 = SPACE
    document.addEventListener('keydown', e => {
        // console.log(e.keyCode);
        // spacebar to launch orb from board (and start the game)
        if (e.keyCode === 32 && !global_1.game.running) {
            global_1.game.running = true;
        }
        // E
        if (e.keyCode === 69 && global_1.game.running && PowerUp_1.PowerUp.equipped) {
            PowerUp_1.PowerUp.equipped.activate();
        }
        // D
        if (e.keyCode === 68) {
            PlayerBoard_1.PlayerBoard.controls.right = true;
            PlayerBoard_1.PlayerBoard.controls.left = false;
        }
        // A
        if (e.keyCode === 65) {
            PlayerBoard_1.PlayerBoard.controls.left = true;
            PlayerBoard_1.PlayerBoard.controls.right = false;
        }
    });
    document.addEventListener('keyup', e => {
        if (e.keyCode === 65)
            PlayerBoard_1.PlayerBoard.controls.left = false;
        if (e.keyCode === 68)
            PlayerBoard_1.PlayerBoard.controls.right = false;
    });
    // canvas dimensions
    global_1.canvas.width = global_1.viewport.w;
    global_1.canvas.height = global_1.viewport.h;
    // background image
    global_1.game.misc.background = new Image(0, 0);
    global_1.game.misc.background.src = 'img/background.png';
    // game-start text
    global_1.game.misc.texts.startGame = new TextUI_1.TextUI('Press [SPACE] to start', 'center', global_1.viewport.h - 200, '#fff', '60px Impact');
    global_1.game.misc.texts.moveLeft = new TextUI_1.TextUI('<< A', global_1.viewport.w / 2 - 200, global_1.viewport.h - 35, '#fff', '40px Impact');
    global_1.game.misc.texts.moveRight = new TextUI_1.TextUI('D >>', global_1.viewport.w / 2 + 125, global_1.viewport.h - 35, '#fff', '40px Impact');
    global_1.game.misc.texts.usePowerUp = new TextUI_1.TextUI('E = PowerUp', 'center', global_1.viewport.h - 75, '#fff', '30px Impact');
    // game setup
    new Grid_1.Grid(0, 45, global_1.viewport.w, global_1.viewport.h - 45);
    new StatsUI_1.StatsUI();
    new PowerUpUI_1.PowerUpUI();
    new PlayerBoard_1.PlayerBoard();
    new Orb_1.Orb(PlayerBoard_1.PlayerBoard.instance.x, PlayerBoard_1.PlayerBoard.instance.y - 10);
    new Orb_DevOrb_1.DevOrb();
    // new FireOrb(PlayerBoard.instance.x, PlayerBoard.instance.y);
    // new MultiOrb(PlayerBoard.instance.x, PlayerBoard.instance.y-200);
    level_1_1.level_1();
    // console.log(GridSegment.instances[GridSegment.instances.length - 1].id);
    gameLoop();
};
const gameLoop = () => {
    // clear canvas
    global_1.ctx.clearRect(0, 0, global_1.viewport.w, global_1.viewport.h);
    // draw background image
    global_1.ctx.drawImage(global_1.game.misc.background, 0, 0, global_1.viewport.w, global_1.viewport.h);
    global_1.ctx.fillStyle = 'rgba(22, 22, 24, 0.7)';
    global_1.ctx.fillRect(0, 0, global_1.viewport.w, global_1.viewport.h);
    // display 'game start' text while game is not running
    if (!global_1.game.running)
        global_1.game.misc.texts.startGame.pulse();
    if (!global_1.game.running)
        global_1.game.misc.texts.moveLeft.draw();
    if (!global_1.game.running)
        global_1.game.misc.texts.moveRight.draw();
    if (!global_1.game.running)
        global_1.game.misc.texts.usePowerUp.draw();
    // GAME COMPONENTS
    Grid_1.Grid.render();
    StatsUI_1.StatsUI.render();
    PowerUpUI_1.PowerUpUI.render();
    Brick_1.Brick.render();
    PowerUp_1.PowerUp.render();
    PlayerBoard_1.PlayerBoard.render();
    Orb_1.Orb.render();
    // FX.render();
    if (global_1.game.misc.texts.calcs)
        global_1.game.misc.texts.calcs.draw();
    if (global_1.game.over)
        global_1.game.misc.texts.gameover.pulse();
    requestAnimationFrame(() => {
        // FPS display
        global_1.game.frameCounter++;
        let fps = 1 / ((performance.now() - global_1.game.lastFrameRendered) / 1000);
        global_1.game.lastFrameRendered = performance.now();
        if (global_1.game.frameCounter > 30) {
            global_1.game.fps = fps;
            global_1.game.frameCounter = 0;
        }
        gameLoop();
    });
};

},{"./classes/Brick":1,"./classes/Grid":2,"./classes/Orb":4,"./classes/Orb_DevOrb":5,"./classes/PlayerBoard":6,"./classes/PowerUp":7,"./classes/PowerUpUI":8,"./classes/StatsUI":12,"./classes/TextUI":13,"./global":14,"./level/level-1":15}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// O R B  H I T S  P A D D L E ==================================================
exports.OrbPaddle = (orb, paddle) => {
    let coll = {
        top: orb.y + orb.radius + 1 >= paddle.y &&
            orb.y - orb.radius - 1 <= paddle.y &&
            orb.x - orb.radius - 1 <= paddle.x - paddle.w / 2 + paddle.w &&
            orb.x + orb.radius + 1 >= paddle.x - paddle.w / 2,
        left: orb.x + orb.radius + 1 >= paddle.x - paddle.w / 2 &&
            orb.x - orb.radius - 1 <= paddle.x - paddle.w / 2 &&
            orb.y - orb.radius - 1 <= paddle.y + paddle.h &&
            orb.y + orb.radius + 1 >= paddle.y,
        right: orb.x + orb.radius + 1 >= paddle.x - paddle.w / 2 + paddle.w &&
            orb.x - orb.radius - 1 <= paddle.x - paddle.w / 2 + paddle.w &&
            orb.y - orb.radius - 1 <= paddle.y + paddle.h &&
            orb.y + orb.radius + 1 >= paddle.y,
    };
    switch (true) {
        case coll.top && coll.left:
            // orb.vx *= -1;
            orb.vy *= -1;
            break;
        case coll.top && coll.right:
            // orb.vx *= -1;
            orb.vy *= -1;
            break;
        case coll.top:
            orb.vy *= -1;
            break;
        case coll.left:
            orb.vx *= -1;
            break;
        case coll.right:
            orb.vx *= -1;
            break;
        default:
            return false;
    }
    return true;
};
// O R B  H I T S  B R I C K ==================================================
exports.OrbBrick = (orb, brick) => {
    let coll = {
        top: orb.y + orb.radius + 1 >= brick.y &&
            orb.y - orb.radius - 1 <= brick.y &&
            orb.x - orb.radius - 1 <= brick.x + brick.w &&
            orb.x + orb.radius + 1 >= brick.x,
        left: orb.x + orb.radius + 1 >= brick.x &&
            orb.x - orb.radius - 1 <= brick.x &&
            orb.y - orb.radius - 1 <= brick.y + brick.h &&
            orb.y + orb.radius + 1 >= brick.y,
        right: orb.x + orb.radius + 1 >= brick.x + brick.w &&
            orb.x - orb.radius - 1 <= brick.x + brick.w &&
            orb.y - orb.radius - 1 <= brick.y + brick.h &&
            orb.y + orb.radius + 1 >= brick.y,
        bottom: orb.y + orb.radius + 1 >= brick.y + brick.h &&
            orb.y - orb.radius - 1 <= brick.y + brick.h &&
            orb.x - orb.radius - 1 <= brick.x + brick.w &&
            orb.x + orb.radius + 1 >= brick.x
    };
    // if fireorb, report collision, but skip orb reaction
    if (orb.fireOrb)
        return (coll.top || coll.left || coll.right || coll.bottom);
    switch (true) {
        case coll.top && coll.left:
            orb.vx *= -1;
            break;
        case coll.top && coll.right:
            orb.vx *= -1;
            break;
        case coll.bottom && coll.left:
            orb.vx *= -1;
            break;
        case coll.bottom && coll.right:
            orb.vx *= -1;
            break;
        case coll.top:
            orb.vy *= -1;
            break;
        case coll.bottom:
            orb.vy *= -1;
            break;
        case coll.left:
            orb.vx *= -1;
            break;
        case coll.right:
            orb.vx *= -1;
            break;
        default:
            return false;
    }
    return true;
};
// O R B  E N T E R S ==================================================
exports.OrbEnters = (orb, segment) => {
    return orb.y + orb.radius >= segment.y &&
        orb.y - orb.radius <= segment.y + segment.h &&
        orb.x + orb.radius >= segment.x &&
        orb.x - orb.radius <= segment.x + segment.w;
};
// O R B  H I T  W A L L ==================================================
exports.OrbWall = (orb) => {
};

},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randNum = (min, max) => {
    return Math.random() * (max - min) + min;
};
exports.randInt = (min, max) => {
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
};
exports.xorNum = (numArr) => {
    return numArr[Math.floor(Math.random() * numArr.length)];
};

},{}]},{},[16]);
