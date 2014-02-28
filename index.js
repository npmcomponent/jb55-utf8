/**
 * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Base64_encoding_and_decoding
 * for more information
 */

var b64 = require('jb55-base64');

exports = module.exports;

/**
 * encode a utf-8 string to base64
 *
 * @param {string} utf8 string
 * @api public
 */

exports.encode = function(str){
  return b64.encode(unescape(encodeURIComponent(str)));
};

/**
 * decode base64 to a utf-8 string
 *
 * @param {string} base64 string
 * @api public
 */

exports.decode = function(str){
  return decodeURIComponent(escape(b64.decode(str)));
};
