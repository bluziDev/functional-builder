import {coords_zoomed,coords_unzoomed} from "./zooming.js";

export function open(line,cam){
    let menu = document.createElement("div");
    menu.className="line_menu";
    let move = document.createElement("BUTTON");
    move.className = "line_button";
    move.id = "line_move";
    move.innerHTML = "Move";
    menu.appendChild(move);
    let board = document.getElementById("board");
    board.insertBefore(menu,document.getElementById("canvas"));
    let center_unzoomed = coords_unzoomed({x: (line.a.x+line.b.x)/2,y: (line.a.y+line.b.y)/2},cam);
    menu.style.left=String(center_unzoomed.x) + "px";
    menu.style.top=String(center_unzoomed.y) + "px";
    //console.log(menu.style);
    return menu;
}
export function close(menu){
    menu.remove();
}