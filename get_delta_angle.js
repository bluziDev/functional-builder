export function get_delta_angle(current,target) {
    var TAU = 2 * Math.PI;
    var mod = function (a, n) { return ( a % n + n ) % n; } // modulo
    var equivalent = function (a) { return mod(a + Math.PI, TAU) - Math.PI } // [-π, +π]
    return equivalent(target - current);
  };