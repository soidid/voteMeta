/** @jsx React.DOM */
"use strict";
var React = require('react/addons');
require("./Records.css");
var Records = React.createClass({
  

  getInitialState(){
    return {
       shouldYearExpand:{}
    }
  },

  _onTogggleYearData(i, event){
    console.log(i);
    var currentYearExpand = this.state.shouldYearExpand;
    
    if(!currentYearExpand[i])
        currentYearExpand[i] = true;
    else
        currentYearExpand[i] = !currentYearExpand;

    this.setState({
        currentYearExpand: currentYearExpand
    });
  },

  render() {
    var {data, currentTerm, currentTab} = this.props;
    var {shouldYearExpand} = this.state;

    console.log(data);
    
 //每一年
    var year_entries = data.map((year, year_index)=>{
        
        var entriesCount = 0;
        var entries = year.entries

        .filter((item)=>{
            var shouldReturn = true;       
            if(currentTerm){
                //有關鍵字而且不符合
                if(item["tag"].indexOf(currentTerm.tag)){//ex.反對 核四
                    shouldReturn = false;
    
                }else{
                    //檢查立場是否相符
                    console.log(item["opinion"])
                    console.log(currentTerm.opinion);
                    
                    if(item["opinion"]==='against' && item["proposal_opinion"]==='against' && currentTerm.opinion !=='for')
                        shouldReturn = false;
    
                    if(item["opinion"]==='for' && item["proposal_opinion"]==='for' && currentTerm.opinion ==='against')
                        shouldReturn = false;
                }
            }
            if(currentTab!=="全部"){
               if(currentTab==="程序表決"){
                    if(item.is_procedure_vote===false) 
                        shouldReturn = false;
               }
               if(currentTab==="議案表決"){
                    
                    if(item.is_procedure_vote===true) 
                        shouldReturn = false;
               }
               
            }
           
            if(shouldReturn)
               return item;
        })
        .map((item,key)=>{
            entriesCount++;
            //每一筆 entry
            
            var opinionItem = "";
            var opinionText = "";
            if(item.opinion === "for"){
                opinionItem = <div className="Records-opinion is-for">同意</div>;
               
                opinionText = "支持";
                if(item.proposal_opinion === "against"){
                  opinionText = "反對";
                }
    
            }else if(item.opinion === "against"){
                opinionItem = <div className="Records-opinion is-against">反對</div>;
                opinionText = "反對";
                if(item.proposal_opinion === "against"){
                  opinionText = "支持";
                }
                
            }else if(item.opinion === "giveup"){//棄權
               opinionItem = <div className="Records-opinion is-giveup">棄權</div>;
               opinionText = "棄權";
    
            }else{//沒投票
               opinionItem = <div className="Records-opinion is-notshow">沒投票</div>;
               opinionText = "沒投票";
            }
            
            var link = "http://vote.ly.g0v.tw/vote/" + item.vote_id;
            

            return (
                <a className="Records-entry"
                   href={link}
                   target="_blank"
                   key={key}>
                    <div className="Records-entryTitle">{opinionText}{item.tag}</div>
                    <div className="Records-flexItem">
                        <div className="Records-flexLeft">表決內文</div>
                        <div className="Records-flexMain">
                            {item.summary}
                        </div>
                    </div>
                    <div className="Records-flexItem">
                        <div className="Records-flexLeft">投票立場</div>
                        <div className="Records-flexMain">
                             {opinionItem}
                        </div>
                    </div>
                    <div className="Records-flexItem">
                        <div className="Records-flexLeft">日期</div>
                        <div className="Records-flexMain">
                             {item.date}
                        </div>
                    </div>
                </a>
            )
        });
        
        var boundToggleYear = this._onTogggleYearData.bind(null, year.year);
        var voteEntries = (shouldYearExpand[year.year]===true)? entries : "";
        var toggleText = (shouldYearExpand[year.year]===true)? "折疊" : "展開";
        
       return (
            <div className="Records-year">
                <div className="Records-yearHeader"
                     onClick={boundToggleYear}>
                   <div className="Records-yearUnit"></div>
                   <div className="Records-yearTitle">{year.year}</div>
                   <div className="Records-yearSum">
                        {entriesCount} 次表決結果
                        <div className="Records-yearToggle" 
                             onClick={boundToggleYear}>{toggleText}</div>
                   </div>
                </div>
                <div className="Records-yearEntries">
                    {voteEntries}
                </div>
            </div>
       );



    });
    var title = currentTerm.title || "所有表決";
        return (
            <div className="Records">
              <div className="Records-title">{title}</div>
              {year_entries}
            </div>
    );


    
  }
});


module.exports = Records;


