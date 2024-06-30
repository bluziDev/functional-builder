import {add as lines_add
       ,select as lines_select
       ,remove as lines_remove} from "./lines.js";
import {nearest_on_line} from "./nearest_on_line.js";
import {modify_angle as snap_modify_angle
       ,modify_length as snap_modify_length} from "./snap.js";

export function change(event,tool,using){
    let new_tool = tool;
    if (!using && event.target.tagName == "BUTTON"){
        new_tool = event.target.id;
        document.getElementById(tool).className = "tool";
        document.getElementById(new_tool).className = "tool_pressed";
        //console.log(tool);
    }
    return new_tool;
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
export function select(lines,mouse,tool,using,select_radius){
    let proposed = null;
    for (const line of lines){
        let on_last = lines.indexOf(line) == lines.length-1;
        if (!on_last || (on_last && 
           (tool != "draw" || (tool == "draw" && !using)))){
            let nearest = nearest_on_line({x:mouse.x, y:mouse.y}
                                         ,{x:line.a.x, y:line.a.y}
                                         ,{x:line.b.x, y:line.b.y});
            if (Math.hypot(mouse.x-nearest.x,mouse.y-nearest.y)
                <= select_radius){
                let nearest_end_dis = Math.min
                (
                    Math.hypot(mouse.x-line.a.x, mouse.y-line.a.y)
                   ,Math.hypot(mouse.x-line.b.x, mouse.y-line.b.y)
                );
                if (nearest_end_dis<=select_radius){
                    return line;
                }
                else if (!proposed){
                    proposed = line;
                }
            }
        }
    }
    return proposed;
}
export function snap(hover,mouse,using,lines,snap_radius,_snap){
    let coords = {...mouse};
    let mods = _snap.modifiers;
    let hide = true;
    if (mods.length > 0){
        let drawing = lines[lines.length-1];
        let modification = {coords: {...mouse},hide: hide};
        mods.forEach(mod =>{
            if (mod.id == "line_angle"){
                modification = snap_modify_angle(mod,mouse,drawing,lines,modification.coords,snap_radius,modification.hide);
            }
            if (mod.id == "line_length"){
                modification = snap_modify_length(mod,mouse,drawing,lines,snap_radius,modification,mods);
            }
        });
        coords = modification.coords;
        hide = modification.hide;
    }
    else if (hover){
        let nearest_point = nearest_on_line({x:mouse.x, y:mouse.y}
                                        ,{x:hover.a.x, y:hover.a.y}
                                        ,{x:hover.b.x, y:hover.b.y});
        //let disto_nearest = Math.hypot(mouse.x-nearest_point.x, mouse.y-nearest_point.y);
        let disto_a = Math.hypot(mouse.x-hover.a.x, mouse.y-hover.a.y);
        let disto_b = Math.hypot(mouse.x-hover.b.x, mouse.y-hover.b.y);
        let nearest_end = disto_a <= disto_b ? hover.a : hover.b;
        let disto_end = nearest_end == hover.a ? disto_a : disto_b;
        let point = disto_end <= snap_radius ? nearest_end : nearest_point;
        coords = point;
        hide = false;
        if (using){
            let last_line = lines[lines.length-1];
            let dis_from_start = Math.hypot(mouse.x-last_line.a.x
                                            ,mouse.y-last_line.a.y);
            if (dis_from_start <= snap_radius){
                coords = {...mouse};
                hide = true;
            }
        }
    }
    return {coords: coords,modifiers: mods,hide: hide,radius: _snap.radius};
}