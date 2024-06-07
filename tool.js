import {add as lines_add
       ,select as lines_select
       ,remove as lines_remove} from "./lines.js";
import {nearest_on_line} from "./nearest_on_line.js";

export function change(event,tool,using){
    if (!using){
        return event.target.id;
    }
    else{
        return tool;
    }
}
export function lines(event,tool,using,_lines){
    let mouse = {x: event.offsetX, y: event.offsetY};
    let lines = [..._lines];
    switch(tool){
        case "draw":
            lines = lines_add(lines,mouse,using);
            break;
        case "select":
            lines = lines_select(lines,mouse,using);
            break;
        case "remove":
            lines = lines_remove(lines,mouse,using);
            break;
    }
    return lines;
}
export function select(lines,mouse){
    let select_radius = 10;
    for (const line of lines){
        let nearest = nearest_on_line({x:mouse.x, y:mouse.y}
                                     ,{x:line.a.x, y:line.a.y}
                                     ,{x:line.b.x, y:line.b.y});
        if (Math.hypot(mouse.x-nearest.x,mouse.y-nearest.y)
         <= select_radius){
            return line;
        }
    }
    return null;
}