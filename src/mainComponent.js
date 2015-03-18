'use strict';

var React   = require('react');
var I       = require('immutable');
var R       = require('ramda');
var nodeuid = require('node-uuid');
var BoxList = require('./list');
var EventService = require('./event-service')

var Boxes = I.OrderedMap();
var uid = nodeuid.v1()
var sampleBoxes = Boxes.set(uid, I.Map({id:uid,x:50,y:50}))

var randomInt = R.curry(function(min, max) {
  return function(){
    return (min + Math.random()*(max+1-min))^0
  }
});
var remapAsImmutableMaps = R.map(function(d){
  return R.mapObj(I.Map)(d);
});

var RestoreHistory = R.compose(I.List, R.map(function(d){
  return I.fromJS(d, function (key, value) {
    return value.toOrderedMap();
  });
}) ,remapAsImmutableMaps)

var BoxHistory = [];

var randomFieldCoordinate = randomInt(1,150);

var HistoryComponent = React.createClass({
  render: function(){
    return <div>
    </div>
  }
})

var MainComponent = React.createClass({
  getInitialState(){
    return {
      boxes: sampleBoxes
    }
  },
  componentDidMount() {
    EventService.on('updateBox', this.savePosition);
    var hist = JSON.parse(localStorage.getItem('boxHistory')||[]);
    if(hist.length>0) {
      var immutableHistory = RestoreHistory(hist);
      var lastMap = immutableHistory.last()
      this.setState({boxes:lastMap});      
    }
    window.lastMap = lastMap;
  },
  componentWillUnmount() {
    EventService.removeListener('updateBox', this.savePosition);
  },
  updateAllBoxes: function(newCurBoxes){
    BoxHistory.push(newCurBoxes);
    localStorage.setItem('boxHistory', JSON.stringify(BoxHistory));
    this.setState({boxes:newCurBoxes});
  },
  savePosition: function(obj){
    var curBoxes    = this.state.boxes;
    var updatedPosition = curBoxes.set(obj.uid, I.Map({id:obj.uid,x:obj.left,y:obj.top}));
    this.updateAllBoxes(updatedPosition);
  },
  addBox(){
    var curBoxes    = this.state.boxes;
    var uid         = nodeuid.v1();
    var newCurBoxes = curBoxes.set(uid, I.Map({id:uid,x:randomFieldCoordinate(),y:randomFieldCoordinate()}));
    this.updateAllBoxes(newCurBoxes);
  },
  render() {
    return (
      <div>
        <button onClick={this.addBox}>+</button>
        <BoxList boxes={this.state.boxes}/>
      </div>
    );
  }
});



module.exports = MainComponent;