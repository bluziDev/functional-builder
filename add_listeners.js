import {onclick_draw,onclick_select,onclick_remove} from "./main.js";

export function add_listeners(){
    let button_draw = document.getElementById("draw");
    let button_select = document.getElementById("select");
    let button_remove = document.getElementById("remove");
    button_draw.addEventListener("click",onclick_draw);
    button_select.addEventListener("click",onclick_select);
    button_remove.addEventListener("click",onclick_remove);
}