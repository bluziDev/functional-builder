
export function open(line){
    let menu = document.createElement("div");
    menu.className="line_menu";
    let move = document.createElement("BUTTON");
    move.className = "line_button";
    move.id = "line_move";
    move.innerHTML = "Move";
    menu.appendChild(move);
    let board = document.getElementById("board");
    board.insertBefore(menu,document.getElementById("canvas"));
    menu.style.top=String((line.a.y+line.b.y)/2) + "px";
    menu.style.left=String((line.a.x+line.b.x)/2) + "px";
    console.log(menu.style);
    return menu;
}
export function close(menu){
    menu.remove();
}