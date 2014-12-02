function updateLogView(){
    var panel_nsd_talk_history = $('#afui #content #panel_nsd_talk').find('ul');
    var panel_nsd_talk_footer = $('#afui #panel_nsd_talk_footer').find('textarea');
    var content = panel_nsd_talk_footer.val();
    if(content.length){
        panel_nsd_talk_history.append($('<li></li>').html(content));
        panel_nsd_talk_footer.val('');
    }else{
        alert("内容不能为空");
    }
}

cordova.define("af.hellocallback", function(require, exports, module) {
  var HelloCallback = cordova.require('ibp.plugin.hellocallback.hellocallback');
  var AfHelloCallback = function() {};   
  AfHelloCallback.prototype.startTimer = function () {
    HelloCallback.start(
      function(msgfromnative){
        console.log(msgfromnative);
        $('#content #panel_hellocallback').html(msgfromnative);
      },
      function(msgfromnative){
        console.log(msgfromnative);
        $('#content #panel_hellocallback').html(msgfromnative);
      });
      console.log("in function startTimer.");
  };
  AfHelloCallback.prototype.stopTimer = function () {
    HelloCallback.stop(
      function(msgfromnative){
        console.log(msgfromnative);
        $('#content #panel_hellocallback').html(msgfromnative);
      },
      function(msgfromnative){
        console.log(msgfromnative);
        $('#content #panel_hellocallback').html(msgfromnative);
      });
      console.log("in function stopTimer.");
  };
  var afHelloCallback = new AfHelloCallback();  
  module.exports = afHelloCallback;
});
cordova.define("af.nsdchat", function(require, exports, module) {
  var NsdChat = cordova.require('ibp.plugin.nsdchat.nsdchat');
  var AfNsdChat = function() {};
  AfNsdChat.prototype.initNsd = function() {
    NsdChat.initNsd(
      function(msgfromnative){
        console.log(msgfromnative);
        $('#content #panel_nsdchat').append($('<p></p>').html(msgfromnative));
      },
      function(msgfromnative){
        console.log(msgfromnative);
        $('#content #panel_nsdchat').append($('<p></p>').html(msgfromnative));
      });
    console.log("in function initNsd.");
  };
  AfNsdChat.prototype.stopNsd = function() {
    console.log("in function stopNsd.");
  };
  AfNsdChat.prototype.startDiscovery = function() {
    NsdChat.startDiscovery(
      function(msgfromnative){
        console.log(msgfromnative);
        $('#content #panel_nsdchat .afScrollbar').append($('<p></p>').html(msgfromnative.toString()));
      },
      function(msgfromnative){
        console.log(msgfromnative);
        $('#content #panel_nsdchat .afScrollbar').append($('<p></p>').html(msgfromnative.toString()));
      });
      console.log("in function startDiscovery.");
  };
  AfNsdChat.prototype.stopDiscovery = function() {
    console.log("in function stopDiscovery.");
        $('#content #panel_nsdchat .afScrollbar').append($('<p></p>').html('stopDiscovery'));
  };
  AfNsdChat.prototype.registerService = function() {
    console.log("in function registerService.");
  };
  AfNsdChat.prototype.unRegisterService = function() {
    console.log("in function unRegisterService.");
  };
  var afNsdChat = new AfNsdChat();  
  module.exports = afNsdChat;
});
(function(){
  var channel = cordova.require('cordova/channel');
  channel.onPluginsReady.subscribe(function() {
      window.AfNsdChat = cordova.require('af.nsdchat');
      window.AfHelloCallback = cordova.require('af.hellocallback');
  });
})();
