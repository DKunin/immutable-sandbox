'use strict';

var React        = require('react');
var SingleBox    = require('./singlebox');

var List = React.createClass({
  render() {

    var items = this.props.boxes.map(function(box){
      return <SingleBox box={box}/>
    });

    return (
      <ul>
        {items.toJS()}
      </ul>
    );
  }
});



module.exports = List;