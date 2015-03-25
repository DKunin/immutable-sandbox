'use strict';

var React            = require('react');
var I                = require('immutable');
var R                = require('ramda');
var nodeuid          = require('node-uuid');
var BoxList          = require('./list');
var HistoryComponent = require('./history');
var EventService     = require('./event-service');
var randomColor      = require('random-color');
var BoxHistory       = [];
var Boxes            = I.Map();
var firstUid         = nodeuid.v1();
var CertainHistory   = require('./history.json');

var randomInt = R.curry(function(min, max) {
  return function(){
    return (min + Math.random()*(max+1-min))^0
  }
});

var randomFieldCoordinate = randomInt(1,150);

var generateBox = function(uid){
  return I.Map({rid: uid, x:randomFieldCoordinate(),y:randomFieldCoordinate(), color:randomColor()})
}

var sampleBoxes = Boxes.set(firstUid, generateBox(firstUid))

var remapAsImmutableMaps = R.map(function(d){
  return R.mapObj(I.Map)(d);
});

var RestoreHistory = R.compose(I.List, R.map(function(d){
  return I.fromJS(d, function (key, value) {
    return value.toOrderedMap();
  });
}) ,remapAsImmutableMaps);

var MergeBoxes =  R.curry(function(obj, box){
  return box.merge({ x:obj.left,y:obj.top})
});

var restoreCertainHistory = function(){
  EventService.emit('updateHistory', CertainHistory);
};

window.rh = restoreCertainHistory;


var MainComponent = React.createClass({
  getInitialState(){
    return {
      boxes: sampleBoxes
    }
  },
  componentDidMount() {
    EventService.on('updateBox', this.savePosition);
    EventService.on('updateHistory', this.restoreCertainState);
    EventService.on('timeTravel', this.timeTravel);
    var hist = JSON.parse(localStorage.getItem('boxHistory')||'[]');
    if(hist.length>0) {
      this.restoreCertainState(hist);     
    } else {
      this.updateAllBoxes(this.state.boxes)
    }
  },
  restoreCertainState(hist){
    var immutableHistory = RestoreHistory(hist);
    BoxHistory = immutableHistory.toJS();
    var lastMap = immutableHistory.last();
    this.setState({boxes:lastMap});    
  },
  componentWillUnmount() {
    EventService.removeListener('updateHistory', this.restoreCertainState);
    EventService.removeListener('updateBox', this.savePosition);
    EventService.removeListener('timeTravel', this.timeTravel);
  },
  timeTravel(historyPage){
    var tra = I.fromJS(historyPage);
    this.updateAllBoxes(tra, true);
  },
  updateAllBoxes(newCurBoxes, omitHistory){
    if(!omitHistory) {
      BoxHistory.push(newCurBoxes);
      localStorage.setItem('boxHistory', JSON.stringify(BoxHistory));
    }
    this.setState({boxes:newCurBoxes});
  },
  savePosition(obj){
    var curBoxes    = this.state.boxes;
    var updatedPosition = curBoxes.update(obj.rid, MergeBoxes(obj));
    this.updateAllBoxes(updatedPosition);
  },
  addBox(){
    var curBoxes    = this.state.boxes;
    var uid         = nodeuid.v1();
    var newCurBoxes = curBoxes.set(uid, generateBox(uid));
    this.updateAllBoxes(newCurBoxes);
  },
  render() {
    return (
      <div>
        <button onClick={this.addBox}>+</button>
        <BoxList boxes={this.state.boxes}/>
        <HistoryComponent history={BoxHistory} />
      </div>
    );
  }
});



module.exports = MainComponent;