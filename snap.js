
import { intersect } from "./intersect.js";
import { line_circle_intersections } from "./line_circle_intersections.js";

export function is_modkey(key){
    return (key == "a"
          ||key == "l");
}
export function get_modid(key){
    if (key == "a") return "line_angle";
    if (key == "l") return "line_length";
}
export function add_mod(_mods,element){
    let mods = [..._mods];
    switch (element.id){
        case "line_angle":
            mods.splice(0,0,element);
            break
        case "line_length":
            mods.push(element);
            break
    }
    return mods;
}
export function modify_angle(mod,mouse,drawing,lines,_coords,snap_radius,_hide){
    //project endpoint onto angle
    let ang = -parseFloat(mod.value)*(Math.PI/180);
    let a = {x: mouse.x - drawing.a.x,y: mouse.y - drawing.a.y};
    let b = {x: Math.cos(ang),y: Math.sin(ang)};
    let length = a.x * b.x + a.y * b.y;
    let coords = {..._coords};
    let hide = _hide;
    coords = {x: drawing.a.x + length * b.x
                ,y: drawing.a.y + length * b.y};
    for (const line of lines){
        if (line != drawing){
            let intersection = intersect(drawing.a.x,drawing.a.y
                                        ,coords.x,coords.y
                                        ,line.a.x,line.a.y
                                        ,line.b.x,line.b.y);
            if (intersection){
                if (
                Math.hypot(intersection.x - coords.x
                        ,intersection.y - coords.y)
                <= snap_radius){
                    coords = intersection;
                    hide = false;
                    break;
                }
            }
        }
    }
    return {coords: coords,hide: hide};
}
export function modify_length(input,mouse,drawing,lines,snap_radius,modification,mods){
    let hide = true;
    //first clamp length
    let drawing_from_start = {x: modification.coords.x - drawing.a.x
                             ,y: modification.coords.y - drawing.a.y};
    let length_drawing = Math.hypot(drawing_from_start.x
                                  , drawing_from_start.y);
    let normalized = {x: drawing_from_start.x / length_drawing
                     ,y: drawing_from_start.y / length_drawing};
    let length_new = parseFloat(input.value);
    let coords = {x: drawing.a.x + normalized.x * length_new
                 ,y: drawing.a.y + normalized.y * length_new};
    //only try to snap by angle if there is not also an angle modifier
    if (!mods.includes(document.getElementById("line_angle"))){
        //then calculate the angle in radians that 
        //corresponds to snap_radius
        //using law of cosines
        let l = length_new;
        //let max_angle_snap = Math.acos((l ** 2 + l ** 2 - snap_radius ** 2)
        //                                                    / (2 * l * l));
        //and check if we can snap to any of the existing lines
        //
        for (const line of lines){ 
            if (line != drawing){
                let circle = {x: drawing.a.x,y: drawing.a.y,radius: l};
                let intersections = line_circle_intersections(circle, line);
                for (const intersection of intersections){
                    if (
                    Math.hypot(intersection.x - coords.x
                            ,intersection.y - coords.y)
                    <= snap_radius){
                        coords = intersection;
                        hide = false;
                        break;
                    }
                };
                if (!hide){
                    break;
                }
            }
        }
    }
    return {coords: coords,hide: hide};
}