// Generated by CoffeeScript 1.6.1
(function() {
  var Discard, Iterable, List, Map, Prim, Set, StringObj, Symbol, Tag, Tagged, Vector, atPath, encode, encodeHandlers, encodeJson, escapeChar, fs, handle, lex, method, methods, parenTypes, parens, read, specialChars, tagActions, tokenHandlers, us, _fn, _fn1, _i, _j, _len, _len1, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  us = require("underscore");

  fs = require("fs");

  Prim = (function() {

    function Prim(val) {
      if (us.isArray(val)) {
        this.val = us.filter(val, function(x) {
          return !(x instanceof Discard);
        });
      } else {
        this.val = val;
      }
    }

    Prim.prototype.value = function() {
      return this.val;
    };

    Prim.prototype.toString = function() {
      return JSON.stringify(this.val);
    };

    return Prim;

  })();

  Symbol = (function(_super) {

    __extends(Symbol, _super);

    function Symbol() {
      return Symbol.__super__.constructor.apply(this, arguments);
    }

    Symbol.prototype.ednEncode = function() {
      return this.val;
    };

    return Symbol;

  })(Prim);

  StringObj = (function(_super) {

    __extends(StringObj, _super);

    function StringObj() {
      return StringObj.__super__.constructor.apply(this, arguments);
    }

    StringObj.prototype.toString = function() {
      return this.val;
    };

    StringObj.prototype.is = function(test) {
      return this.val === test;
    };

    return StringObj;

  })(Prim);

  Tag = (function() {

    function Tag() {
      var name, namespace, _ref;
      namespace = arguments[0], name = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      this.namespace = namespace;
      this.name = name;
      if (arguments.length === 1) {
        _ref = arguments[0].split('/'), this.namespace = _ref[0], this.name = 2 <= _ref.length ? __slice.call(_ref, 1) : [];
      }
    }

    Tag.prototype.ns = function() {
      return this.namespace;
    };

    Tag.prototype.dn = function() {
      return [this.namespace].concat(this.name).join('/');
    };

    return Tag;

  })();

  Tagged = (function(_super) {

    __extends(Tagged, _super);

    function Tagged(_tag, _obj) {
      this._tag = _tag;
      this._obj = _obj;
    }

    Tagged.prototype.ednEncode = function() {
      return "\#" + (this.tag().dn()) + " " + (encode(this.obj()));
    };

    Tagged.prototype.jsonEncode = function() {
      return {
        Tagged: [this.tag().dn(), this.obj().jsonEncode != null ? this.obj().jsonEncode() : this.obj()]
      };
    };

    Tagged.prototype.tag = function() {
      return this._tag;
    };

    Tagged.prototype.obj = function() {
      return this._obj;
    };

    return Tagged;

  })(Prim);

  Discard = (function() {

    function Discard() {}

    return Discard;

  })();

  Iterable = (function(_super) {

    __extends(Iterable, _super);

    function Iterable() {
      return Iterable.__super__.constructor.apply(this, arguments);
    }

    Iterable.prototype.ednEncode = function() {
      return (this.map(function(i) {
        return encode(i);
      })).join(" ");
    };

    Iterable.prototype.jsonEncode = function() {
      return this.map(function(i) {
        if (i.jsonEncode != null) {
          return i.jsonEncode();
        } else {
          return i;
        }
      });
    };

    Iterable.prototype.jsEncode = function() {
      return this.map(function(i) {
        if (i.jsEncode != null) {
          return i.jsEncode();
        } else {
          return i;
        }
      });
    };

    Iterable.prototype.exists = function(index) {
      return this.val[index] != null;
    };

    Iterable.prototype.at = function(index) {
      if (this.exists(index)) {
        return this.val[index];
      }
    };

    Iterable.prototype.set = function(index, val) {
      this.val[index] = val;
      return this;
    };

    return Iterable;

  })(Prim);

  methods = ['forEach', 'each', 'map', 'reduce', 'reduceRight', 'find', 'detect', 'filter', 'select', 'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke', 'max', 'min', 'sortBy', 'sortedIndex', 'toArray', 'size', 'first', 'initial', 'rest', 'last', 'without', 'indexOf', 'shuffle', 'lastIndexOf', 'isEmpty', 'groupBy'];

  _fn = function(method) {
    return Iterable.prototype[method] = function() {
      return us[method].apply(us, [this.val].concat(us.toArray(arguments)));
    };
  };
  for (_i = 0, _len = methods.length; _i < _len; _i++) {
    method = methods[_i];
    _fn(method);
  }

  _ref = ['concat', 'join', 'slice'];
  _fn1 = function(method) {
    return Iterable.prototype[method] = function() {
      return Array.prototype[method].apply(this.val, arguments);
    };
  };
  for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
    method = _ref[_j];
    _fn1(method);
  }

  List = (function(_super) {

    __extends(List, _super);

    function List() {
      return List.__super__.constructor.apply(this, arguments);
    }

    List.prototype.ednEncode = function() {
      return "(" + (List.__super__.ednEncode.call(this)) + ")";
    };

    List.prototype.jsonEncode = function() {
      return {
        List: List.__super__.jsonEncode.call(this)
      };
    };

    return List;

  })(Iterable);

  Vector = (function(_super) {

    __extends(Vector, _super);

    function Vector() {
      return Vector.__super__.constructor.apply(this, arguments);
    }

    Vector.prototype.ednEncode = function() {
      return "[" + (Vector.__super__.ednEncode.call(this)) + "]";
    };

    Vector.prototype.jsonEncode = function() {
      return {
        Vector: Vector.__super__.jsonEncode.call(this)
      };
    };

    return Vector;

  })(Iterable);

  Set = (function(_super) {

    __extends(Set, _super);

    Set.prototype.ednEncode = function() {
      return "\#{" + (Set.__super__.ednEncode.call(this)) + "}";
    };

    Set.prototype.jsonEncode = function() {
      return {
        Set: Set.__super__.jsonEncode.call(this)
      };
    };

    function Set(val) {
      Set.__super__.constructor.call(this);
      this.val = us.uniq(val);
      if (!us.isEqual(val, this.val)) {
        throw "set not distinct";
      }
    }

    return Set;

  })(Iterable);

  Map = (function() {

    Map.prototype.ednEncode = function() {
      var i;
      return "{" + (((function() {
        var _k, _len2, _ref1, _results;
        _ref1 = this.value();
        _results = [];
        for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
          i = _ref1[_k];
          _results.push(encode(i));
        }
        return _results;
      }).call(this)).join(" ")) + "}";
    };

    Map.prototype.jsonEncode = function() {
      var i;
      return {
        Map: (function() {
          var _k, _len2, _ref1, _results;
          _ref1 = this.value();
          _results = [];
          for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
            i = _ref1[_k];
            _results.push(i.jsonEncode != null ? i.jsonEncode() : i);
          }
          return _results;
        }).call(this)
      };
    };

    Map.prototype.jsEncode = function() {
      var hashId, i, k, result, _k, _len2, _ref1;
      result = {};
      _ref1 = this.keys;
      for (i = _k = 0, _len2 = _ref1.length; _k < _len2; i = ++_k) {
        k = _ref1[i];
        hashId = k.hashId != null ? k.hashId() : k;
        result[hashId] = this.vals[i].jsEncode != null ? this.vals[i].jsEncode() : this.vals[i];
      }
      return result;
    };

    function Map(val) {
      var i, v, _k, _len2, _ref1;
      this.val = val;
      this.keys = [];
      this.vals = [];
      _ref1 = this.val;
      for (i = _k = 0, _len2 = _ref1.length; _k < _len2; i = ++_k) {
        v = _ref1[i];
        if (i % 2 === 0) {
          this.keys.push(v);
        } else {
          this.vals.push(v);
        }
      }
      this.val = false;
    }

    Map.prototype.value = function() {
      var i, result, v, _k, _len2, _ref1;
      result = [];
      _ref1 = this.keys;
      for (i = _k = 0, _len2 = _ref1.length; _k < _len2; i = ++_k) {
        v = _ref1[i];
        result.push(v);
        if (this.vals[i] != null) {
          result.push(this.vals[i]);
        }
      }
      return result;
    };

    Map.prototype.exists = function(key) {
      var i, k, _k, _len2, _ref1;
      _ref1 = this.keys;
      for (i = _k = 0, _len2 = _ref1.length; _k < _len2; i = ++_k) {
        k = _ref1[i];
        if (us.isEqual(k, key)) {
          return i;
        }
      }
      return void 0;
    };

    Map.prototype.at = function(key) {
      var id;
      if ((id = this.exists(key)) != null) {
        return this.vals[id];
      } else {
        throw "key does not exist";
      }
    };

    Map.prototype.set = function(key, val) {
      var id;
      if ((id = this.exists(key)) != null) {
        this.vals[id] = val;
      } else {
        this.keys.push(key);
        this.vals.push(val);
      }
      return this;
    };

    return Map;

  })();

  parens = '()[]{}';

  specialChars = parens + ' \t\n\r,';

  escapeChar = '\\';

  parenTypes = {
    '(': {
      closing: ')',
      "class": List
    },
    '[': {
      closing: ']',
      "class": Vector
    },
    '{': {
      closing: '}',
      "class": Map
    }
  };

  lex = function(string) {
    var c, escaping, in_comment, in_string, list, token, _k, _len2;
    list = [];
    token = '';
    for (_k = 0, _len2 = string.length; _k < _len2; _k++) {
      c = string[_k];
      if ((typeof in_string === "undefined" || in_string === null) && c === ";") {
        in_comment = true;
      }
      if (in_comment) {
        if (c === "\n") {
          in_comment = void 0;
          if (token) {
            list.push(token);
            token = '';
          }
        }
        continue;
      }
      if (c === '"' && (typeof escaping === "undefined" || escaping === null)) {
        if (typeof in_string !== "undefined" && in_string !== null) {
          list.push(new StringObj(in_string));
          in_string = void 0;
        } else {
          in_string = '';
        }
        continue;
      }
      if (in_string != null) {
        if (c === escapeChar && (typeof escaping === "undefined" || escaping === null)) {
          escaping = true;
          continue;
        }
        if (escaping != null) {
          escaping = void 0;
        }
        in_string += c;
      } else if (__indexOf.call(specialChars, c) >= 0) {
        if (token) {
          list.push(token);
          token = '';
        }
        if (__indexOf.call(parens, c) >= 0) {
          list.push(c);
        }
      } else {
        if (token === "#_") {
          list.push(token);
          token = '';
        }
        token += c;
      }
    }
    if (token) {
      list.push(token);
    }
    return list;
  };

  read = function(tokens) {
    var read_ahead, result, token1;
    read_ahead = function(token) {
      var L, closeParen, handledToken, paren, tagged;
      if (token === void 0) {
        return;
      }
      if (paren = parenTypes[token]) {
        closeParen = paren.closing;
        L = [];
        while (true) {
          token = tokens.shift();
          if (token === void 0) {
            throw 'unexpected end of list';
          }
          if (token === paren.closing) {
            return new paren["class"](L);
          } else {
            L.push(read_ahead(token));
          }
        }
      } else if (__indexOf.call(")]}", token) >= 0) {
        throw "unexpected " + token;
      } else {
        handledToken = handle(token);
        if (handledToken instanceof Tag) {
          token = tokens.shift();
          if (token === void 0) {
            throw 'was expecting something to follow a tag';
          }
          tagged = new Tagged(handledToken, read_ahead(token));
          if (tagged.tag().dn() === "") {
            if (tagged.obj() instanceof Map) {
              return new Set(tagged.obj().value());
            }
          }
          if (tagged.tag().dn() === "_") {
            return new Discard;
          }
          if (tagActions[tagged.tag().dn()] != null) {
            return tagActions[tagged.tag().dn()].action(tagged.obj());
          }
          return tagged;
        } else {
          return handledToken;
        }
      }
    };
    token1 = tokens.shift();
    if (token1 === void 0) {
      return void 0;
    } else {
      result = read_ahead(token1);
      if (result instanceof Discard) {
        return "";
      }
      return result;
    }
  };

  handle = function(token) {
    var handler, name;
    if (token instanceof StringObj) {
      return token.toString();
    }
    for (name in tokenHandlers) {
      handler = tokenHandlers[name];
      if (handler.pattern.test(token)) {
        return handler.action(token);
      }
    }
    return token;
  };

  tokenHandlers = {
    nil: {
      pattern: /^nil$/,
      action: function(token) {
        return null;
      }
    },
    boolean: {
      pattern: /^true$|^false$/,
      action: function(token) {
        return token === "true";
      }
    },
    character: {
      pattern: /^\\[A-z0-9]$/,
      action: function(token) {
        return token.slice(-1);
      }
    },
    tab: {
      pattern: /^\\tab$/,
      action: function(token) {
        return "\t";
      }
    },
    newLine: {
      pattern: /^\\newline$/,
      action: function(token) {
        return "\n";
      }
    },
    space: {
      pattern: /^\\space$/,
      action: function(token) {
        return " ";
      }
    },
    keyword: {
      pattern: /^[\:\?].*$/,
      action: function(token) {
        return token.slice(1);
      }
    },
    integer: {
      pattern: /^\-?[0-9]*$/,
      action: function(token) {
        return parseInt(token);
      }
    },
    float: {
      pattern: /^\-?[0-9]*\.[0-9]*$/,
      action: function(token) {
        return parseFloat(token);
      }
    },
    tagged: {
      pattern: /^#.*$/,
      action: function(token) {
        return new Tag(token.slice(1));
      }
    }
  };

  tagActions = {
    uuid: {
      tag: new Tag("uuid"),
      action: function(obj) {
        return obj;
      }
    },
    inst: {
      tag: new Tag("inst"),
      action: function(obj) {
        return obj;
      }
    }
  };

  encodeHandlers = {
    array: {
      test: function(obj) {
        return us.isArray(obj);
      },
      action: function(obj) {
        var v;
        return "[" + (((function() {
          var _k, _len2, _results;
          _results = [];
          for (_k = 0, _len2 = obj.length; _k < _len2; _k++) {
            v = obj[_k];
            _results.push(encode(v));
          }
          return _results;
        })()).join(" ")) + "]";
      }
    },
    integer: {
      test: function(obj) {
        return us.isNumber(obj) && tokenHandlers.integer.pattern.test(obj);
      },
      action: function(obj) {
        return parseInt(obj);
      }
    },
    float: {
      test: function(obj) {
        return us.isNumber(obj) && tokenHandlers.float.pattern.test(obj);
      },
      action: function(obj) {
        return parseFloat(obj);
      }
    },
    keyword: {
      test: function(obj) {
        return (us.isString(obj)) && (__indexOf.call(obj, " ") < 0) && (tokenHandlers.keyword.pattern.test(obj));
      },
      action: function(obj) {
        return obj;
      }
    },
    string: {
      test: function(obj) {
        return us.isString(obj);
      },
      action: function(obj) {
        return "\"" + (obj.toString().replace(/"/g, '\\"')) + "\"";
      }
    },
    boolean: {
      test: function(obj) {
        return us.isBoolean(obj);
      },
      action: function(obj) {
        if (obj) {
          return "true";
        } else {
          return "false";
        }
      }
    },
    "null": {
      test: function(obj) {
        return us.isNull(obj);
      },
      action: function(obj) {
        return "nil";
      }
    },
    object: {
      test: function(obj) {
        return us.isObject(obj);
      },
      action: function(obj) {
        var k, result, v;
        result = [];
        for (k in obj) {
          v = obj[k];
          result.push(encode(":" + k));
          result.push(encode(v));
        }
        return "{" + (result.join(" ")) + "}";
      }
    }
  };

  encode = function(obj) {
    var handler, name;
    if ((obj != null ? obj.ednEncode : void 0) != null) {
      return obj.ednEncode();
    }
    for (name in encodeHandlers) {
      handler = encodeHandlers[name];
      if (handler.test(obj)) {
        return handler.action(obj);
      }
    }
    throw "unhandled encoding for " + (JSON.stringify(obj));
  };

  encodeJson = function(obj, prettyPrint) {
    if (obj.jsonEncode != null) {
      return encodeJson(obj.jsonEncode(), prettyPrint);
    }
    if (prettyPrint) {
      return JSON.stringify(obj, null, 4);
    } else {
      return JSON.stringify(obj);
    }
  };

  atPath = function(obj, path) {
    var part, value, _k, _len2;
    path = path.trim().replace(/[ ]{2,}/g, ' ').split(' ');
    value = obj;
    for (_k = 0, _len2 = path.length; _k < _len2; _k++) {
      part = path[_k];
      if (value.exists) {
        if (value.exists(part) != null) {
          value = value.at(part);
        } else {
          throw "Could not find " + part;
        }
      } else {
        throw "Not a composite object";
      }
    }
    return value;
  };

  exports.Symbol = Symbol;

  exports.List = List;

  exports.Vector = Vector;

  exports.Map = Map;

  exports.Set = Set;

  exports.Tag = Tag;

  exports.Tagged = Tagged;

  exports.setTagAction = function(tag, action) {
    return tagActions[tag.dn()] = {
      tag: tag,
      action: action
    };
  };

  exports.setTokenHandler = function(handler, pattern, action) {
    return tokenHandlers[handler] = {
      pattern: pattern,
      action: action
    };
  };

  exports.setTokenPattern = function(handler, pattern) {
    return tokenHandlers[handler].pattern = pattern;
  };

  exports.setTokenAction = function(handler, action) {
    return tokenHandlers[handler].action = action;
  };

  exports.setEncodeHandler = function(handler, test, action) {
    return encodeHandlers[handler] = {
      test: test,
      action: action
    };
  };

  exports.setEncodeTest = function(type, test) {
    return encodeHandlers[type].test = test;
  };

  exports.setEncodeAction = function(type, action) {
    return encodeHandlers[type].action = action;
  };

  exports.parse = function(string) {
    return read(lex(string));
  };

  exports.encode = encode;

  exports.encodeJson = encodeJson;

  exports.atPath = atPath;

  exports.toJS = function(obj) {
    if (obj.jsEncode != null) {
      return obj.jsEncode();
    } else {
      return obj;
    }
  };

  exports.readFile = function(file, cb) {
    return fs.readFile(file, "utf-8", function(err, data) {
      if (err) {
        throw err;
      }
      return cb(exports.parse(data));
    });
  };

  exports.compile = function(string) {
    return "require('jsedn').parse(\"" + (string.replace(/"/g, '\\"').replace(/\n/g, " ").trim()) + "\")";
  };

  exports.readFileSync = function(file) {
    return exports.parse(fs.readFileSync(file, "utf-8"));
  };

}).call(this);
