import { get_delta_angle } from "./get_delta_angle.js";
import { get_px_per_unit, px_to_unit
        ,unit_to_px} from "./scaling.js";

export function lines(ctx,_lines,drawing,snap,cam){
    let lines = [..._lines];
    lines.forEach((line,index) => {
        let end = {}
        if (drawing && index == lines.length-1){
            end = drawing;
            if (snap.coords){
                end = snap.coords;
            }
        }
        else{
            end = line.b;
        }
        cam_line(ctx,{a: {x: line.a.x,y: line.a.y},b: {x: end.x,y: end.y}},cam);
    });
}
function cam_line(ctx,line,cam){
    let a = {...line.a};
    let b = {...line.b};
    let zoom = cam.zoom;
    a.x = (a.x - cam.x) * zoom;
    a.y = (a.y - cam.y) * zoom;
    b.x = (b.x - cam.x) * zoom;
    b.y = (b.y - cam.y) * zoom;
    ctx.moveTo(a.x,a.y);
    ctx.lineTo(b.x,b.y);
}
export function highlight(ctx,line,color,cam){
    if (line){
        ctx.stroke();
        let last_width = ctx.lineWidth;
        let last_color = ctx.strokeStyle;
        ctx.lineWidth = 4;
        ctx.strokeStyle = color;
        ctx.beginPath();
        cam_line(ctx,line,cam);
        ctx.stroke();
        ctx.lineWidth = last_width;
        ctx.strokeStyle = last_color;
        ctx.beginPath();
    }
}
export function snap(ctx,snap,cam){
    if (!snap.hide && snap.coords){
        let coords = snap.coords;
        let snap_radius = 10;
        let snap_width = 2;
        let snap_color = "RoyalBlue";
        ctx.stroke();
        let last_color = ctx.strokeStyle;
        let last_width = ctx.lineWidth;
        ctx.lineWidth = snap_width;
        ctx.strokeStyle = snap_color;
        ctx.beginPath();
        cam_arc(ctx,{x: coords.x,y: coords.y, radius: snap_radius},cam);
        ctx.stroke();
        ctx.strokeStyle = last_color;
        ctx.lineWidth = last_width;
        ctx.beginPath();
    }
}
function cam_arc(ctx,circle,cam){
    let x = circle.x;
    let y = circle.y;
    let zoom = cam.zoom;
    x = (x - cam.x) * zoom;
    y = (y - cam.y) * zoom;
    ctx.moveTo(x + circle.radius,y);
    ctx.arc(x,y,circle.radius,0,2*Math.PI);
}
export function canvas(canvas,_lines,tool,using,mouse,_snap,select,cam){
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.beginPath();
    lines(ctx,_lines,(tool == "draw" && using) ? mouse : null,_snap,cam);
    if (tool != "draw"){
        highlight(ctx,select.hovering,"black",cam)
        highlight(ctx,select.selected,"orchid",cam);
    }
    else{
        snap(ctx,_snap,cam);
    }
    ctx.stroke();
}