'use strict';

var React   = require('react');
var I       = require('immutable');
var R       = require('ramda');
var nodeuid = require('node-uuid');
var BoxList = require('./list');
var EventService = require('./event-service')
//var map1  = I.Map({a:1, b:2, c:3});
//var map2  = map1.set('b', 50);
var Boxes = I.List();
var boxes2 = Boxes.push(I.Map({id:nodeuid.v1(),x:0,y:0}))




var MainComponent = React.createClass({
  getInitialState(){
    return {
      boxes: boxes2
    }
  },
  render() {
    return (
      <div>
        <BoxList boxes={this.state.boxes}/>
      </div>
    );
  }
});



module.exports = MainComponent;