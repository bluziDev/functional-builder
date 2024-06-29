
import { intersect } from "./intersect.js";
import { line_circle_intersections } from "./line_circle_intersections.js";
import { px_to_unit
        ,unit_to_px} from "./scaling.js";

export function is_modkey(key){
    return (key == "a"
          ||key == "l");
}
export function get_modid(key){
    if (key == "a") return "line_angle";
    if (key == "l") return "line_length";
}
export function add_mod(_mods,id,lines,mouse,snap,snap_menu,unit){
    let mods = [..._mods];
    let label = document.createElement("label");
    label.setAttribute("for",id);
    label.id = "label"+id;
    label.className = "snap_label";
    label.setAttribute("data-unit",unit);
    let line_input = document.createElement("input");
    line_input.id = id;
    line_input.type = "text";
    line_input.className = "snap_button";
    snap_menu.appendChild(line_input);
    snap_menu.appendChild(label);
    line_input.value = populate_input(id,lines,mouse,snap);
    line_input.addEventListener("input", function(event){
        console.log("input was detected");
        let rgx = /^[0-9]*\.?[0-9]*$/;
        let target = event.target;
        let val = target.value;
        let match = val.match(rgx);
        if (!match){
            target.value = val.substring(0,val.length - 1);
        }
        if (target.value == ""){
            target.value = "0";
        }
        if (val.substring(0,1) == "0"
         && val.substring(0,2) != "0."
         && val != "0"){
            target.value = val.substring(1);
        }
    });
    switch (id){
        case "line_angle":
            mods.splice(0,0,line_input);
            label.innerHTML = "Angle&nbsp";
            break
        case "line_length":
            mods.push(line_input);
            label.innerHTML = "Length&nbspin&nbsp"+unit+"&nbsp";
            break
    }
    let br = document.createElement("br");
    br.id = "br"+id;
    snap_menu.appendChild(br);
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
    let length_new = unit_to_px(parseFloat(input.value));
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
export function populate_input(id,lines,mouse,snap){
    let value = "";
    let start = lines[lines.length - 1].a;
    let end = (snap.coords) ? snap.coords : mouse;
    switch (id){
        case "line_angle":
            value = String((Math.atan((end.y - start.y)
                                   / (end.x - start.x))
                          * -(180/Math.PI)
                          + 360)
                          % 360);
            break;
        case "line_length":
            value = String(Math.hypot(end.x - start.x
                                     ,end.y - start.y));
            value = px_to_unit(value);
            break;
    }
    return value;
}
export function mod_toggle(canvas,key,snap,mouse,lines,snap_menu,unit){
    let mods = [...snap.modifiers];
    if (mouse.focus == canvas){
        let id = get_modid(key);
        let mod = document.getElementById(id);
        if (!mods.includes(mod)){
            mods = add_mod(mods,id,lines,mouse,snap,snap_menu,unit);
        }
        else{
            mods.splice(mods.indexOf(mod),1);
            mod.remove();
            let label = document.getElementById("label"+id);
            label.remove();
            let br = document.getElementById("br"+id);
            br.remove();
        }
    }
    return mods;
}