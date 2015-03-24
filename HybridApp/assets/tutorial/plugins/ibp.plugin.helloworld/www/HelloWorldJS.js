cordova.define("ibp.plugin.helloworld.helloworld", function(require, exports, module) { var HelloWorld = function() {};  
  
HelloWorld.prototype.say = function() {  
    console.log("Message From HelloWorldJS: HelloWorldJS");  
    alert("Cordova Plugin, HelloWorldJS");  
};  
  
var helloWorld = new HelloWorld();  
module.exports = helloWorld;  

});
