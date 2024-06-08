export function lines(ctx,_lines,drawing,snap){
    let lines = [..._lines];
    lines.forEach((line,index) => {
        let end = {}
        if (drawing && index == lines.length-1){
            if (snap){
                end = snap;
            }
            else{
                end = drawing;
            }
        }
        else{
            end = line.b;
        }
        ctx.moveTo(line.a.x,line.a.y);
        ctx.lineTo(end.x,end.y);
    });
}
export function highlight(ctx,line){
    if (line){
        ctx.stroke();
        let last_width = ctx.lineWidth;
        let last_color = ctx.strokeStyle;
        ctx.lineWidth = 4;
        ctx.strokeStyle = "orchid";
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