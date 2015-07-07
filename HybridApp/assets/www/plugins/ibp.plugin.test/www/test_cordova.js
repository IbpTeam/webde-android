cordova.define("ibp.plugin.test.test_cordova", function(require, exports, module) { 
var TestCordova = function() {};  
TestCordova.prototype.init = function(successCallback, errorCallback, info){
  cordova.exec(successCallback, errorCallback, "TestCordovaPlugin", "init", info);
};

TestCordova.prototype.onMessages = function(id) {
    console.log("Message From TestCordovaNative, onMessages: " + id);
};  
  
var testCordova = new TestCordova();  
module.exports = testCordova;  

});
