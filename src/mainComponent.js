'use strict';

var React = require('react');
var I     = require('immutable');
var R     = require('ramda');



var map1 = I.Map({a:1, b:2, c:3});
var map2 = map1.set('b', 50);
console.log(map1.get('b')); // 2
console.log(map2.get('b')); // 50


var MainComponent = React.createClass({
  render() {
    return (
      <h1>Sure</h1>
    );
  }
});



module.exports = MainComponent;