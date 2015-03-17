cordova.define("ibp.plugin.jmdns.jmdns", function(require, exports, module) { var NSD = function() {};
NSD.prototype.initNsd = function(successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, "JMDNSlugin", "initNsd", []);
};
NSD.prototype.stopNsd = function(successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, "JMDNSlugin", "stopNsd", []);
};
NSD.prototype.startDiscovery = function(successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, "JMDNSlugin", "startDiscovery", []);
};
NSD.prototype.stopDiscovery = function(successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, "JMDNSlugin", "stopDiscovery", []);
};
NSD.prototype.registerService = function(successCallback, errorCallback, serviceInfo) {
    cordova.exec(successCallback, errorCallback, "JMDNSlugin", "registerService", serviceInfo);
};
NSD.prototype.unRegisterService = function(successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, "JMDNSlugin", "unRegisterService", []);
};
NSD.prototype.resolveService = function(successCallback, errorCallback, username) {
    cordova.exec(successCallback, errorCallback, "JMDNSlugin", "resolveService", [username]);
};
var NSDObj = new NSD();  
module.exports = NSDObj;


});
