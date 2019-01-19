(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const global_1 = require("../global");
const PowerUp_MultiOrb_1 = require("./PowerUp_MultiOrb");
const PowerUp_XXLBoard_1 = require("./PowerUp_XXLBoard");
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
        let within = (segment) => {
            if ((this.x + this.w) >= segment.x && this.x <= (segment.x + segment.w) && (this.y + this.h) >= segment.y && this.y <= (segment.y + segment.h)) {
                return true;
            }
        };
        // segment check
        for (let i = 0; i < global_1.game.gridSegments.length; i++) {
            if (within(global_1.game.gridSegments[i])) {
                global_1.game.gridSegments[i].contains.push(this);
            }
        }
        this.dropPowerUp = () => {
            if (Math.round(Math.random() * 5) === 1 || true) {
                let num = Math.round(Math.random() * 2);
                num = 0;
                if (num === 0)
                    global_1.game.powerUps.push(new PowerUp_XXLBoard_1.XXLBoard(this.x, this.y));
                if (num === 1)
                    global_1.game.powerUps.push(new PowerUp_MultiOrb_1.MultiOrb(this.x, this.y));
            }
        };
        this.draw = () => {
            global_1.ctx.save();
            global_1.ctx.drawImage(this.texture, this.x, this.y, this.w, this.h);
            global_1.ctx.fill();
            global_1.ctx.restore();
        };
    }
}
exports.Brick = Brick;

},{"../global":12,"./PowerUp_MultiOrb":8,"./PowerUp_XXLBoard":9}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const global_1 = require("../global");
const GridSegment_1 = require("./GridSegment");
class BrickArea {
    constructor(x, y, w, h, renderGrid = false) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.renderGrid = renderGrid;
        this.segmentsPerRow = 5; // grid
        // generate grid
        let offsetX = this.x;
        let offsetY = this.y;
        let col = 1; // "next line" -controller
        for (let i = 0; i < this.segmentsPerRow * this.segmentsPerRow; i++) {
            // the object parameter contains width and height of THIS (= BrickArea).
            global_1.game.gridSegments.push(new GridSegment_1.GridSegment(offsetX, offsetY, this.segmentsPerRow, i, { w: this.w, h: this.h }));
            offsetX += this.w / this.segmentsPerRow;
            if (col === this.segmentsPerRow) {
                offsetX = this.x; // initial value
                offsetY += this.h / this.segmentsPerRow;
                col = 0;
            }
            col++;
        }
        this.draw = () => {
            global_1.ctx.save();
            global_1.ctx.fillStyle = "rgba(0, 255, 0, 0.1)";
            global_1.ctx.fillRect(global_1.game.brickArea.x, global_1.game.brickArea.y, global_1.game.brickArea.w, global_1.game.brickArea.h);
            global_1.ctx.fill();
            global_1.ctx.restore();
        };
    }
}
exports.BrickArea = BrickArea;

},{"../global":12,"./GridSegment":3}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const global_1 = require("../global");
class GridSegment {
    constructor(x, y, size, id, brickAreaSize) {
        this.x = x;
        this.y = y;
        this.w = brickAreaSize.w / size;
        this.h = brickAreaSize.h / size;
        this.color = 'rgba(0, 255, 255, 0.5)';
        this.id = id;
        this.contains = [];
        this.draw = () => {
            global_1.ctx.save();
            global_1.ctx.strokeStyle = this.color;
            global_1.ctx.strokeRect(this.x, this.y, this.w, this.h);
            global_1.ctx.fillText(this.id, this.x + this.w / 2.2, this.y + this.h / 1.6);
            global_1.ctx.restore();
        };
    }
}
exports.GridSegment = GridSegment;

},{"../global":12}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const global_1 = require("../global");
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
        };
        this.isColliding = () => {
            let segments = global_1.game.gridSegments;
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
            if (this.y - this.radius < global_1.game.brickArea.y) {
                this.vy *= -1;
                this.y = global_1.game.brickArea.y + this.radius;
            } // top
            if (this.x - this.radius < 0) {
                this.vx *= -1;
                this.x = this.radius;
            } // left wall
            if (this.x + this.radius > global_1.viewport.w) {
                this.vx *= -1;
                this.x = global_1.viewport.w - this.radius;
            } // right wall
            // board collision
            let distX = (this.x + this.radius) - (global_1.game.playerBoard.x - global_1.game.playerBoard.w / 2);
            let distY = (this.y + this.radius) - global_1.game.playerBoard.y;
            if ((distX >= 0 && distX <= global_1.game.playerBoard.w + this.radius * 2) && (distY >= 0 && distY <= global_1.game.playerBoard.h + this.radius * 2)) {
                if (global_1.game.playerBoard.sticky) {
                    this.vy = 0;
                    this.vx = 0;
                }
                else {
                    this.vy = Math.floor(Math.random() * 5 + 5) * -1;
                    // this.vx = Math.floor(Math.random() * 5 + 5) * -1;
                }
            }
        };
        this.drawTrail = () => {
            global_1.ctx.save();
            this.trail.push({ x: this.x, y: this.y });
            if (this.trail.length > this.maxTrailLength)
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
            global_1.ctx.fillStyle = this.fillColor;
            global_1.ctx.beginPath();
            global_1.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            global_1.ctx.fill();
            global_1.ctx.restore();
        };
    }
}
exports.Orb = Orb;

},{"../global":12}],5:[function(require,module,exports){
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
        // this.texture.src = 'img/paddle.png';
        this.moveLeft = () => {
            if (this.x - this.w / 2 > 0)
                this.x -= this.vx;
        };
        this.moveRight = () => {
            if (this.x + this.w / 2 < global_1.viewport.w)
                this.x += this.vx;
        };
        this.draw = () => {
            global_1.ctx.save();
            global_1.ctx.fillStyle = this.fillColor;
            global_1.ctx.shadowBlur = 10;
            global_1.ctx.shadowColor = "rgba(255, 255, 255, 0.2)";
            global_1.ctx.fillRect(this.x - this.w / 2, this.y, this.w, this.h);
            global_1.ctx.drawImage(this.texture, this.x - this.w / 2, this.y, this.w, this.h);
            global_1.ctx.fill();
            global_1.ctx.restore();
            // ctx.font = "14px Arial";
            // ctx.fillText('x:'+this.x.toFixed(0)+' y:'+this.y.toFixed(0), this.x + this.w / 2 + 10, this.y);
        };
    }
}
exports.PlayerBoard = PlayerBoard;

},{"../global":12}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const global_1 = require("../global");
class PowerUp {
    constructor(x, y, name, icon) {
        this.x = x;
        this.y = y;
        this.vy = 5;
        this.w = 50;
        this.h = 25;
        this.hidden = false;
        this.icon = new Image(100, 100);
        this.icon.src = 'img/' + icon;
        this.color = 'purple';
        this.collected = () => {
            if (!this.hidden && (this.x + this.w) >= global_1.game.playerBoard.x - global_1.game.playerBoard.w / 2 && this.x <= (global_1.game.playerBoard.x + global_1.game.playerBoard.w / 2) && (this.y + this.h) >= global_1.game.playerBoard.y && this.y <= (global_1.game.playerBoard.y + global_1.game.playerBoard.h)) {
                this.hidden = true;
                console.log('power up ' + name + ' equipped!');
                global_1.game.equippedPowerUp = this;
                // TODO: remove from array
                return true;
            }
        };
        this.draw = () => {
            global_1.ctx.save();
            global_1.ctx.fillStyle = this.color;
            global_1.ctx.fillRect(this.x, this.y, this.w, this.h);
            global_1.ctx.drawImage(this.icon, this.x, this.y);
            global_1.ctx.restore();
        };
    }
}
exports.PowerUp = PowerUp;

},{"../global":12}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const global_1 = require("../global");
class PowerUpUI {
    constructor() {
        this.x = global_1.viewport.w - 40;
        this.y = 0;
        this.w = global_1.viewport.w;
        this.h = 5;
        this.powerUpLifetime = 0;
        this.initLifetime = 0;
        this.timer = lifetime => {
            this.powerUpLifetime = this.initLifetime = lifetime;
            let timer = setInterval(() => {
                this.powerUpLifetime -= 0.05;
                if (this.powerUpLifetime <= 0)
                    clearInterval(timer);
            }, 50);
        };
        this.draw = () => {
            if (this.powerUpLifetime > 0) {
                let fill = this.w / this.initLifetime * this.powerUpLifetime;
                global_1.ctx.save();
                global_1.ctx.shadowBlur = 15;
                global_1.ctx.shadowColor = '#000';
                global_1.ctx.fillStyle = 'darkred';
                global_1.ctx.fillRect(global_1.viewport.w / 2 - fill / 2, global_1.viewport.h - this.h, fill, this.h);
                global_1.ctx.restore();
            }
        };
    }
}
exports.PowerUpUI = PowerUpUI;

},{"../global":12}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const global_1 = require("../global");
const Orb_1 = require("./Orb");
const PowerUp_1 = require("./PowerUp");
class MultiOrb extends PowerUp_1.PowerUp {
    constructor(x, y) {
        super(x, y, 'Multi Orb', 'brick_cracked.png');
        this.id = 2;
        this.activate = () => {
            if (!global_1.game.activePowerUp || global_1.game.activePowerUp.id !== this.id) {
                for (var i = 0; i < 2; i++) {
                    global_1.game.orbs.push(new Orb_1.Orb(global_1.game.playerBoard.x, global_1.game.playerBoard.y - 10));
                }
                global_1.game.activePowerUp = global_1.game.equippedPowerUp;
                global_1.game.equippedPowerUp = null;
            }
        };
    }
}
exports.MultiOrb = MultiOrb;

},{"../global":12,"./Orb":4,"./PowerUp":6}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const global_1 = require("../global");
const PowerUp_1 = require("./PowerUp");
class XXLBoard extends PowerUp_1.PowerUp {
    constructor(x, y) {
        super(x, y, 'XXL Board', 'expand.png');
        this.lifetime = 15; // seconds
        this.id = 1;
        this.activate = () => {
            if (!global_1.game.activePowerUp || global_1.game.activePowerUp.id !== this.id) {
                global_1.game.playerBoard.w *= 2;
                global_1.game.activePowerUp = global_1.game.equippedPowerUp;
                global_1.game.equippedPowerUp = null;
                global_1.game.UIs.powerUpUI.timer(this.lifetime);
                // game.UIs.powerUpUI.icon(this.icon);
                setTimeout(() => {
                    global_1.game.playerBoard.w /= 2;
                    global_1.game.activePowerUp = null;
                }, this.lifetime * 1000);
            }
        };
    }
}
exports.XXLBoard = XXLBoard;

},{"../global":12,"./PowerUp":6}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const global_1 = require("../global");
class StatsUI {
    constructor() {
        this.w = global_1.viewport.w / 100 * 25;
        this.h = 30;
        this.level = 0;
        this.draw = () => {
            global_1.ctx.save();
            global_1.ctx.fillStyle = '#aaa';
            global_1.ctx.font = "16px Arial";
            global_1.ctx.fillText(`Level ${this.level}`, 10, this.h - 5);
            // container
            global_1.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            global_1.ctx.fillRect(0, 0, global_1.viewport.w, this.h + 10);
            global_1.ctx.restore();
        };
    }
}
exports.StatsUI = StatsUI;

},{"../global":12}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const global_1 = require("../global");
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

},{"../global":12}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let canvas = document.querySelector('#canvas');
exports.canvas = canvas;
let ctx = canvas.getContext('2d');
exports.ctx = ctx;
let viewport = { w: window.innerWidth, h: window.innerHeight };
exports.viewport = viewport;
let game = {
    boardControl: { left: false, right: false },
    running: false,
    devOrb: null,
    playerBoard: null,
    brickArea: null,
    orbs: [],
    bricks: [],
    gridSegments: [],
    powerUps: [],
    equippedPowerUp: null,
    activePowerUp: null,
    UIs: {
        statsUI: null,
        powerUpUI: null
    },
    misc: {
        texts: {
            startGame: ''
        },
        pipes: [],
        background: null
    }
};
exports.game = game;

},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const global_1 = require("../global");
const Brick_1 = require("../classes/Brick");
exports.level_1 = () => {
    global_1.game.UIs.statsUI.level = 1;
    let rowCount = 0, offsetX = 0;
    let center = blocksPerRow => {
        return ((blocksPerRow * 60) - global_1.viewport.w) / 2 * -1;
    };
    const createRow = blocksPerRow => {
        for (var i = 0; i < blocksPerRow; i++) {
            offsetX = (i * 60) + center(blocksPerRow);
            global_1.game.bricks.push(new Brick_1.Brick(offsetX, global_1.game.brickArea.y + (rowCount * 43)));
        }
        rowCount++;
    };
    createRow(20);
    createRow(10);
    createRow(15);
    createRow(2);
    createRow(11);
    createRow(4);
    createRow(6);
};

},{"../classes/Brick":1,"../global":12}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const global_1 = require("./global");
const TextUI_1 = require("./classes/TextUI");
const BrickArea_1 = require("./classes/BrickArea");
const StatsUI_1 = require("./classes/StatsUI");
const PowerUpUI_1 = require("./classes/PowerUpUI");
const PlayerBoard_1 = require("./classes/PlayerBoard");
const Orb_1 = require("./classes/Orb");
const level_1_1 = require("./level/level-1");
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
        if (e.keyCode === 69 && global_1.game.running && global_1.game.equippedPowerUp) { // E
            global_1.game.equippedPowerUp.activate();
        }
        // let boardControl: any = {left: false, right: false};
        if (e.keyCode === 68) { // D
            global_1.game.boardControl.right = true;
            global_1.game.boardControl.left = false;
        }
        if (e.keyCode === 65) { // A
            global_1.game.boardControl.left = true;
            global_1.game.boardControl.right = false;
        }
    });
    document.addEventListener('keyup', e => {
        if (e.keyCode === 68)
            global_1.game.boardControl.right = false;
        if (e.keyCode === 65)
            global_1.game.boardControl.left = false;
    });
    // document.addEventListener('mousemove', e => {
    //
    // });
    // canvas dimensions
    global_1.canvas.width = global_1.viewport.w;
    global_1.canvas.height = global_1.viewport.h;
    // background image
    global_1.game.misc.background = new Image(0, 0);
    global_1.game.misc.background.src = 'img/background.jpg';
    // game-start text
    global_1.game.misc.texts.startGame = new TextUI_1.TextUI('Press [SPACE] to start', 'center', global_1.viewport.h / 1.15, '#fff', '40px Arial');
    // game setup
    global_1.game.brickArea = new BrickArea_1.BrickArea(0, 45, global_1.viewport.w, global_1.viewport.h / 2, false);
    global_1.game.UIs.statsUI = new StatsUI_1.StatsUI();
    global_1.game.UIs.powerUpUI = new PowerUpUI_1.PowerUpUI();
    global_1.game.playerBoard = new PlayerBoard_1.PlayerBoard();
    global_1.game.orbs.push(new Orb_1.Orb(global_1.game.playerBoard.x, global_1.game.playerBoard.y - 10));
    level_1_1.level_1();
    gameLoop();
};
const gameLoop = () => {
    // draw background image
    global_1.ctx.drawImage(global_1.game.misc.background, 0, 0, global_1.viewport.w, global_1.viewport.h);
    // refresh canvas
    global_1.ctx.fillStyle = 'rgba(22, 22, 24, 0.75)';
    global_1.ctx.fillRect(0, 0, global_1.viewport.w, global_1.viewport.h);
    // whether to render grid or not
    if (global_1.game.brickArea.renderGrid) {
        global_1.game.brickArea.draw();
        let segments = global_1.game.gridSegments.length;
        for (let i = 0; i < segments; i++) {
            global_1.game.gridSegments[i].draw();
        }
        // ruler
        global_1.ctx.strokeStyle = 'darkred';
        global_1.ctx.beginPath();
        global_1.ctx.moveTo(global_1.viewport.w / 2, 0);
        global_1.ctx.lineTo(global_1.viewport.w / 2, global_1.viewport.h);
        global_1.ctx.stroke();
        global_1.ctx.beginPath();
        global_1.ctx.moveTo(0, global_1.viewport.h / 2);
        global_1.ctx.lineTo(global_1.viewport.w, global_1.viewport.h / 2);
        global_1.ctx.stroke();
    }
    // player board movement
    if (global_1.game.boardControl.left)
        global_1.game.playerBoard.moveLeft();
    if (global_1.game.boardControl.right)
        global_1.game.playerBoard.moveRight();
    // GAME COMPONENTS
    global_1.game.UIs.statsUI.draw();
    global_1.game.UIs.powerUpUI.draw();
    global_1.game.playerBoard.draw();
    // display 'game start' text while game is not running
    if (!global_1.game.running)
        global_1.game.misc.texts.startGame.pulse();
    // BRICKS
    let bricks = global_1.game.bricks.length;
    for (let i = 0; i < bricks; i++) {
        if (!global_1.game.bricks[i].hidden) {
            global_1.game.bricks[i].draw();
        }
    }
    // POWERUPS
    for (let i = 0; i < global_1.game.powerUps.length; i++) {
        global_1.game.powerUps[i].collected();
        if (!global_1.game.powerUps[i].hidden) {
            global_1.game.powerUps[i].y += global_1.game.powerUps[i].vy;
            global_1.game.powerUps[i].draw();
        }
    }
    // ORBS
    for (let i = 0; i < global_1.game.orbs.length; i++) {
        if (global_1.game.running) {
            global_1.game.orbs[i].isColliding();
            global_1.game.orbs[i].x += global_1.game.orbs[i].vx;
            global_1.game.orbs[i].y += global_1.game.orbs[i].vy;
        }
        else {
            // stick orb to player board until game is running
            global_1.game.orbs[i].x = global_1.game.playerBoard.x;
            global_1.game.orbs[i].y = global_1.game.playerBoard.y - 10;
        }
        global_1.game.orbs[i].draw();
        global_1.game.orbs[i].drawTrail();
    }
    requestAnimationFrame(() => {
        gameLoop();
    });
};

},{"./classes/BrickArea":2,"./classes/Orb":4,"./classes/PlayerBoard":5,"./classes/PowerUpUI":7,"./classes/StatsUI":10,"./classes/TextUI":11,"./global":12,"./level/level-1":13}]},{},[14]);
