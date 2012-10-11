module.exports.escapeUnicode = function(str) {
  return str.replace(/[\u0080-\uffff]/g, function (char) {
    return '\\u' + ('0000' + char.charCodeAt(0).toString(16)).slice(-4);
  });
}

