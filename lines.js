export function add(_lines,mouse,using,snap){
    let lines = [..._lines];
    let place = {};
    if (snap){
        place = snap;
    }
    else{
        place = mouse;
    }
    if (!using){
        //start line
        lines.push({a: {x: place.x, y: place.y}
                   ,b: {x: place.x, y: place.y}});
    }
    else{
        //finish line
        lines[lines.length-1].b = {x: place.x, y: place.y};
    }
    return lines;
}
export function select(_lines,mouse,using){
    let lines = [..._lines];
    return lines;
}
export function remove(_lines,mouse,using,selected){
    let lines = [..._lines];
    if (selected){
        lines.splice(lines.indexOf(selected),1); 
    }
    return lines;
}