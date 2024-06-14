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
var snap = {coords: null, modifiers: []};
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
    snap.coords = tool_snap(select.hovering,mouse,using,lines,snap_radius);
    //using = !using;
    //console.log(lines);
    //console.log("select: " + toString(select));
}
function onmousemove_canvas(event){
    mouse = {x: event.offsetX, y: event.offsetY};
    if (!line_effect.effect){
        select.hovering = tool_select(lines,mouse);
        snap.coords = tool_snap(select.hovering,mouse,using,lines,snap_radius);
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
    snap.coords = null;
}
function onkey(event){
    if (mouse_focus.focus == canvas){
        let key = event.key;
        if (key == "a"){
            if (tool == "draw" && using){
                let line_input = document.createElement("input");
                snap.modifiers.push(line_input);
                line_input.type = "text";
                line_input.className = "line_button"
                line_input.id = "line_angle";
                line_input.style.top = String(mouse.y) + "px";
                line_input.style.left = String(mouse.x) + "px";
                let board = document.getElementById("board");
                board.insertBefore(line_input,canvas);
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
        draw_snap(ctx,snap.coords);
    }
    ctx.stroke();

    window.requestAnimationFrame(loop);
}
window.requestAnimationFrame(loop);