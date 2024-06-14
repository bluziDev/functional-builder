import { get_delta_angle } from "./get_delta_angle.js";
export function lines(ctx,_lines,drawing,snap){
    let lines = [..._lines];
    lines.forEach((line,index) => {
        let end = {}
        if (drawing && index == lines.length-1){
            end = drawing;
            if (snap.modifiers.length > 0){
                snap.modifiers.forEach(mod => {
                    if (mod.id == "line_angle"){
                        //project endpoint onto angle
                        let ang = -parseFloat(mod.value)*(Math.PI/180);
                        let a = {x: end.x - line.a.x,y: end.y - line.a.y};
                        let b = {x: Math.cos(ang),y: Math.sin(ang)};
                        let length = a.x * b.x + a.y * b.y;
                        end = {x: line.a.x + length * b.x
                              ,y: line.a.y + length * b.y};
                    }
                });
            }
            else if (snap.coords){
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
    if (snap){
        let snap_radius = 10;
        let snap_width = 2;
        let snap_color = "RoyalBlue";
        ctx.stroke();
        let last_color = ctx.strokeStyle;
        let last_width = ctx.lineWidth;
        ctx.lineWidth = snap_width;
        ctx.strokeStyle = snap_color;
        ctx.beginPath();
        ctx.moveTo(snap.x+snap_radius,snap.y);
        ctx.arc(snap.x,snap.y,snap_radius,0,2*Math.PI);
        ctx.stroke();
        ctx.strokeStyle = last_color;
        ctx.lineWidth = last_width;
        ctx.beginPath();
    }
}