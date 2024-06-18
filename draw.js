import { get_delta_angle } from "./get_delta_angle.js";
export function lines(ctx,_lines,drawing,snap){
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
        ctx.moveTo(line.a.x,line.a.y);
        ctx.lineTo(end.x,end.y);
    });
}
export function highlight(ctx,line,color){
    if (line){
        ctx.stroke();
        let last_width = ctx.lineWidth;
        let last_color = ctx.strokeStyle;
        ctx.lineWidth = 4;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(line.a.x,line.a.y);
        ctx.lineTo(line.b.x,line.b.y);
        ctx.stroke();
        ctx.lineWidth = last_width;
        ctx.strokeStyle = last_color;
        ctx.beginPath();
    }
}
export function snap(ctx,snap){
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
        ctx.moveTo(coords.x+snap_radius,coords.y);
        ctx.arc(coords.x,coords.y,snap_radius,0,2*Math.PI);
        ctx.stroke();
        ctx.strokeStyle = last_color;
        ctx.lineWidth = last_width;
        ctx.beginPath();
    }
}
export function canvas(canvas,_lines,tool,using,mouse,_snap,select){
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.beginPath();
    lines(ctx,_lines,(tool == "draw" && using) ? mouse : null,_snap);
    if (tool != "draw"){
        highlight(ctx,select.hovering,"black")
        highlight(ctx,select.selected,"orchid");
    }
    else{
        snap(ctx,_snap);
    }
    ctx.stroke();
}