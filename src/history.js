'use strict';

var React        = require('react');
var EventService = require('./event-service');

var HistoryPage = React.createClass({
  revertToState(){
    var b = this.props.page;
    EventService.emit('timeTravel', b);
    this.props.updateIndicator(this.props.step);
  },
  render(){
    return <div onClick={this.revertToState}>
      {this.props.childKey} {this.props.cur?'<':''}
    </div>
  }
})

var HistoryComponent = React.createClass({
  getInitialState(){
    return {
      step:0,
      play: false
    }
  },
  playHistory(){
    var st = this.state.play;
    this.setState({play:!st, step:0});
    setTimeout(this.updateStep, 500);
  },
  updateIndicator(step){
    this.setState({step:step})
  },
  updateStep(){
    if(this.isMounted&&this.state.play) {
      var curp = this.state.step;
      curp++;
      console.log(curp)
      if(curp >= this.props.history.length) {
        this.setState({play:false, step: 0});
      } else {
        EventService.emit('timeTravel', this.props.history[curp]);
        this.setState({step: curp})
        setTimeout(this.updateStep, 500);        
      }
    }

  },
  render(){

    return <div>
      <div onClick={this.playHistory}>Play history</div>
      {this.props.history.map(function(d, i){
        return <HistoryPage page={d} key={'history-index'+i} updateIndicator={this.updateIndicator} step={i} cur={this.state.step===i} childKey={'history-index'+i}/>
      }.bind(this))}
    </div>
  }
})


module.exports = HistoryComponent;