cordova.define("ibp.plugin.watch.watch", function(require, exports, module) { var Watch = function() {};
Watch.prototype.messageToWear = function(successCallback, errorCallback, info){
  cordova.exec(successCallback, errorCallback, "WatchPlugin", "messageToWear", info);
};

var listenerArr = new Array();
Watch.prototype.addDeviceListener = function(cb){
  listenerArr.push(cb);
};

Watch.prototype.messageFromWear = function(type){
  console.log(type);
  switch(type){
    case 0:
    break;
    case 1:
    break;
  }
  for(index in listenerArr){
    listenerArr[index](type);
  }

};
var WatchObj = new Watch();
module.exports = WatchObj;


});
