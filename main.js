import {lines as draw_lines
       ,highlight as draw_highlight
       ,snap as draw_snap} from "./draw.js";
import { nearest_on_line } from "./nearest_on_line.js";
import {change as tool_change
       ,lines as tool_lines
       ,select as tool_select
       ,snap as tool_snap} from "./tool.js";

//canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.setAttribute("width", canvas.parentNode.offsetWidth);
canvas.setAttribute("height", canvas.parentNode.offsetHeight);

//lines
var mouse = {x:0, y:0};
var lines = [];
var select = {hovering: null, selected: null};
var snap = null;
var snap_radius = 10;
function onclick_canvas(event){
    mouse = {x: event.offsetX, y: event.offsetY};
    //change selection
    if (tool == "select"){
        if (select.selected){
            select.hovering = tool_select(lines,mouse);
        }
        select.selected = select.hovering;
        using = (select.selected);
    }
    else{
        //modify/add/remove lines
        let effect = tool_lines(event,tool,using,lines,select.hovering,snap);
        lines = effect.lines;
        using = effect.using;
        select.hovering = tool_select(lines,mouse);
    }
    snap = tool_snap(select.hovering,mouse,using,lines,snap_radius);
    //using = !using;
    //console.log(lines);
    //console.log("select: " + toString(select));
}
function onmousemove_canvas(event){
    mouse = {x: event.offsetX, y: event.offsetY};
    if (!select.selected){
        select.hovering = tool_select(lines,mouse);
        snap = tool_snap(select.hovering,mouse,using,lines,snap_radius);
    }
}
canvas.addEventListener("click",onclick_canvas);
canvas.addEventListener("mousemove",onmousemove_canvas);

//toolbar
const toolbar = document.getElementById("toolbar");
var tool = "draw";
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
        draw_highlight(ctx,select.hovering);
    }
    else{
        draw_snap(ctx,snap);
    }
    ctx.stroke();

    window.requestAnimationFrame(loop);
}
window.requestAnimationFrame(loop);