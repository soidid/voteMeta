/** @jsx React.DOM */
"use strict";
var React = require('react/addons');
require("./Legislator.css");

var Legislator = React.createClass({
  
  render() {

    var {name} = this.props;
    var imgURL = require("./images/avatar/"+name+".png");
    
    return (
      <div className="Legislator">
          <img className="Legislator-avatarImg"
               src={imgURL} />
      </div>
    );
  }
});


module.exports = Legislator;


