/*

import { random } from "./helpers.js";

  Generate a random number between "from" and "to" values

  Usage:

      random(0,100)

  But default it outputs integer values. To get floating point value use:

      random(0,100, true)

*/

export function random(from, to, float = false) {
  const r = from + Math.random() * (to - from);
  return float ? r : Math.floor(r, 2);
}

export function print(value) {
  document.getElementsByTagName(
    "body"
  )[0].innerHTML += value
}
