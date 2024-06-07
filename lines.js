export function add(_lines,mouse,using){
    let lines = [..._lines];
    if (!using){
        //start line
        lines.push({a: {x: mouse.x, y: mouse.y}
                   ,b: {x: mouse.x, y: mouse.y}});
    }
    else{
        //finish line
        lines[lines.length-1].b = {x: mouse.x, y: mouse.y};
    }
    return lines;
}
export function select(_lines,mouse,using){
    let lines = [..._lines];
    return lines;
}
export function remove(_lines,mouse,using){
    let lines = [..._lines];
    return lines;
}