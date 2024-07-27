import {lines as draw_lines
       ,highlight as draw_highlight
       ,snap as draw_snap
       ,canvas as draw_canvas} from "./draw.js";
import { nearest_on_line } from "./nearest_on_line.js";
import {change as tool_change
       ,lines as tool_lines
       ,select as tool_select
       ,snap as tool_snap} from "./tool.js";
import {onclick_button as onclick_linebutton
       ,move as line_move} from "./lines.js";
import {open as menu_open
       ,close as menu_close} from "./menu.js";
import {change as selection_change} from "./selection.js";
import {is_modkey as snap_is_modkey
       ,get_modid as snap_get_modid
       ,add_mod as snap_add_mod
       ,populate_input as snap_populate_input
       ,mod_toggle as snap_mod_toggle} from "./snap.js";
import {coords_zoomed,coords_unzoomed,pan,slider_to_zoom} from "./zooming.js";

//canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.setAttribute("width", canvas.parentNode.offsetWidth);
canvas.setAttribute("height", canvas.parentNode.offsetHeight);
let cam = {x: 0,y: 0,zoom: slider_to_zoom(document.getElementById("zoom").value),panning: false};

//lines
var mouse = {x: 0,y: 0,focus: null};
var mouse_prev = {...mouse};
var lines = [];
var select = {hovering: null, selected: null};
var line_menu;
var snap_menu = null;
var line_effect = {effect: ""};
var snap_radius = 10;
var snap = {coords: null,modifiers: [],hide: false,radius: snap_radius / cam.zoom};
function onclick_canvas(event){
    mouse = {x: event.offsetX,y: event.offsetY,focus: event.target};
    let mouse_zoomed = coords_zoomed(mouse,cam);
    mouse.x = mouse_zoomed.x;
    mouse.y = mouse_zoomed.y;
    //change selection
    if (tool == "select"){
        //selection_change();
        if (line_effect.effect){
            select.hovering = tool_select(lines,mouse,tool,using,snap.radius);
            select.selected = null;
            if (line_effect.effect == "move"){
                line_effect.effect = "";
            }
        }
        else if (select.selected != select.hovering){
            if (select.selected){
                menu_close(line_menu);
            }
            select.selected = select.hovering;
            if (select.selected){
                line_menu = menu_open(select.selected,cam);
                line_menu.addEventListener("click",function(event){
                    let click_effect = onclick_linebutton(event,select.selected);
                    line_effect.effect = click_effect.effect;
                    if (click_effect.close){
                        menu_close(line_menu);
                    }
                });
                line_menu.addEventListener("mouseenter",function(event){
                    mouse.focus = event.target;
                    mouse_prev.focus = event.target;
                });
            }
        }
        using = (select.selected);
    }
    else{
        //modify/add/remove lines
        let effect = tool_lines(event,tool,using,lines,select.hovering,snap);
        lines = effect.lines;
        using = effect.using;
        select.hovering = tool_select(lines,mouse,tool,using,snap.radius);
        if (snap_menu && snap.modifiers.length == 0){
            snap_menu.remove();
            snap_menu = null;
        }
        //console.log(lines);
    }
    snap = tool_snap(select.hovering,mouse,using,lines,snap.radius,snap);
    //console.log(snap.radius);
}
function onmousemove_canvas(event){
    mouse = {x: event.offsetX,y: event.offsetY,focus: event.target};
    let mouse_zoomed = coords_zoomed(mouse,cam);
    mouse.x = mouse_zoomed.x;
    mouse.y = mouse_zoomed.y;
    if (!line_effect.effect){
        select.hovering = tool_select(lines,mouse,tool,using,snap.radius);
        snap = tool_snap(select.hovering,mouse,using,lines,snap.radius,snap);
    }
    else{
        if (line_effect.effect == "move" && !cam.panning){
            if (mouse_prev.focus == event.target){
                line_move(select.selected,{x: mouse.x-mouse_prev.x
                                        ,y: mouse.y-mouse_prev.y});
                //console.log("effect applied");
            }
        }
    }
    let pan_result = pan(cam,mouse_prev,mouse);
    cam = pan_result.cam;
    mouse = pan_result.mouse;
    mouse_prev = {...mouse};
}
function onmouseleave_canvas(event){
    select.hovering = null;
    //snap.coords = null;
}
function onkey(event){
    let key = event.key;
    if (event.code == "Space"){
        event.preventDefault();
        cam.panning = !cam.panning;
        if (cam.panning){
            document.body.style.cursor = "grabbing";
        }
        else {
            document.body.style.cursor = "auto";
        }
    }
    else if (snap_is_modkey(key)){
        if (tool == "draw" && using){
            if (!snap_menu){
                snap_menu = document.createElement("div");
                snap_menu.className = "snap_menu";
                let board = document.getElementById("board");
                //board.insertBefore(snap_menu,canvas);
                board.appendChild(snap_menu);
                let mouse_unzoomed = coords_unzoomed(mouse,cam);
                snap_menu.style.top = String(mouse_unzoomed.y) + "px";
                snap_menu.style.left = String(mouse_unzoomed.x) + "px";
            }
            let new_mods = snap_mod_toggle(canvas,key,snap,mouse,lines,snap_menu,unit);
            if (new_mods.length > snap.modifiers.length){
                for(let mod of new_mods){
                    if (!snap.modifiers.includes(mod)){
                        mod.focus();
                        mod.setSelectionRange(0,mod.value.length);
                        mod.readOnly = false;
                    }
                }
            }
            snap.modifiers = new_mods;
            snap = tool_snap(select.hovering,mouse,using,lines,snap.radius,snap);
            snap.modifiers.forEach(mod => {
                if (mod.getAttribute("listener") !== "true"){
                    mod.addEventListener("keyup", function(){
                        snap = tool_snap(select.hovering,mouse,using,lines,snap.radius,snap);
                    });
                    mod.setAttribute("listener", "true");
                }
            });
            if (snap.modifiers.length == 0){
                snap_menu.remove();
                snap_menu = null;
            }
        }
    }
}
/*function keyup(event){
    if (event.code == "Space"){
        panning = false;
    }
}*/
canvas.addEventListener("click",onclick_canvas);
canvas.addEventListener("mousemove",onmousemove_canvas);
canvas.addEventListener("mouseenter",onmousemove_canvas);
canvas.addEventListener("mouseleave",onmouseleave_canvas);
window.addEventListener("keyup",onkey);
//window.addEventListener("keyup",keyup);
//toolbar
let unit_label = document.getElementById("ppi_label");
let slider = document.getElementById("ppi");
unit_label.innerHTML = "Pixels per Inch: " + slider.value;
const unit_button = document.getElementById("unit");
let unit = "inches";
unit_button.innerHTML = "Unit: " + unit;
unit_button.setAttribute("data-unit", unit);
const toolbar = document.getElementById("toolbar");
var tool = "draw";
var using = false;
function onclick_tool(event){
    tool = tool_change(event,tool,using);
}
toolbar.addEventListener("click",onclick_tool);
slider.addEventListener("input", function(){
    unit_label.innerHTML = "Pixels per Inch: " + slider.value;
});
document.getElementById("zoom").addEventListener("input",function(event){
    let cam_prev = {...cam};
    cam.zoom = slider_to_zoom(event.target.value);
    //shift camera based on zoom origin
    let z_origin_uz = {x: -canvas.scrollWidth / 2,y: -canvas.scrollHeight / 2};
    let z_origin_z = coords_zoomed(z_origin_uz,cam);
    let z_origin_prev_z = coords_zoomed(z_origin_uz,cam_prev);
    cam.x += z_origin_z.x - z_origin_prev_z.x;
    cam.y += z_origin_z.y - z_origin_prev_z.y;
    snap.radius = snap_radius / cam.zoom;
    //console.log(snap.radius);
    //console.log(cam.zoom);
});

function loop() {
    //cam = {x: 0,y: 0,zoom: document.getElementById("zoom").value};
    draw_canvas(canvas,lines,tool,using,mouse,snap,select,cam);
    window.requestAnimationFrame(loop);
}
window.requestAnimationFrame(loop);