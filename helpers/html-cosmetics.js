function bold(text) {
  var bold = /\*\*(.*?)\*\*/gm;
  var html = text.replace(bold, "<strong>$1</strong>");
  return html;
}
function removeCosmetics(text) {
  var bold = /\*\*(.*?)\*\*/gm;
  var html = text.replace(bold, "$1");
  return html;
}
function newLine(str) {
  str = str.replace(/(?:\r\n|\r|\n)/g, "<br>");
  return str;
}

function adjustHtml(text) {
  text = bold(text);
  text = newLine(text);
  return text;
}

export { bold, newLine, adjustHtml, removeCosmetics };
