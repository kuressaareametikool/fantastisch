export function print(value = '<br>') {
  document.getElementsByTagName(
    "body"
  )[0].innerHTML += value
}
