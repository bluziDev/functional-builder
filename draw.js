export function lines(ctx,_lines,drawing){
    let lines = [..._lines];
    lines.forEach((line,index) => {
        let end = {}
        if (drawing && index == lines.length-1){
            end.x = drawing.x;
            end.y = drawing.y;
        }
        else{
            end.x = line.b.x;
            end.y = line.b.y;
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
        ctx.strokeStyle = "pink";
        ctx.beginPath();
        ctx.moveTo(line.a.x,line.a.y);
        ctx.lineTo(line.b.x,line.b.y);
        ctx.stroke();
        ctx.lineWidth = last_width;
        ctx.strokeStyle = last_color;
        ctx.beginPath();
    }
}