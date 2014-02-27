
var utf8 = require('utf8');
var encode = utf8.encode;
var decode = utf8.decode;
var expect = require('expect');

var raw = 'Foo © bar 𝌆 baz ☃ qu';
var enc = 'Rm9vIMKpIGJhciDwnYyGIGJheiDimIMgcXU=';

function ed(str) {
  return decode(encode(str));
}

function de(str) {
  return encode(decode(str));
}

describe('utf8 example', function(){
  it('encodes properly', function(){
    var out = encode(raw);
    expect(out).to.be.a('string');
    expect(out).to.eql(enc);
  });

  it('decodes properly', function(){
    var out = decode(enc);
    expect(out).to.be.a('string');
    expect(out).to.eql(raw);
  });

  it('encode and decode are isomorphic', function(){
    var out = decode(enc);
    expect(ed(raw)).to.eql(raw);
    expect(de(enc)).to.eql(enc);
  });
});
