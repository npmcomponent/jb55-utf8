
/**
 * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Base64_encoding_and_decoding
 * for more information
 */

exports = module.exports;

/**
 * encode a utf-8 string to base64
 *
 * @param {Function} fn
 * @api public
 */

exports.encode = function(str){
  return window.btoa(unescape(encodeURIComponent(str)));
};

/**
 * decode base64 to a utf-8 string
 *
 * @param {Function} fn
 * @api public
 */

exports.decode = function(str){
  return decodeURIComponent(escape(window.atob(str)));
};
