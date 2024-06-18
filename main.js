import {lines as draw_lines
       ,highlight as draw_highlight
       ,snap as draw_snap} from "./draw.js";
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
       ,populate_input as snap_populate_input} from "./snap.js";

//canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.setAttribute("width", canvas.parentNode.offsetWidth);
canvas.setAttribute("height", canvas.parentNode.offsetHeight);

//lines
var mouse = {x:0, y:0};
var mouse_prev = {...mouse};
var mouse_focus = {focus: null};
var lines = [];
var select = {hovering: null, selected: null};
var line_menu;
var line_effect = {effect: ""};
var snap = {coords: null,modifiers: [],hide: false};
var snap_radius = 10;
var line_input = null;
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
                    mouse_focus.focus = event.target;
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
    }
    snap = tool_snap(select.hovering,mouse,using,lines,snap_radius,snap);
    //using = !using;
    //console.log(lines);
    //console.log("select: " + toString(select));
}
function onmousemove_canvas(event){
    mouse = {x: event.offsetX, y: event.offsetY};
    if (!line_effect.effect){
        select.hovering = tool_select(lines,mouse);
        snap = tool_snap(select.hovering,mouse,using,lines,snap_radius,snap);
    }
    else{
        if (line_effect.effect == "move"){
            if (mouse_focus.focus == event.target){
                line_move(select.selected,{x: mouse.x-mouse_prev.x
                                        ,y: mouse.y-mouse_prev.y});
            }
        }
    }
    mouse_focus.focus = event.target;
    mouse_prev = {...mouse};
}
function onmouseleave_canvas(event){
    select.hovering = null;
    //snap.coords = null;
}
function onkey(event){
    if (mouse_focus.focus == canvas){
        let key = event.key;
        if (tool == "draw" && using){
            if (snap_is_modkey(key)){
                let id = snap_get_modid(key);
                let mod = document.getElementById(id);
                if (!snap.modifiers.includes(mod)){
                    let line_input = document.createElement("input");
                    line_input.id = id;
                    snap.modifiers = snap_add_mod(snap.modifiers,line_input);
                    line_input.type = "text";
                    line_input.className = "line_button"
                    line_input.style.top = String(mouse.y) + "px";
                    line_input.style.left = String(mouse.x) + "px";
                    let board = document.getElementById("board");
                    board.insertBefore(line_input,canvas);
                    line_input.value = snap_populate_input(id,lines,mouse,snap);
                    line_input.addEventListener("keyup", function(){
                        snap = tool_snap(select.hovering,mouse,using,lines,snap_radius,snap);
                    });
                    line_input.addEventListener("input", function(event){
                        console.log("input was detected");
                        let rgx = /^[0-9]*\.?[0-9]*$/;
                        let target = event.target;
                        let val = target.value;
                        let match = val.match(rgx);
                        if (!match){
                            target.value = val.substring(0,val.length - 1);
                        }
                    });
                }
                else{
                    snap.modifiers.splice(snap.modifiers.indexOf(mod),1);
                    mod.remove();
                }
            }
            snap = tool_snap(select.hovering,mouse,using,lines,snap_radius,snap);
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
var tool_sub = "";
var using = false;
function onclick_tool(event){
    if (event.target.tagName == "BUTTON"){
        document.getElementById(tool).className = "tool";
        tool = tool_change(event,tool,using);
        document.getElementById(tool).className = "tool_pressed";
        //console.log(tool);
    }
}
toolbar.addEventListener("click",onclick_tool);

function loop() {
    //draw
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.beginPath();
    draw_lines(ctx,lines,(tool == "draw" && using) ? mouse : null,snap);
    if (tool != "draw"){
        draw_highlight(ctx,select.hovering,"black")
        draw_highlight(ctx,select.selected,"orchid");
    }
    else{
        draw_snap(ctx,snap);
    }
    ctx.stroke();

    window.requestAnimationFrame(loop);
}
window.requestAnimationFrame(loop);