var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
/**
 * 這是一個 singleton 物件
 */
var AppActions = {
  
  update: function(item) {
    //定義每個 action 要送出去的資料
    AppDispatcher.dispatch({
      //actionType 要和 TodoContants 定義的一致
      actionType: AppConstants.LEGI_UPDATE,
      item: item
    });
  }


};

module.exports = AppActions;
