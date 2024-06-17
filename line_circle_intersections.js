export function line_circle_intersections(circle, line) {
    // circle: (x - h)^2 + (y - k)^2 = r^2
    // line: y = m * x + n
    // r: circle radius
    // h: x value of circle centre
    // k: y value of circle centre
    // m: slope
    // n: y-intercept
    let r = circle.radius;
    let h = circle.x;
    let k = circle.y;
    let m = (line.b.y - line.a.y) / (line.b.x - line.a.x);
    let n = line.a.y - m * line.a.x;

    // get a, b, c values
    let a = 1 + m * m;
    let b = -h * 2 + (m * (n - k)) * 2;
    let c = h * h + (n - k) ** 2 - r * r;

    let intersections = [];

    // get discriminant
    let d = b * b - 4 * a * c;
    if (d >= 0) {
        // insert into quadratic formula
        let solutions = [
            (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a),
            (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a)
        ];
        solutions.forEach(x => {
            if (x >= Math.min(line.a.x,line.b.x) && x <= Math.max(line.a.x,line.b.x)){
                let point = {x: x,y: m * x + n};
                intersections.push(point);
            }
        });
    }
    return intersections;
}