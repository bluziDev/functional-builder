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
export function lines(event,tool,using,_lines,selected,snap){
    let mouse = {x: event.offsetX, y: event.offsetY};
    let lines = [..._lines];
    let effect = {lines:lines,using:using};
    switch(tool){
        case "draw":
            effect.lines = lines_add(lines,mouse,using,snap);
            effect.using = !effect.using;
            break;
        /*case "select":
            effect.lines = lines_select(lines,mouse,using);
            effect.using = !effect.using;
            break;*/
        case "remove":
            effect.lines = lines_remove(lines,mouse,using,selected);
            break;
    }
    return effect;
}
export function select(lines,mouse,tool,using){
    let select_radius = 10;
    for (const line of lines){
        let on_last = lines.indexOf(line) == lines.length-1;
        if (!on_last || (on_last && 
           (tool != "draw" || (tool == "draw" && !using)))){
            let nearest = nearest_on_line({x:mouse.x, y:mouse.y}
                                         ,{x:line.a.x, y:line.a.y}
                                         ,{x:line.b.x, y:line.b.y});
            if (Math.hypot(mouse.x-nearest.x,mouse.y-nearest.y)
            <= select_radius){
                return line;
            }
        }
    }
    return null;
}