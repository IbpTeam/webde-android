cordova.define("ibp.plugin.socket.socket", function(require, exports, module) { var Socket = function() {};
Socket.prototype.startServerSocket = function(successCallback, errorCallback, serverInfo) {
    cordova.exec(successCallback, errorCallback, "SocketPlugin", "startServerSocket", serverInfo);
};
Socket.prototype.stopServerSocket = function(successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, "SocketPlugin", "stopServerSocket", []);
};
Socket.prototype.initHandler = function(successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, "SocketPlugin", "initHandler", []);
};
Socket.prototype.sendMessage = function(successCallback, errorCallback, msgArr) {
    cordova.exec(successCallback, errorCallback, "SocketPlugin", "sendMessage", msgArr);
};
var SocketModule = new Socket();  
module.exports = SocketModule;
});
