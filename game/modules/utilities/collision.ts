import { Orb } from "../classes/Orb";
import { PlayerBoard } from "../classes/PlayerBoard";
import { GridSegment } from "../classes/GridSegment";
import { Brick } from "../classes/Brick";

// O R B  H I T S  P A D D L E ==================================================
export const OrbPaddle: any = (orb: Orb, paddle: PlayerBoard) => {
    let coll = {
        top:    orb.y + orb.radius + 1 >= paddle.y &&
                orb.y - orb.radius - 1 <= paddle.y &&
                orb.x - orb.radius - 1 <= paddle.x - paddle.w / 2 + paddle.w &&
                orb.x + orb.radius + 1 >= paddle.x - paddle.w / 2,

        left:   orb.x + orb.radius + 1 >= paddle.x - paddle.w / 2 &&
                orb.x - orb.radius - 1 <= paddle.x - paddle.w / 2 &&
                orb.y - orb.radius - 1 <= paddle.y + paddle.h &&
                orb.y + orb.radius + 1 >= paddle.y,

        right:  orb.x + orb.radius + 1 >= paddle.x - paddle.w / 2 + paddle.w &&
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
}

// O R B  H I T S  B R I C K ==================================================
export const OrbBrick = (orb: Orb, brick: Brick) => {
    let coll = {
        top:    orb.y + orb.radius + 1 >= brick.y &&
                orb.y - orb.radius - 1 <= brick.y &&
                orb.x - orb.radius - 1 <= brick.x + brick.w &&
                orb.x + orb.radius + 1 >= brick.x,

        left:   orb.x + orb.radius + 1 >= brick.x &&
                orb.x - orb.radius - 1 <= brick.x &&
                orb.y - orb.radius - 1 <= brick.y + brick.h &&
                orb.y + orb.radius + 1 >= brick.y,

        right:  orb.x + orb.radius + 1 >= brick.x + brick.w &&
                orb.x - orb.radius - 1 <= brick.x + brick.w &&
                orb.y - orb.radius - 1 <= brick.y + brick.h &&
                orb.y + orb.radius + 1 >= brick.y,

        bottom: orb.y + orb.radius + 1 >= brick.y + brick.h &&
                orb.y - orb.radius - 1 <= brick.y + brick.h &&
                orb.x - orb.radius - 1 <= brick.x + brick.w &&
                orb.x + orb.radius + 1 >= brick.x
    };

    // if fireorb, report collision, but skip orb reaction
    if (orb.fireOrb) return (coll.top || coll.left || coll.right || coll.bottom);

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
}

// O R B  E N T E R S ==================================================
export const OrbEnters = (orb: Orb, segment: GridSegment) => {
    return  orb.y + orb.radius >= segment.y &&
            orb.y - orb.radius <= segment.y + segment.h &&
            orb.x + orb.radius >= segment.x &&
            orb.x - orb.radius <= segment.x + segment.w;
}

// O R B  H I T  W A L L ==================================================
export const OrbWall = (orb: Orb) => {
    
}