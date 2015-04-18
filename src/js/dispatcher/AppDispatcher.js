var Dispatcher = require('flux').Dispatcher;

//Dispatch 直接用寫好的，裡面只有兩個功能 dispatch & register
//action 會用到 dispatch -- AppDispatcher.dispatch
//store 會用到 register -- AppDispatcher.register

module.exports = new Dispatcher();

/* 其他寫法：繼承 facebook flux 裡面的 Dispatcher，寫 bridge function，
   marking the action as a view action
/* 

寫法 1

var merge  = require('react/lib/merge');
//merge 是用來繼承 Dispatcher 的
//接收到 action 的時候，要做什麼事

var AppDispatcher = merge(Dispatcher.prototype, {
  handleViewAction: function(action){
    console.log('action', action);

    //把 action 資料加上了 source: 'VIEW_ACTION' 的資訊
    this.dispatch({
      source: 'VIEW_ACTION',
      action:action
    })
  }
})
module.exports = AppDispatcher;


寫法 2

var Dispatcher = require('flux').Dispatcher;		 
var assign = require('object-assign');		
 
var AppDispatcher = assign(new Dispatcher(), {		
  		
  * A bridge function between the views and the dispatcher, marking the action		
  * as a view action.  Another variant here could be handleServerAction.		
  * @param  {object} action The data coming from the view.		
  		
 handleViewAction: function(action) {		
   this.dispatch({		
     source: 'VIEW_ACTION',		
     action: action		
   });		
 }		
		
});		
		
module.exports = AppDispatcher;
*/
