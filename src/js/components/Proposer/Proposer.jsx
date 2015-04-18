/** @jsx React.DOM */
"use strict";
var React = require('react/addons');
require("./Proposer.css");

var Proposer = React.createClass({
  
  render() {
    
    if(!this.props.data)
       return (<div></div>);
   
    var { name, party_eng } = this.props.data;
   
  
    var imgClass = "Proposer-avatarImg is-"+party_eng;
    var imgURL = require("./images/"+name+".png");
    return (
        <div className="Proposer">
            <div className="Proposer-avatar">
                <img className={imgClass}
                     src={imgURL} />
                <div className="Proposer-avatarName">{name}</div>
            </div>
        </div>
    );
  }
});


module.exports = Proposer;


