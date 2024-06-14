export function add(_lines,mouse,using,snap){
    let lines = [..._lines];
    let place = {};
    place = mouse;
    if (snap.modifiers.length > 0){
        let line = lines[lines.length-1];
        snap.modifiers.forEach((mod,index) => {
            if (mod.id == "line_angle"){
                //project endpoint onto angle
                let ang = -parseFloat(mod.value)*(Math.PI/180);
                let a = {x: place.x - line.a.x,y: place.y - line.a.y};
                let b = {x: Math.cos(ang),y: Math.sin(ang)};
                let length = a.x * b.x + a.y * b.y;
                place = {x: line.a.x + length * b.x
                      ,y: line.a.y + length * b.y};
            }
            snap.modifiers[index].remove();
            snap.modifiers.splice(index,1);
        });
    }
    else if (snap.coords){
        place = snap.coords;
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
export function onclick_button(event,line){
    switch(event.target.id){
        case "line_move":
            return {effect:"move",close:true};
            break;
    }
}
export function move(line,amount){
    line.a.x += amount.x;
    line.a.y += amount.y;
    line.b.x += amount.x;
    line.b.y += amount.y;
}