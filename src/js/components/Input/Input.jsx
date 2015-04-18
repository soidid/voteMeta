/** @jsx React.DOM */
"use strict";
var React = require('react/addons');

require("./Input.css");

var Input =
    React.createClass({
    
    
    render(){
    	  var classSet = React.addons.classSet;

        var { handleInputChange, handleSetInput, handleSetTab, currentTerm, currentTab } = this.props;
       
        var examples = [
        {
          title:'支持核四',
          tag:'核四',
          opinion:'for'
        },
        { 
          title:'反對核四',
          tag:'核四',
          opinion:'against'
        }];
        var exampleButtons = examples.map((item,key)=>{
            var boundClick = handleSetInput.bind(null, item);
            return <div className="Input-keyword"
                        onClick={boundClick}>{item.title}</div>;
        });

        
        var boundClearInput = handleSetInput.bind(null, "");
        var boundClearInputItem = (currentTerm) ? <div className="Input-clearInput"
                onClick={boundClearInput}>x</div> :"";
        
        return (
      	  <div className="Input">
          	<input className="Input-textInput"
                   onChange={handleInputChange}
                   
          	       value={currentTerm.title}/>
                {boundClearInputItem}
            <div className="Input-hint">熱門：
                {exampleButtons}
            </div>
            

          </div>
        )
    }

  });
module.exports = Input;