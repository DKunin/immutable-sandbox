'use strict';

var React        = require('react');
var I            = require('immutable');
var R            = require('ramda');
var Draggable    = require('react-draggable');
var EventService = require('./event-service');

var SingleBox = React.createClass({
  handleStop(event, ui) {
    var b = this.props.box;
    EventService.emit('updateBox', R.merge(ui.position, {uid:b.get('id')}));
  },  
  render(){
    var b = this.props.box;
    return   <Draggable
                key={b.get('id')}
                grid={[25, 25]}
                start={{x: b.get('x'), y: b.get('y')}}
                zIndex={100}
                onStop={this.handleStop}>
                <div>
                    {b.get('id')}
                </div>
            </Draggable>
  }
})

var RenderBoxes = R.map(function(box){return <SingleBox box={box}/>})

var List = React.createClass({
  render() {
    return (
      <div>
        {RenderBoxes(this.props.boxes)}
      </div>
    );
  }
});



module.exports = List;