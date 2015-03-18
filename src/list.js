'use strict';

var React        = require('react');
var I            = require('immutable');
var R            = require('ramda');
var Draggable    = require('react-draggable');
var SingleBox    = require('./singlebox');

var RenderBoxes = R.map(function(box){return <SingleBox box={box}/>})

var List = React.createClass({
  render() {
    return (
      <ul>
        {RenderBoxes(this.props.boxes)}
      </ul>
    );
  }
});



module.exports = List;