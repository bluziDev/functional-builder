
export function px_to_unit(length_in_px){
    let label = document.getElementById("unit");
    let unit = label.getAttribute("data-unit");
    let px_per_unit = get_px_per_unit(unit);
    let length_in_units = length_in_px / px_per_unit;
    return length_in_units;
}
export function unit_to_px(length_in_units){
    let label = document.getElementById("unit");
    let unit = label.getAttribute("data-unit");
    let px_per_unit = get_px_per_unit(unit);
    let length_in_px = length_in_units * px_per_unit;
    return length_in_px;
}
export function get_px_per_unit(unit){
    let slider = document.getElementById("ppi");
    let ppi = slider.value;
    let pp_unit;
    if (unit == "inches"){
        pp_unit = ppi;
    }
    return pp_unit;
}