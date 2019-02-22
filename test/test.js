const expect = require('chai').expect;
const fs   = require('fs');
const path   = require('path');
const _   = require('lodash');
const JSDOM = require('jsdom').JSDOM;

const openmojis = require('../data/openmoji.json');
const colors = require('../data/color-palette.json').colors;

describe('Layers in src files', function () {
  const emojis = _.filter(openmojis, (e) => { return e.skintone == ''});
  emojis.forEach(emoji => {
    const doc = createDoc(emoji);
    // it(emoji.hexcode + '.svg should have a #color layer', function(){
    //   expect( doc.querySelector('#color') ).to.not.be.a('null');
    // });
    // it(emoji.hexcode + '.svg should have a #line layer', function(){
    //   expect( doc.querySelector('#line') ).to.not.be.a('null');
    // });
    it(emoji.hexcode + '.svg should have only valid layers', function(){
      const query = doc.querySelectorAll('svg > g:not(#grid):not(#line):not(#color):not(#hair):not(#skin):not(#skin-shadow):not(#color-foreground):not(#line-supplement)');
      expect( query.length ).to.equal(0);
    });
  })
});

describe('Colors in src files', function () {
  let emojis = _.filter(openmojis, (e) => { return e.skintone == ''});
  // emojis = _.filter(openmojis, (e) => { return e.hexcode == 'E25A'});

  // create a mega query string with all valid colors and edge cases like 'none', or shorthand white '#fff' etc.
  const validColor = [...colors, '#fff', '#000', 'none', '#b3b3b3', '#00a5ff'];
  let queryStr = '[fill]';
  validColor.forEach(c => {
    queryStr += ':not([fill*="'+c.toLowerCase()+'"])';
    queryStr += ':not([fill*="'+c.toUpperCase()+'"])';
  });
  // console.log(queryStr);
  emojis.forEach(emoji => {
    const doc = createDoc(emoji);
    it(emoji.hexcode + '.svg should have valid colors', function(){
      const query = doc.querySelectorAll(queryStr);
      // query.forEach(el => { console.log(el.getAttribute('fill')) });
      expect( query.length ).to.equal(0);
    });
  })
});


function createDoc(emoji) {
  const svgFile = path.join('./src', emoji.group, emoji.subgroups, emoji.hexcode + '.svg');
  const dom = new JSDOM(fs.readFileSync(svgFile), 'utf8');
  return dom.window.document;
}
