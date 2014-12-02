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
        $('#content #panel_hellocallback #panel_hellocallback_content').html(msgfromnative);
      },
      function(msgfromnative){
        console.log(msgfromnative);
        $('#content #panel_hellocallback #panel_hellocallback_content').html(msgfromnative);
      });
      console.log("in function startTimer.");
  };
  AfHelloCallback.prototype.stopTimer = function () {
    HelloCallback.stop(
      function(msgfromnative){
        console.log(msgfromnative);
        $('#content #panel_hellocallback #panel_hellocallback_content').html(msgfromnative);
      },
      function(msgfromnative){
        console.log(msgfromnative);
        $('#content #panel_hellocallback #panel_hellocallback_content').html(msgfromnative);
      });
      console.log("in function stopTimer.");
  };
  var afHelloCallback = new AfHelloCallback();  
  module.exports = afHelloCallback;
});

/**
 * module af.nsdchat for nsdchat show.
 */
cordova.define("af.nsdchat", function(require, exports, module) {
  var NsdChat = cordova.require('ibp.plugin.nsdchat.nsdchat');
  var AfNsdChat = function() {};
  var panel_nsdchat_content = $('#content #panel_nsdchat #panel_nsdchat_content');
  AfNsdChat.prototype.initNsd = function() {
    NsdChat.initNsd(
      function(msgfromnative){
        console.log(msgfromnative);
        switch(msgfromnative.type){
          case 'success':
            $(panel_nsdchat_content).append($('<p></p>').html(msgfromnative));
          break;
          case 'error':
            $(panel_nsdchat_content).append($('<p></p>').html(msgfromnative));
          break;
          default:
            $(panel_nsdchat_content).append($('<p></p>').html(JSON.stringify(msgfromnative.data)));
          break;
        }
      },
      function(msgfromnative){
        console.log(msgfromnative);
        $(panel_nsdchat_content).append($('<p></p>').html(msgfromnative));
      });
  };
  
  AfNsdChat.prototype.stopNsd = function() {
    NsdChat.stopNsd(
      function(msgfromnative){
        console.log(msgfromnative);
        $(panel_nsdchat_content).append($('<p></p>').html(msgfromnative));
      },
      function(msgfromnative){
        console.log(msgfromnative);
        $(panel_nsdchat_content).append($('<p></p>').html(msgfromnative));
      });
    // console.log("in function stopNsd.");
  };
  
  AfNsdChat.prototype.startDiscovery = function() {
    NsdChat.startDiscovery(
      function(msgfromnative){
        $(panel_nsdchat_content).append($('<p></p>').html(msgfromnative));
      },
      function(msgfromnative){
        $(panel_nsdchat_content).append($('<p></p>').html(msgfromnative));
      });
      // console.log("in function startDiscovery.");
  };
  AfNsdChat.prototype.stopDiscovery = function() {
    NsdChat.stopDiscovery(
      function(msgfromnative){
        // console.log(msgfromnative);
        $(panel_nsdchat_content).append($('<p></p>').html(msgfromnative));
      },
      function(msgfromnative){
        // console.log(msgfromnative);
        $(panel_nsdchat_content).append($('<p></p>').html(msgfromnative));
      });
  };
  AfNsdChat.prototype.registerService = function() {
    serviceInfo = ['nsd-android-test', '8000'];
    NsdChat.registerService(
      function(msgfromnative){
        $(panel_nsdchat_content).append($('<p></p>').html(msgfromnative));
      },
      function(msgfromnative){
        $(panel_nsdchat_content).append($('<p></p>').html(msgfromnative));
      },
      serviceInfo);
  };
  AfNsdChat.prototype.unRegisterService = function() {
    NsdChat.unRegisterService(
      function(msgfromnative){
        $(panel_nsdchat_content).append($('<p></p>').html(msgfromnative));
      },
      function(msgfromnative){
        $(panel_nsdchat_content).append($('<p></p>').html(msgfromnative));
      });
  };
  AfNsdChat.prototype.scrollToBottom = function(){
    $.ui.scrollToBottom('#panel_nsdchat');//$(panel_nsdchat_content
  };
  AfNsdChat.prototype.clearContent = function(){
    $.ui.updatePanel('#panel_nsdchat',"");
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
