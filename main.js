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

//canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.setAttribute("width", canvas.parentNode.offsetWidth);
canvas.setAttribute("height", canvas.parentNode.offsetHeight);

//lines
var mouse = {x: 0,y: 0,focus: null};
var mouse_prev = {...mouse};
var lines = [];
var select = {hovering: null, selected: null};
var line_menu;
var snap_menu = null;
var line_effect = {effect: ""};
var snap = {coords: null,modifiers: [],hide: false,radius: 10};
var snap_radius = 10;
function onclick_canvas(event){
    mouse = {x: event.offsetX, y: event.offsetY};
    //change selection
    if (tool == "select"){
        //selection_change();
        if (line_effect.effect){
            select.hovering = tool_select(lines,mouse);
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
                line_menu = menu_open(select.selected);
                line_menu.addEventListener("click",function(event){
                    let click_effect = onclick_linebutton(event,select.selected);
                    line_effect.effect = click_effect.effect;
                    if (click_effect.close){
                        menu_close(line_menu);
                    }
                    mouse.focus = event.target;
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
        select.hovering = tool_select(lines,mouse);
        if (snap_menu && snap.modifiers.length == 0){
            snap_menu.remove();
            snap_menu = null;
        }
        console.log(lines);
    }
    snap = tool_snap(select.hovering,mouse,using,lines,snap_radius,snap);
}
function onmousemove_canvas(event){
    mouse = {x: event.offsetX,y: event.offsetY,focus: event.target};
    if (!line_effect.effect){
        select.hovering = tool_select(lines,mouse);
        snap = tool_snap(select.hovering,mouse,using,lines,snap_radius,snap);
    }
    else{
        if (line_effect.effect == "move"){
            if (mouse.focus == event.target){
                line_move(select.selected,{x: mouse.x-mouse_prev.x
                                        ,y: mouse.y-mouse_prev.y});
                console.log("effect applied");
            }
        }
    }
    mouse_prev = {...mouse};
}
function onmouseleave_canvas(event){
    select.hovering = null;
    //snap.coords = null;
}
function onkey(event){
    let key = event.key;
    if (snap_is_modkey(key)){
        if (tool == "draw" && using){
            if (!snap_menu){
                snap_menu = document.createElement("div");
                snap_menu.className = "snap_menu";
                let board = document.getElementById("board");
                board.insertBefore(snap_menu,canvas);
                snap_menu.style.top = String(mouse.y) + "px";
                snap_menu.style.left = String(mouse.x) + "px";
            }
            snap.modifiers = snap_mod_toggle(canvas,key,snap,mouse,lines,snap_menu);
            snap = tool_snap(select.hovering,mouse,using,lines,snap_radius,snap);
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
canvas.addEventListener("click",onclick_canvas);
canvas.addEventListener("mousemove",onmousemove_canvas);
canvas.addEventListener("mouseenter",onmousemove_canvas);
canvas.addEventListener("mouseleave",onmouseleave_canvas);
window.addEventListener("keydown",onkey);
//toolbar
const toolbar = document.getElementById("toolbar");
var tool = "draw";
var using = false;
function onclick_tool(event){
    tool = tool_change(event,tool,using);
}
toolbar.addEventListener("click",onclick_tool);

function loop() {
    draw_canvas(canvas,lines,tool,using,mouse,snap,select);
    window.requestAnimationFrame(loop);
}
window.requestAnimationFrame(loop);