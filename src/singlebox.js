'use strict';

var React        = require('react');
var I            = require('immutable');
var R            = require('ramda');
var Draggable    = require('react-draggable');
var EventService = require('./event-service');

var SingleBox = React.createClass({
  handleStop(event, ui) {
    var b = this.props.box;
    EventService.emit('updateBox', R.merge(ui.position, {rid:b.get('rid')}));
  },  
  componentDidUpdate(prevProps, prevState) {
    var b = this.props.box;
    this.refs.draggy.setState({
       clientX: b.get('x'),
       clientY: b.get('y')
     });
  },
  render(){
    var b = this.props.box;

    return  <Draggable
                ref='draggy'
                key={b.get('rid')}
                grid={[25, 25]}
                start={{x: b.get('x'), y: b.get('y')}}
                zIndex={100}
                onStop={this.handleStop}>
                <div>
                    {b.get('id')}
                </div>
            </Draggable>
  }
});

module.exports = SingleBox;