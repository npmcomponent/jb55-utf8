

/**
 * hasOwnProperty.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);
  var index = path + '/index.js';

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (has.call(require.modules, path)) return path;
  }

  if (has.call(require.aliases, index)) {
    return require.aliases[index];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!has.call(require.modules, from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return has.call(require.modules, localRequire.resolve(path));
  };

  return localRequire;
};
require.register("component-bind/index.js", Function("exports, require, module",
"/**\n\
 * Slice reference.\n\
 */\n\
\n\
var slice = [].slice;\n\
\n\
/**\n\
 * Bind `obj` to `fn`.\n\
 *\n\
 * @param {Object} obj\n\
 * @param {Function|String} fn or string\n\
 * @return {Function}\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(obj, fn){\n\
  if ('string' == typeof fn) fn = obj[fn];\n\
  if ('function' != typeof fn) throw new Error('bind() requires a function');\n\
  var args = slice.call(arguments, 2);\n\
  return function(){\n\
    return fn.apply(obj, args.concat(slice.call(arguments)));\n\
  }\n\
};\n\
//@ sourceURL=component-bind/index.js"
));
require.register("jb55-base64/index.js", Function("exports, require, module",
"var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';\n\
var bind = require('bind')\n\
\n\
/**\n\
 * Match a normal browsers error\n\
 */\n\
function InvalidCharacterError(message) {\n\
  this.message = message;\n\
}\n\
InvalidCharacterError.prototype = new Error;\n\
InvalidCharacterError.prototype.name = 'InvalidCharacterError';\n\
\n\
/**\n\
 * btoa - encode a binary string to base64\n\
 *\n\
 * @param {String} String with binary data\n\
 * @api public\n\
 */\n\
\n\
function btoa(input) {\n\
  var block;\n\
  var charCode;\n\
  var output = \"\";\n\
  var map = chars;\n\
  var idx = 0;\n\
\n\
  for (; input.charAt(idx | 0) || (map = '=', idx % 1);\n\
         output += map.charAt(63 & block >> 8 - idx % 1 * 8)) \n\
  {\n\
    charCode = input.charCodeAt(idx += 3/4);\n\
\n\
    if (charCode > 0xFF) \n\
      throw new InvalidCharacterError( \"'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.\");\n\
\n\
    block = block << 8 | charCode;\n\
  }\n\
\n\
  return output;\n\
}\n\
\n\
/**\n\
 * decode a base64 string to binary\n\
 *\n\
 * @param {String} base64 string\n\
 * @api public\n\
 */\n\
\n\
function atob(input) {\n\
  input = input.replace(/=+$/, '');\n\
  if (input.length % 4 == 1) {\n\
    throw new InvalidCharacterError(\"'atob' failed: The string to be decoded is not correctly encoded.\");\n\
  }\n\
  var output = \"\";\n\
\n\
  for (\n\
    // initialize result and counters\n\
    var bc = 0, bs, buffer, idx = 0;\n\
    // get next character\n\
    buffer = input.charAt(idx++);\n\
    // character found in table? initialize bit storage and add its ascii value;\n\
    ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,\n\
      // and if not first of each 4 characters,\n\
      // convert the first 8 bits to one ascii character\n\
      bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0\n\
  ) {\n\
    // try to find character in table (0-63, not found => -1)\n\
    buffer = chars.indexOf(buffer);\n\
  }\n\
  return output;\n\
}\n\
\n\
var watob = window.atob? bind(null, window.atob) : null;\n\
var wbtoa = window.btoa? bind(null, window.btoa) : null;\n\
\n\
var exports = module.exports;\n\
exports.atob = exports.decode = watob || atob;\n\
exports.btoa = exports.encode = wbtoa || btoa;\n\
\n\
/**\n\
 * Export polyfills for testing\n\
 */\n\
var poly = exports.poly = {};\n\
poly.atob = poly.decode = atob;\n\
poly.btoa = poly.encode = btoa;\n\
//@ sourceURL=jb55-base64/index.js"
));
require.register("jb55-expect.js/index.js", Function("exports, require, module",
"(function (global, module) {\n\
\n\
  var exports = module.exports;\n\
\n\
  /**\n\
   * Exports.\n\
   */\n\
\n\
  module.exports = expect;\n\
  expect.Assertion = Assertion;\n\
\n\
  /**\n\
   * Exports version.\n\
   */\n\
\n\
  expect.version = '0.3.1';\n\
\n\
  /**\n\
   * Possible assertion flags.\n\
   */\n\
\n\
  var flags = {\n\
      not: ['to', 'be', 'have', 'include', 'only']\n\
    , to: ['be', 'have', 'include', 'only', 'not']\n\
    , only: ['have']\n\
    , have: ['own']\n\
    , be: ['an']\n\
  };\n\
\n\
  function expect (obj) {\n\
    return new Assertion(obj);\n\
  }\n\
\n\
  /**\n\
   * Constructor\n\
   *\n\
   * @api private\n\
   */\n\
\n\
  function Assertion (obj, flag, parent) {\n\
    this.obj = obj;\n\
    this.flags = {};\n\
\n\
    if (undefined != parent) {\n\
      this.flags[flag] = true;\n\
\n\
      for (var i in parent.flags) {\n\
        if (parent.flags.hasOwnProperty(i)) {\n\
          this.flags[i] = true;\n\
        }\n\
      }\n\
    }\n\
\n\
    var $flags = flag ? flags[flag] : keys(flags)\n\
      , self = this;\n\
\n\
    if ($flags) {\n\
      for (var i = 0, l = $flags.length; i < l; i++) {\n\
        // avoid recursion\n\
        if (this.flags[$flags[i]]) continue;\n\
\n\
        var name = $flags[i]\n\
          , assertion = new Assertion(this.obj, name, this)\n\
\n\
        if ('function' == typeof Assertion.prototype[name]) {\n\
          // clone the function, make sure we dont touch the prot reference\n\
          var old = this[name];\n\
          this[name] = function () {\n\
            return old.apply(self, arguments);\n\
          };\n\
\n\
          for (var fn in Assertion.prototype) {\n\
            if (Assertion.prototype.hasOwnProperty(fn) && fn != name) {\n\
              this[name][fn] = bind(assertion[fn], assertion);\n\
            }\n\
          }\n\
        } else {\n\
          this[name] = assertion;\n\
        }\n\
      }\n\
    }\n\
  }\n\
\n\
  /**\n\
   * Performs an assertion\n\
   *\n\
   * @api private\n\
   */\n\
\n\
  Assertion.prototype.assert = function (truth, msg, error, expected) {\n\
    var msg = this.flags.not ? error : msg\n\
      , ok = this.flags.not ? !truth : truth\n\
      , err;\n\
\n\
    if (!ok) {\n\
      err = new Error(msg.call(this));\n\
      if (arguments.length > 3) {\n\
        err.actual = this.obj;\n\
        err.expected = expected;\n\
        err.showDiff = true;\n\
      }\n\
      throw err;\n\
    }\n\
\n\
    this.and = new Assertion(this.obj);\n\
  };\n\
\n\
  /**\n\
   * Check if the value is truthy\n\
   *\n\
   * @api public\n\
   */\n\
\n\
  Assertion.prototype.ok = function () {\n\
    this.assert(\n\
        !!this.obj\n\
      , function(){ return 'expected ' + i(this.obj) + ' to be truthy' }\n\
      , function(){ return 'expected ' + i(this.obj) + ' to be falsy' });\n\
  };\n\
\n\
  /**\n\
   * Creates an anonymous function which calls fn with arguments.\n\
   *\n\
   * @api public\n\
   */\n\
\n\
  Assertion.prototype.withArgs = function() {\n\
    expect(this.obj).to.be.a('function');\n\
    var fn = this.obj;\n\
    var args = Array.prototype.slice.call(arguments);\n\
    return expect(function() { fn.apply(null, args); });\n\
  };\n\
\n\
  /**\n\
   * Assert that the function throws.\n\
   *\n\
   * @param {Function|RegExp} callback, or regexp to match error string against\n\
   * @api public\n\
   */\n\
\n\
  Assertion.prototype.throwError =\n\
  Assertion.prototype.throwException = function (fn) {\n\
    expect(this.obj).to.be.a('function');\n\
\n\
    var thrown = false\n\
      , not = this.flags.not;\n\
\n\
    try {\n\
      this.obj();\n\
    } catch (e) {\n\
      if (isRegExp(fn)) {\n\
        var subject = 'string' == typeof e ? e : e.message;\n\
        if (not) {\n\
          expect(subject).to.not.match(fn);\n\
        } else {\n\
          expect(subject).to.match(fn);\n\
        }\n\
      } else if ('function' == typeof fn) {\n\
        fn(e);\n\
      }\n\
      thrown = true;\n\
    }\n\
\n\
    if (isRegExp(fn) && not) {\n\
      // in the presence of a matcher, ensure the `not` only applies to\n\
      // the matching.\n\
      this.flags.not = false;\n\
    }\n\
\n\
    var name = this.obj.name || 'fn';\n\
    this.assert(\n\
        thrown\n\
      , function(){ return 'expected ' + name + ' to throw an exception' }\n\
      , function(){ return 'expected ' + name + ' not to throw an exception' });\n\
  };\n\
\n\
  /**\n\
   * Checks if the array is empty.\n\
   *\n\
   * @api public\n\
   */\n\
\n\
  Assertion.prototype.empty = function () {\n\
    var expectation;\n\
\n\
    if ('object' == typeof this.obj && null !== this.obj && !isArray(this.obj)) {\n\
      if ('number' == typeof this.obj.length) {\n\
        expectation = !this.obj.length;\n\
      } else {\n\
        expectation = !keys(this.obj).length;\n\
      }\n\
    } else {\n\
      if ('string' != typeof this.obj) {\n\
        expect(this.obj).to.be.an('object');\n\
      }\n\
\n\
      expect(this.obj).to.have.property('length');\n\
      expectation = !this.obj.length;\n\
    }\n\
\n\
    this.assert(\n\
        expectation\n\
      , function(){ return 'expected ' + i(this.obj) + ' to be empty' }\n\
      , function(){ return 'expected ' + i(this.obj) + ' to not be empty' });\n\
    return this;\n\
  };\n\
\n\
  /**\n\
   * Checks if the obj exactly equals another.\n\
   *\n\
   * @api public\n\
   */\n\
\n\
  Assertion.prototype.be =\n\
  Assertion.prototype.equal = function (obj) {\n\
    this.assert(\n\
        obj === this.obj\n\
      , function(){ return 'expected ' + i(this.obj) + ' to equal ' + i(obj) }\n\
      , function(){ return 'expected ' + i(this.obj) + ' to not equal ' + i(obj) });\n\
    return this;\n\
  };\n\
\n\
  /**\n\
   * Checks if the obj sortof equals another.\n\
   *\n\
   * @api public\n\
   */\n\
\n\
  Assertion.prototype.eql = function (obj) {\n\
    this.assert(\n\
        expect.eql(this.obj, obj)\n\
      , function(){ return 'expected ' + i(this.obj) + ' to sort of equal ' + i(obj) }\n\
      , function(){ return 'expected ' + i(this.obj) + ' to sort of not equal ' + i(obj) }\n\
      , obj);\n\
    return this;\n\
  };\n\
\n\
  /**\n\
   * Assert within start to finish (inclusive).\n\
   *\n\
   * @param {Number} start\n\
   * @param {Number} finish\n\
   * @api public\n\
   */\n\
\n\
  Assertion.prototype.within = function (start, finish) {\n\
    var range = start + '..' + finish;\n\
    this.assert(\n\
        this.obj >= start && this.obj <= finish\n\
      , function(){ return 'expected ' + i(this.obj) + ' to be within ' + range }\n\
      , function(){ return 'expected ' + i(this.obj) + ' to not be within ' + range });\n\
    return this;\n\
  };\n\
\n\
  /**\n\
   * Assert typeof / instance of\n\
   *\n\
   * @api public\n\
   */\n\
\n\
  Assertion.prototype.a =\n\
  Assertion.prototype.an = function (type) {\n\
    if ('string' == typeof type) {\n\
      // proper english in error msg\n\
      var n = /^[aeiou]/.test(type) ? 'n' : '';\n\
\n\
      // typeof with support for 'array'\n\
      this.assert(\n\
          'array' == type ? isArray(this.obj) :\n\
            'regexp' == type ? isRegExp(this.obj) :\n\
              'object' == type\n\
                ? 'object' == typeof this.obj && null !== this.obj\n\
                : type == typeof this.obj\n\
        , function(){ return 'expected ' + i(this.obj) + ' to be a' + n + ' ' + type }\n\
        , function(){ return 'expected ' + i(this.obj) + ' not to be a' + n + ' ' + type });\n\
    } else {\n\
      // instanceof\n\
      var name = type.name || 'supplied constructor';\n\
      this.assert(\n\
          this.obj instanceof type\n\
        , function(){ return 'expected ' + i(this.obj) + ' to be an instance of ' + name }\n\
        , function(){ return 'expected ' + i(this.obj) + ' not to be an instance of ' + name });\n\
    }\n\
\n\
    return this;\n\
  };\n\
\n\
  /**\n\
   * Assert numeric value above _n_.\n\
   *\n\
   * @param {Number} n\n\
   * @api public\n\
   */\n\
\n\
  Assertion.prototype.greaterThan =\n\
  Assertion.prototype.above = function (n) {\n\
    this.assert(\n\
        this.obj > n\n\
      , function(){ return 'expected ' + i(this.obj) + ' to be above ' + n }\n\
      , function(){ return 'expected ' + i(this.obj) + ' to be below ' + n });\n\
    return this;\n\
  };\n\
\n\
  /**\n\
   * Assert numeric value below _n_.\n\
   *\n\
   * @param {Number} n\n\
   * @api public\n\
   */\n\
\n\
  Assertion.prototype.lessThan =\n\
  Assertion.prototype.below = function (n) {\n\
    this.assert(\n\
        this.obj < n\n\
      , function(){ return 'expected ' + i(this.obj) + ' to be below ' + n }\n\
      , function(){ return 'expected ' + i(this.obj) + ' to be above ' + n });\n\
    return this;\n\
  };\n\
\n\
  /**\n\
   * Assert string value matches _regexp_.\n\
   *\n\
   * @param {RegExp} regexp\n\
   * @api public\n\
   */\n\
\n\
  Assertion.prototype.match = function (regexp) {\n\
    this.assert(\n\
        regexp.exec(this.obj)\n\
      , function(){ return 'expected ' + i(this.obj) + ' to match ' + regexp }\n\
      , function(){ return 'expected ' + i(this.obj) + ' not to match ' + regexp });\n\
    return this;\n\
  };\n\
\n\
  /**\n\
   * Assert property \"length\" exists and has value of _n_.\n\
   *\n\
   * @param {Number} n\n\
   * @api public\n\
   */\n\
\n\
  Assertion.prototype.length = function (n) {\n\
    expect(this.obj).to.have.property('length');\n\
    var len = this.obj.length;\n\
    this.assert(\n\
        n == len\n\
      , function(){ return 'expected ' + i(this.obj) + ' to have a length of ' + n + ' but got ' + len }\n\
      , function(){ return 'expected ' + i(this.obj) + ' to not have a length of ' + len });\n\
    return this;\n\
  };\n\
\n\
  /**\n\
   * Assert property _name_ exists, with optional _val_.\n\
   *\n\
   * @param {String} name\n\
   * @param {Mixed} val\n\
   * @api public\n\
   */\n\
\n\
  Assertion.prototype.property = function (name, val) {\n\
    if (this.flags.own) {\n\
      this.assert(\n\
          Object.prototype.hasOwnProperty.call(this.obj, name)\n\
        , function(){ return 'expected ' + i(this.obj) + ' to have own property ' + i(name) }\n\
        , function(){ return 'expected ' + i(this.obj) + ' to not have own property ' + i(name) });\n\
      return this;\n\
    }\n\
\n\
    if (this.flags.not && undefined !== val) {\n\
      if (undefined === this.obj[name]) {\n\
        throw new Error(i(this.obj) + ' has no property ' + i(name));\n\
      }\n\
    } else {\n\
      var hasProp;\n\
      try {\n\
        hasProp = name in this.obj\n\
      } catch (e) {\n\
        hasProp = undefined !== this.obj[name]\n\
      }\n\
\n\
      this.assert(\n\
          hasProp\n\
        , function(){ return 'expected ' + i(this.obj) + ' to have a property ' + i(name) }\n\
        , function(){ return 'expected ' + i(this.obj) + ' to not have a property ' + i(name) });\n\
    }\n\
\n\
    if (undefined !== val) {\n\
      this.assert(\n\
          val === this.obj[name]\n\
        , function(){ return 'expected ' + i(this.obj) + ' to have a property ' + i(name)\n\
          + ' of ' + i(val) + ', but got ' + i(this.obj[name]) }\n\
        , function(){ return 'expected ' + i(this.obj) + ' to not have a property ' + i(name)\n\
          + ' of ' + i(val) });\n\
    }\n\
\n\
    this.obj = this.obj[name];\n\
    return this;\n\
  };\n\
\n\
  /**\n\
   * Assert that the array contains _obj_ or string contains _obj_.\n\
   *\n\
   * @param {Mixed} obj|string\n\
   * @api public\n\
   */\n\
\n\
  Assertion.prototype.string =\n\
  Assertion.prototype.contain = function (obj) {\n\
    if ('string' == typeof this.obj) {\n\
      this.assert(\n\
          ~this.obj.indexOf(obj)\n\
        , function(){ return 'expected ' + i(this.obj) + ' to contain ' + i(obj) }\n\
        , function(){ return 'expected ' + i(this.obj) + ' to not contain ' + i(obj) });\n\
    } else {\n\
      this.assert(\n\
          ~indexOf(this.obj, obj)\n\
        , function(){ return 'expected ' + i(this.obj) + ' to contain ' + i(obj) }\n\
        , function(){ return 'expected ' + i(this.obj) + ' to not contain ' + i(obj) });\n\
    }\n\
    return this;\n\
  };\n\
\n\
  /**\n\
   * Assert exact keys or inclusion of keys by using\n\
   * the `.own` modifier.\n\
   *\n\
   * @param {Array|String ...} keys\n\
   * @api public\n\
   */\n\
\n\
  Assertion.prototype.key =\n\
  Assertion.prototype.keys = function ($keys) {\n\
    var str\n\
      , ok = true;\n\
\n\
    $keys = isArray($keys)\n\
      ? $keys\n\
      : Array.prototype.slice.call(arguments);\n\
\n\
    if (!$keys.length) throw new Error('keys required');\n\
\n\
    var actual = keys(this.obj)\n\
      , len = $keys.length;\n\
\n\
    // Inclusion\n\
    ok = every($keys, function (key) {\n\
      return ~indexOf(actual, key);\n\
    });\n\
\n\
    // Strict\n\
    if (!this.flags.not && this.flags.only) {\n\
      ok = ok && $keys.length == actual.length;\n\
    }\n\
\n\
    // Key string\n\
    if (len > 1) {\n\
      $keys = map($keys, function (key) {\n\
        return i(key);\n\
      });\n\
      var last = $keys.pop();\n\
      str = $keys.join(', ') + ', and ' + last;\n\
    } else {\n\
      str = i($keys[0]);\n\
    }\n\
\n\
    // Form\n\
    str = (len > 1 ? 'keys ' : 'key ') + str;\n\
\n\
    // Have / include\n\
    str = (!this.flags.only ? 'include ' : 'only have ') + str;\n\
\n\
    // Assertion\n\
    this.assert(\n\
        ok\n\
      , function(){ return 'expected ' + i(this.obj) + ' to ' + str }\n\
      , function(){ return 'expected ' + i(this.obj) + ' to not ' + str });\n\
\n\
    return this;\n\
  };\n\
\n\
  /**\n\
   * Assert a failure.\n\
   *\n\
   * @param {String ...} custom message\n\
   * @api public\n\
   */\n\
  Assertion.prototype.fail = function (msg) {\n\
    var error = function() { return msg || \"explicit failure\"; }\n\
    this.assert(false, error, error);\n\
    return this;\n\
  };\n\
\n\
  /**\n\
   * Function bind implementation.\n\
   */\n\
\n\
  function bind (fn, scope) {\n\
    return function () {\n\
      return fn.apply(scope, arguments);\n\
    }\n\
  }\n\
\n\
  /**\n\
   * Array every compatibility\n\
   *\n\
   * @see bit.ly/5Fq1N2\n\
   * @api public\n\
   */\n\
\n\
  function every (arr, fn, thisObj) {\n\
    var scope = thisObj || global;\n\
    for (var i = 0, j = arr.length; i < j; ++i) {\n\
      if (!fn.call(scope, arr[i], i, arr)) {\n\
        return false;\n\
      }\n\
    }\n\
    return true;\n\
  }\n\
\n\
  /**\n\
   * Array indexOf compatibility.\n\
   *\n\
   * @see bit.ly/a5Dxa2\n\
   * @api public\n\
   */\n\
\n\
  function indexOf (arr, o, i) {\n\
    if (Array.prototype.indexOf) {\n\
      return Array.prototype.indexOf.call(arr, o, i);\n\
    }\n\
\n\
    if (arr.length === undefined) {\n\
      return -1;\n\
    }\n\
\n\
    for (var j = arr.length, i = i < 0 ? i + j < 0 ? 0 : i + j : i || 0\n\
        ; i < j && arr[i] !== o; i++);\n\
\n\
    return j <= i ? -1 : i;\n\
  }\n\
\n\
  // https://gist.github.com/1044128/\n\
  var getOuterHTML = function(element) {\n\
    if ('outerHTML' in element) return element.outerHTML;\n\
    var ns = \"http://www.w3.org/1999/xhtml\";\n\
    var container = document.createElementNS(ns, '_');\n\
    var xmlSerializer = new XMLSerializer();\n\
    var html;\n\
    if (document.xmlVersion) {\n\
      return xmlSerializer.serializeToString(element);\n\
    } else {\n\
      container.appendChild(element.cloneNode(false));\n\
      html = container.innerHTML.replace('><', '>' + element.innerHTML + '<');\n\
      container.innerHTML = '';\n\
      return html;\n\
    }\n\
  };\n\
\n\
  // Returns true if object is a DOM element.\n\
  var isDOMElement = function (object) {\n\
    if (typeof HTMLElement === 'object') {\n\
      return object instanceof HTMLElement;\n\
    } else {\n\
      return object &&\n\
        typeof object === 'object' &&\n\
        object.nodeType === 1 &&\n\
        typeof object.nodeName === 'string';\n\
    }\n\
  };\n\
\n\
  /**\n\
   * Inspects an object.\n\
   *\n\
   * @see taken from node.js `util` module (copyright Joyent, MIT license)\n\
   * @api private\n\
   */\n\
\n\
  function i (obj, showHidden, depth) {\n\
    var seen = [];\n\
\n\
    function stylize (str) {\n\
      return str;\n\
    }\n\
\n\
    function format (value, recurseTimes) {\n\
      // Provide a hook for user-specified inspect functions.\n\
      // Check that value is an object with an inspect function on it\n\
      if (value && typeof value.inspect === 'function' &&\n\
          // Filter out the util module, it's inspect function is special\n\
          value !== exports &&\n\
          // Also filter out any prototype objects using the circular check.\n\
          !(value.constructor && value.constructor.prototype === value)) {\n\
        return value.inspect(recurseTimes);\n\
      }\n\
\n\
      // Primitive types cannot have properties\n\
      switch (typeof value) {\n\
        case 'undefined':\n\
          return stylize('undefined', 'undefined');\n\
\n\
        case 'string':\n\
          var simple = '\\'' + json.stringify(value).replace(/^\"|\"$/g, '')\n\
                                                   .replace(/'/g, \"\\\\'\")\n\
                                                   .replace(/\\\\\"/g, '\"') + '\\'';\n\
          return stylize(simple, 'string');\n\
\n\
        case 'number':\n\
          return stylize('' + value, 'number');\n\
\n\
        case 'boolean':\n\
          return stylize('' + value, 'boolean');\n\
      }\n\
      // For some reason typeof null is \"object\", so special case here.\n\
      if (value === null) {\n\
        return stylize('null', 'null');\n\
      }\n\
\n\
      if (isDOMElement(value)) {\n\
        return getOuterHTML(value);\n\
      }\n\
\n\
      // Look up the keys of the object.\n\
      var visible_keys = keys(value);\n\
      var $keys = showHidden ? Object.getOwnPropertyNames(value) : visible_keys;\n\
\n\
      // Functions without properties can be shortcutted.\n\
      if (typeof value === 'function' && $keys.length === 0) {\n\
        if (isRegExp(value)) {\n\
          return stylize('' + value, 'regexp');\n\
        } else {\n\
          var name = value.name ? ': ' + value.name : '';\n\
          return stylize('[Function' + name + ']', 'special');\n\
        }\n\
      }\n\
\n\
      // Dates without properties can be shortcutted\n\
      if (isDate(value) && $keys.length === 0) {\n\
        return stylize(value.toUTCString(), 'date');\n\
      }\n\
      \n\
      // Error objects can be shortcutted\n\
      if (value instanceof Error) {\n\
        return stylize(\"[\"+value.toString()+\"]\", 'Error');\n\
      }\n\
\n\
      var base, type, braces;\n\
      // Determine the object type\n\
      if (isArray(value)) {\n\
        type = 'Array';\n\
        braces = ['[', ']'];\n\
      } else {\n\
        type = 'Object';\n\
        braces = ['{', '}'];\n\
      }\n\
\n\
      // Make functions say that they are functions\n\
      if (typeof value === 'function') {\n\
        var n = value.name ? ': ' + value.name : '';\n\
        base = (isRegExp(value)) ? ' ' + value : ' [Function' + n + ']';\n\
      } else {\n\
        base = '';\n\
      }\n\
\n\
      // Make dates with properties first say the date\n\
      if (isDate(value)) {\n\
        base = ' ' + value.toUTCString();\n\
      }\n\
\n\
      if ($keys.length === 0) {\n\
        return braces[0] + base + braces[1];\n\
      }\n\
\n\
      if (recurseTimes < 0) {\n\
        if (isRegExp(value)) {\n\
          return stylize('' + value, 'regexp');\n\
        } else {\n\
          return stylize('[Object]', 'special');\n\
        }\n\
      }\n\
\n\
      seen.push(value);\n\
\n\
      var output = map($keys, function (key) {\n\
        var name, str;\n\
        if (value.__lookupGetter__) {\n\
          if (value.__lookupGetter__(key)) {\n\
            if (value.__lookupSetter__(key)) {\n\
              str = stylize('[Getter/Setter]', 'special');\n\
            } else {\n\
              str = stylize('[Getter]', 'special');\n\
            }\n\
          } else {\n\
            if (value.__lookupSetter__(key)) {\n\
              str = stylize('[Setter]', 'special');\n\
            }\n\
          }\n\
        }\n\
        if (indexOf(visible_keys, key) < 0) {\n\
          name = '[' + key + ']';\n\
        }\n\
        if (!str) {\n\
          if (indexOf(seen, value[key]) < 0) {\n\
            if (recurseTimes === null) {\n\
              str = format(value[key]);\n\
            } else {\n\
              str = format(value[key], recurseTimes - 1);\n\
            }\n\
            if (str.indexOf('\\n\
') > -1) {\n\
              if (isArray(value)) {\n\
                str = map(str.split('\\n\
'), function (line) {\n\
                  return '  ' + line;\n\
                }).join('\\n\
').substr(2);\n\
              } else {\n\
                str = '\\n\
' + map(str.split('\\n\
'), function (line) {\n\
                  return '   ' + line;\n\
                }).join('\\n\
');\n\
              }\n\
            }\n\
          } else {\n\
            str = stylize('[Circular]', 'special');\n\
          }\n\
        }\n\
        if (typeof name === 'undefined') {\n\
          if (type === 'Array' && key.match(/^\\d+$/)) {\n\
            return str;\n\
          }\n\
          name = json.stringify('' + key);\n\
          if (name.match(/^\"([a-zA-Z_][a-zA-Z_0-9]*)\"$/)) {\n\
            name = name.substr(1, name.length - 2);\n\
            name = stylize(name, 'name');\n\
          } else {\n\
            name = name.replace(/'/g, \"\\\\'\")\n\
                       .replace(/\\\\\"/g, '\"')\n\
                       .replace(/(^\"|\"$)/g, \"'\");\n\
            name = stylize(name, 'string');\n\
          }\n\
        }\n\
\n\
        return name + ': ' + str;\n\
      });\n\
\n\
      seen.pop();\n\
\n\
      var numLinesEst = 0;\n\
      var length = reduce(output, function (prev, cur) {\n\
        numLinesEst++;\n\
        if (indexOf(cur, '\\n\
') >= 0) numLinesEst++;\n\
        return prev + cur.length + 1;\n\
      }, 0);\n\
\n\
      if (length > 50) {\n\
        output = braces[0] +\n\
                 (base === '' ? '' : base + '\\n\
 ') +\n\
                 ' ' +\n\
                 output.join(',\\n\
  ') +\n\
                 ' ' +\n\
                 braces[1];\n\
\n\
      } else {\n\
        output = braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];\n\
      }\n\
\n\
      return output;\n\
    }\n\
    return format(obj, (typeof depth === 'undefined' ? 2 : depth));\n\
  }\n\
\n\
  expect.stringify = i;\n\
\n\
  function isArray (ar) {\n\
    return Object.prototype.toString.call(ar) === '[object Array]';\n\
  }\n\
\n\
  function isRegExp(re) {\n\
    var s;\n\
    try {\n\
      s = '' + re;\n\
    } catch (e) {\n\
      return false;\n\
    }\n\
\n\
    return re instanceof RegExp || // easy case\n\
           // duck-type for context-switching evalcx case\n\
           typeof(re) === 'function' &&\n\
           re.constructor.name === 'RegExp' &&\n\
           re.compile &&\n\
           re.test &&\n\
           re.exec &&\n\
           s.match(/^\\/.*\\/[gim]{0,3}$/);\n\
  }\n\
\n\
  function isDate(d) {\n\
    return d instanceof Date;\n\
  }\n\
\n\
  function keys (obj) {\n\
    if (Object.keys) {\n\
      return Object.keys(obj);\n\
    }\n\
\n\
    var keys = [];\n\
\n\
    for (var i in obj) {\n\
      if (Object.prototype.hasOwnProperty.call(obj, i)) {\n\
        keys.push(i);\n\
      }\n\
    }\n\
\n\
    return keys;\n\
  }\n\
\n\
  function map (arr, mapper, that) {\n\
    if (Array.prototype.map) {\n\
      return Array.prototype.map.call(arr, mapper, that);\n\
    }\n\
\n\
    var other= new Array(arr.length);\n\
\n\
    for (var i= 0, n = arr.length; i<n; i++)\n\
      if (i in arr)\n\
        other[i] = mapper.call(that, arr[i], i, arr);\n\
\n\
    return other;\n\
  }\n\
\n\
  function reduce (arr, fun) {\n\
    if (Array.prototype.reduce) {\n\
      return Array.prototype.reduce.apply(\n\
          arr\n\
        , Array.prototype.slice.call(arguments, 1)\n\
      );\n\
    }\n\
\n\
    var len = +this.length;\n\
\n\
    if (typeof fun !== \"function\")\n\
      throw new TypeError();\n\
\n\
    // no value to return if no initial value and an empty array\n\
    if (len === 0 && arguments.length === 1)\n\
      throw new TypeError();\n\
\n\
    var i = 0;\n\
    if (arguments.length >= 2) {\n\
      var rv = arguments[1];\n\
    } else {\n\
      do {\n\
        if (i in this) {\n\
          rv = this[i++];\n\
          break;\n\
        }\n\
\n\
        // if array contains no values, no initial value to return\n\
        if (++i >= len)\n\
          throw new TypeError();\n\
      } while (true);\n\
    }\n\
\n\
    for (; i < len; i++) {\n\
      if (i in this)\n\
        rv = fun.call(null, rv, this[i], i, this);\n\
    }\n\
\n\
    return rv;\n\
  }\n\
\n\
  /**\n\
   * Asserts deep equality\n\
   *\n\
   * @see taken from node.js `assert` module (copyright Joyent, MIT license)\n\
   * @api private\n\
   */\n\
\n\
  expect.eql = function eql(actual, expected) {\n\
    // 7.1. All identical values are equivalent, as determined by ===.\n\
    if (actual === expected) {\n\
      return true;\n\
    } else if ('undefined' != typeof Buffer\n\
      && Buffer.isBuffer(actual) && Buffer.isBuffer(expected)) {\n\
      if (actual.length != expected.length) return false;\n\
\n\
      for (var i = 0; i < actual.length; i++) {\n\
        if (actual[i] !== expected[i]) return false;\n\
      }\n\
\n\
      return true;\n\
\n\
      // 7.2. If the expected value is a Date object, the actual value is\n\
      // equivalent if it is also a Date object that refers to the same time.\n\
    } else if (actual instanceof Date && expected instanceof Date) {\n\
      return actual.getTime() === expected.getTime();\n\
\n\
      // 7.3. Other pairs that do not both pass typeof value == \"object\",\n\
      // equivalence is determined by ==.\n\
    } else if (typeof actual != 'object' && typeof expected != 'object') {\n\
      return actual == expected;\n\
    // If both are regular expression use the special `regExpEquiv` method\n\
    // to determine equivalence.\n\
    } else if (isRegExp(actual) && isRegExp(expected)) {\n\
      return regExpEquiv(actual, expected);\n\
    // 7.4. For all other Object pairs, including Array objects, equivalence is\n\
    // determined by having the same number of owned properties (as verified\n\
    // with Object.prototype.hasOwnProperty.call), the same set of keys\n\
    // (although not necessarily the same order), equivalent values for every\n\
    // corresponding key, and an identical \"prototype\" property. Note: this\n\
    // accounts for both named and indexed properties on Arrays.\n\
    } else {\n\
      return objEquiv(actual, expected);\n\
    }\n\
  };\n\
\n\
  function isUndefinedOrNull (value) {\n\
    return value === null || value === undefined;\n\
  }\n\
\n\
  function isArguments (object) {\n\
    return Object.prototype.toString.call(object) == '[object Arguments]';\n\
  }\n\
\n\
  function regExpEquiv (a, b) {\n\
    return a.source === b.source && a.global === b.global &&\n\
           a.ignoreCase === b.ignoreCase && a.multiline === b.multiline;\n\
  }\n\
\n\
  function objEquiv (a, b) {\n\
    if (isUndefinedOrNull(a) || isUndefinedOrNull(b))\n\
      return false;\n\
    // an identical \"prototype\" property.\n\
    if (a.prototype !== b.prototype) return false;\n\
    //~~~I've managed to break Object.keys through screwy arguments passing.\n\
    //   Converting to array solves the problem.\n\
    if (isArguments(a)) {\n\
      if (!isArguments(b)) {\n\
        return false;\n\
      }\n\
      a = pSlice.call(a);\n\
      b = pSlice.call(b);\n\
      return expect.eql(a, b);\n\
    }\n\
    try{\n\
      var ka = keys(a),\n\
        kb = keys(b),\n\
        key, i;\n\
    } catch (e) {//happens when one is a string literal and the other isn't\n\
      return false;\n\
    }\n\
    // having the same number of owned properties (keys incorporates hasOwnProperty)\n\
    if (ka.length != kb.length)\n\
      return false;\n\
    //the same set of keys (although not necessarily the same order),\n\
    ka.sort();\n\
    kb.sort();\n\
    //~~~cheap key test\n\
    for (i = ka.length - 1; i >= 0; i--) {\n\
      if (ka[i] != kb[i])\n\
        return false;\n\
    }\n\
    //equivalent values for every corresponding key, and\n\
    //~~~possibly expensive deep test\n\
    for (i = ka.length - 1; i >= 0; i--) {\n\
      key = ka[i];\n\
      if (!expect.eql(a[key], b[key]))\n\
         return false;\n\
    }\n\
    return true;\n\
  }\n\
\n\
  var json = (function () {\n\
    \"use strict\";\n\
\n\
    if ('object' == typeof JSON && JSON.parse && JSON.stringify) {\n\
      return {\n\
          parse: nativeJSON.parse\n\
        , stringify: nativeJSON.stringify\n\
      }\n\
    }\n\
\n\
    var JSON = {};\n\
\n\
    function f(n) {\n\
        // Format integers to have at least two digits.\n\
        return n < 10 ? '0' + n : n;\n\
    }\n\
\n\
    function date(d, key) {\n\
      return isFinite(d.valueOf()) ?\n\
          d.getUTCFullYear()     + '-' +\n\
          f(d.getUTCMonth() + 1) + '-' +\n\
          f(d.getUTCDate())      + 'T' +\n\
          f(d.getUTCHours())     + ':' +\n\
          f(d.getUTCMinutes())   + ':' +\n\
          f(d.getUTCSeconds())   + 'Z' : null;\n\
    }\n\
\n\
    var cx = /[\\u0000\\u00ad\\u0600-\\u0604\\u070f\\u17b4\\u17b5\\u200c-\\u200f\\u2028-\\u202f\\u2060-\\u206f\\ufeff\\ufff0-\\uffff]/g,\n\
        escapable = /[\\\\\\\"\\x00-\\x1f\\x7f-\\x9f\\u00ad\\u0600-\\u0604\\u070f\\u17b4\\u17b5\\u200c-\\u200f\\u2028-\\u202f\\u2060-\\u206f\\ufeff\\ufff0-\\uffff]/g,\n\
        gap,\n\
        indent,\n\
        meta = {    // table of character substitutions\n\
            '\\b': '\\\\b',\n\
            '\\t': '\\\\t',\n\
            '\\n\
': '\\\\n\
',\n\
            '\\f': '\\\\f',\n\
            '\\r': '\\\\r',\n\
            '\"' : '\\\\\"',\n\
            '\\\\': '\\\\\\\\'\n\
        },\n\
        rep;\n\
\n\
\n\
    function quote(string) {\n\
\n\
  // If the string contains no control characters, no quote characters, and no\n\
  // backslash characters, then we can safely slap some quotes around it.\n\
  // Otherwise we must also replace the offending characters with safe escape\n\
  // sequences.\n\
\n\
        escapable.lastIndex = 0;\n\
        return escapable.test(string) ? '\"' + string.replace(escapable, function (a) {\n\
            var c = meta[a];\n\
            return typeof c === 'string' ? c :\n\
                '\\\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);\n\
        }) + '\"' : '\"' + string + '\"';\n\
    }\n\
\n\
\n\
    function str(key, holder) {\n\
\n\
  // Produce a string from holder[key].\n\
\n\
        var i,          // The loop counter.\n\
            k,          // The member key.\n\
            v,          // The member value.\n\
            length,\n\
            mind = gap,\n\
            partial,\n\
            value = holder[key];\n\
\n\
  // If the value has a toJSON method, call it to obtain a replacement value.\n\
\n\
        if (value instanceof Date) {\n\
            value = date(key);\n\
        }\n\
\n\
  // If we were called with a replacer function, then call the replacer to\n\
  // obtain a replacement value.\n\
\n\
        if (typeof rep === 'function') {\n\
            value = rep.call(holder, key, value);\n\
        }\n\
\n\
  // What happens next depends on the value's type.\n\
\n\
        switch (typeof value) {\n\
        case 'string':\n\
            return quote(value);\n\
\n\
        case 'number':\n\
\n\
  // JSON numbers must be finite. Encode non-finite numbers as null.\n\
\n\
            return isFinite(value) ? String(value) : 'null';\n\
\n\
        case 'boolean':\n\
        case 'null':\n\
\n\
  // If the value is a boolean or null, convert it to a string. Note:\n\
  // typeof null does not produce 'null'. The case is included here in\n\
  // the remote chance that this gets fixed someday.\n\
\n\
            return String(value);\n\
\n\
  // If the type is 'object', we might be dealing with an object or an array or\n\
  // null.\n\
\n\
        case 'object':\n\
\n\
  // Due to a specification blunder in ECMAScript, typeof null is 'object',\n\
  // so watch out for that case.\n\
\n\
            if (!value) {\n\
                return 'null';\n\
            }\n\
\n\
  // Make an array to hold the partial results of stringifying this object value.\n\
\n\
            gap += indent;\n\
            partial = [];\n\
\n\
  // Is the value an array?\n\
\n\
            if (Object.prototype.toString.apply(value) === '[object Array]') {\n\
\n\
  // The value is an array. Stringify every element. Use null as a placeholder\n\
  // for non-JSON values.\n\
\n\
                length = value.length;\n\
                for (i = 0; i < length; i += 1) {\n\
                    partial[i] = str(i, value) || 'null';\n\
                }\n\
\n\
  // Join all of the elements together, separated with commas, and wrap them in\n\
  // brackets.\n\
\n\
                v = partial.length === 0 ? '[]' : gap ?\n\
                    '[\\n\
' + gap + partial.join(',\\n\
' + gap) + '\\n\
' + mind + ']' :\n\
                    '[' + partial.join(',') + ']';\n\
                gap = mind;\n\
                return v;\n\
            }\n\
\n\
  // If the replacer is an array, use it to select the members to be stringified.\n\
\n\
            if (rep && typeof rep === 'object') {\n\
                length = rep.length;\n\
                for (i = 0; i < length; i += 1) {\n\
                    if (typeof rep[i] === 'string') {\n\
                        k = rep[i];\n\
                        v = str(k, value);\n\
                        if (v) {\n\
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);\n\
                        }\n\
                    }\n\
                }\n\
            } else {\n\
\n\
  // Otherwise, iterate through all of the keys in the object.\n\
\n\
                for (k in value) {\n\
                    if (Object.prototype.hasOwnProperty.call(value, k)) {\n\
                        v = str(k, value);\n\
                        if (v) {\n\
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);\n\
                        }\n\
                    }\n\
                }\n\
            }\n\
\n\
  // Join all of the member texts together, separated with commas,\n\
  // and wrap them in braces.\n\
\n\
            v = partial.length === 0 ? '{}' : gap ?\n\
                '{\\n\
' + gap + partial.join(',\\n\
' + gap) + '\\n\
' + mind + '}' :\n\
                '{' + partial.join(',') + '}';\n\
            gap = mind;\n\
            return v;\n\
        }\n\
    }\n\
\n\
  // If the JSON object does not yet have a stringify method, give it one.\n\
\n\
    JSON.stringify = function (value, replacer, space) {\n\
\n\
  // The stringify method takes a value and an optional replacer, and an optional\n\
  // space parameter, and returns a JSON text. The replacer can be a function\n\
  // that can replace values, or an array of strings that will select the keys.\n\
  // A default replacer method can be provided. Use of the space parameter can\n\
  // produce text that is more easily readable.\n\
\n\
        var i;\n\
        gap = '';\n\
        indent = '';\n\
\n\
  // If the space parameter is a number, make an indent string containing that\n\
  // many spaces.\n\
\n\
        if (typeof space === 'number') {\n\
            for (i = 0; i < space; i += 1) {\n\
                indent += ' ';\n\
            }\n\
\n\
  // If the space parameter is a string, it will be used as the indent string.\n\
\n\
        } else if (typeof space === 'string') {\n\
            indent = space;\n\
        }\n\
\n\
  // If there is a replacer, it must be a function or an array.\n\
  // Otherwise, throw an error.\n\
\n\
        rep = replacer;\n\
        if (replacer && typeof replacer !== 'function' &&\n\
                (typeof replacer !== 'object' ||\n\
                typeof replacer.length !== 'number')) {\n\
            throw new Error('JSON.stringify');\n\
        }\n\
\n\
  // Make a fake root object containing our value under the key of ''.\n\
  // Return the result of stringifying the value.\n\
\n\
        return str('', {'': value});\n\
    };\n\
\n\
  // If the JSON object does not yet have a parse method, give it one.\n\
\n\
    JSON.parse = function (text, reviver) {\n\
    // The parse method takes a text and an optional reviver function, and returns\n\
    // a JavaScript value if the text is a valid JSON text.\n\
\n\
        var j;\n\
\n\
        function walk(holder, key) {\n\
\n\
    // The walk method is used to recursively walk the resulting structure so\n\
    // that modifications can be made.\n\
\n\
            var k, v, value = holder[key];\n\
            if (value && typeof value === 'object') {\n\
                for (k in value) {\n\
                    if (Object.prototype.hasOwnProperty.call(value, k)) {\n\
                        v = walk(value, k);\n\
                        if (v !== undefined) {\n\
                            value[k] = v;\n\
                        } else {\n\
                            delete value[k];\n\
                        }\n\
                    }\n\
                }\n\
            }\n\
            return reviver.call(holder, key, value);\n\
        }\n\
\n\
\n\
    // Parsing happens in four stages. In the first stage, we replace certain\n\
    // Unicode characters with escape sequences. JavaScript handles many characters\n\
    // incorrectly, either silently deleting them, or treating them as line endings.\n\
\n\
        text = String(text);\n\
        cx.lastIndex = 0;\n\
        if (cx.test(text)) {\n\
            text = text.replace(cx, function (a) {\n\
                return '\\\\u' +\n\
                    ('0000' + a.charCodeAt(0).toString(16)).slice(-4);\n\
            });\n\
        }\n\
\n\
    // In the second stage, we run the text against regular expressions that look\n\
    // for non-JSON patterns. We are especially concerned with '()' and 'new'\n\
    // because they can cause invocation, and '=' because it can cause mutation.\n\
    // But just to be safe, we want to reject all unexpected forms.\n\
\n\
    // We split the second stage into 4 regexp operations in order to work around\n\
    // crippling inefficiencies in IE's and Safari's regexp engines. First we\n\
    // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we\n\
    // replace all simple value tokens with ']' characters. Third, we delete all\n\
    // open brackets that follow a colon or comma or that begin the text. Finally,\n\
    // we look to see that the remaining characters are only whitespace or ']' or\n\
    // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.\n\
\n\
        if (/^[\\],:{}\\s]*$/\n\
                .test(text.replace(/\\\\(?:[\"\\\\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')\n\
                    .replace(/\"[^\"\\\\\\n\
\\r]*\"|true|false|null|-?\\d+(?:\\.\\d*)?(?:[eE][+\\-]?\\d+)?/g, ']')\n\
                    .replace(/(?:^|:|,)(?:\\s*\\[)+/g, ''))) {\n\
\n\
    // In the third stage we use the eval function to compile the text into a\n\
    // JavaScript structure. The '{' operator is subject to a syntactic ambiguity\n\
    // in JavaScript: it can begin a block or an object literal. We wrap the text\n\
    // in parens to eliminate the ambiguity.\n\
\n\
            j = eval('(' + text + ')');\n\
\n\
    // In the optional fourth stage, we recursively walk the new structure, passing\n\
    // each name/value pair to a reviver function for possible transformation.\n\
\n\
            return typeof reviver === 'function' ?\n\
                walk({'': j}, '') : j;\n\
        }\n\
\n\
    // If the text is not JSON parseable, then a SyntaxError is thrown.\n\
\n\
        throw new SyntaxError('JSON.parse');\n\
    };\n\
\n\
    return JSON;\n\
  })();\n\
\n\
  if ('undefined' != typeof window) {\n\
    window.expect = module.exports;\n\
  }\n\
\n\
})(\n\
    this\n\
  , 'undefined' != typeof module ? module : {exports: {}}\n\
);\n\
//@ sourceURL=jb55-expect.js/index.js"
));
require.register("utf8/index.js", Function("exports, require, module",
"\n\
/**\n\
 * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Base64_encoding_and_decoding\n\
 * for more information\n\
 */\n\
\n\
var b64 = require('base64');\n\
\n\
exports = module.exports;\n\
\n\
/**\n\
 * encode a utf-8 string to base64\n\
 *\n\
 * @param {Function} fn\n\
 * @api public\n\
 */\n\
\n\
exports.encode = function(str){\n\
  return b64.encode(unescape(encodeURIComponent(str)));\n\
};\n\
\n\
/**\n\
 * decode base64 to a utf-8 string\n\
 *\n\
 * @param {Function} fn\n\
 * @api public\n\
 */\n\
\n\
exports.decode = function(str){\n\
  return decodeURIComponent(escape(b64.decode(str)));\n\
};\n\
//@ sourceURL=utf8/index.js"
));
require.alias("jb55-base64/index.js", "utf8/deps/base64/index.js");
require.alias("jb55-base64/index.js", "utf8/deps/base64/index.js");
require.alias("jb55-base64/index.js", "base64/index.js");
require.alias("component-bind/index.js", "jb55-base64/deps/bind/index.js");

require.alias("jb55-base64/index.js", "jb55-base64/index.js");
require.alias("jb55-expect.js/index.js", "utf8/deps/expect/index.js");
require.alias("jb55-expect.js/index.js", "utf8/deps/expect/index.js");
require.alias("jb55-expect.js/index.js", "expect/index.js");
require.alias("jb55-expect.js/index.js", "jb55-expect.js/index.js");
require.alias("utf8/index.js", "utf8/index.js");
