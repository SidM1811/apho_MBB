function toDegree(angle) {
    return angle * 180 / Math.PI;
}

function toRadian(angle) {
    return angle * Math.PI / 180;
}

function strokeRect(rect) {
    context.strokeRect(rect.x, rect.y, rect.width, rect.height);
}

function insideRect(rect, x, y) {
    return (rect.x < x && x < rect.x + rect.width && rect.y < y && y < rect.y + rect.height);
}

function getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function getMagn(x, y) {
    return Math.sqrt(x * x + y * y);
}

function getDotProduct(x1, y1, x2, y2) {
    return x1 * y1 + x2 * y2;
}

const clamp = (num, a, b) => Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));

const clampNumber = (num) => clamp(num, -B_crit, B_crit);

function insidePolygon(x, y, polygon) {
    let x1, y1, x2, y2;
    let x3 = x, y3 = y;
    let x4 = 100 * canvas_width, y4 = 100 * canvas_height;
    let t, u, deno;
    let num_intersection = 0;

    for (let i = 1; i <= polygon.length; i++) {
        if (i < polygon.length) {
            x1 = polygon[i - 1].x;
            y1 = polygon[i - 1].y;
            x2 = polygon[i].x;
            y2 = polygon[i].y;
        }
        else if (i == polygon.length) {
            x1 = polygon[i - 1].x;
            y1 = polygon[i - 1].y;
            x2 = polygon[0].x;
            y2 = polygon[0].y;
        }

        deno = (x2 - x1) * (y3 - y4) - (x3 - x4) * (y2 - y1);
        t = (x3 - x1) * (y3 - y4) - (x3 - x4) * (y3 - y1);
        t /= deno;
        u = (x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1);
        u /= deno;

        if (0 < t && t < 1 && 0 < u && u < 1) {
            num_intersection++;
        }
    }
    return (num_intersection % 2 == 1);
}