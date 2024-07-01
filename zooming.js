
export function coords_zoomed(raw,cam){
    let x = raw.x;
    let y = raw.y;
    x = x / cam.zoom + cam.x;
    y = y / cam.zoom + cam.y;
    let zoomed = {x: x,y: y};
    return zoomed;
}
export function coords_unzoomed(zoomed,cam){
    let x = zoomed.x;
    let y = zoomed.y;
    x = (x - cam.x) * cam.zoom;
    y = (y - cam.y) * cam.zoom;
    let raw = {x: x,y: y};
    return raw;
}
export function pan(cam,prev,curr){
    let new_cam = {...cam};
    let new_curr = {...curr};
    if (cam.panning){
        new_cam.x += (prev.x - curr.x);
        new_cam.y += (prev.y - curr.y);
        new_curr = {...prev};
    }
    return {cam: new_cam,mouse: new_curr};
}