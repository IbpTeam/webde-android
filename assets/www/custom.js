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
    $(panel_nsd_talk_history).on("click", "a", function(){
      console.log('e.currentTarget');
      console.log(e.currentTarget);
    });
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
  // function void 
  AfNsdChat.prototype.initNsd = function() {
    NsdChat.initNsd(
      function(msgfromnative){
        console.log(msgfromnative);
        console.log(msgfromnative.data);
        switch(msgfromnative.type){
          case 'onServiceFound':
            $(panel_nsdchat_content).append($('<p></p>').html(JSON.parse(msgfromnative.data).name));
          break;
          case 'onServiceLost':
            $(panel_nsdchat_content).append($('<p></p>').html(JSON.parse(msgfromnative.data).name));
          break;
          case 'onServiceResolved'://JSON.stringify
            $(panel_nsdchat_content).append($('<p></p>').html(JSON.parse(msgfromnative.data).name));
          break;
          case 'onResolveFailed':
            $(panel_nsdchat_content).append($('<p></p>').html(msgfromnative));
          break;
          case 'success':
          case 'error':
            $(panel_nsdchat_content).append($('<p></p>').html(msgfromnative));
          break;
          default:
            $(panel_nsdchat_content).append($('<p></p>').html(msgfromnative));
          break;
        }
      },
      function(msgfromnative){
        // console.log(msgfromnative);
        $(panel_nsdchat_content).append($('<p></p>').html(msgfromnative));
      });
  };
  
  AfNsdChat.prototype.stopNsd = function() {
    NsdChat.stopNsd(
      function(msgfromnative){
        // console.log(msgfromnative);
        $(panel_nsdchat_content).append($('<p></p>').html(msgfromnative));
      },
      function(msgfromnative){
        // console.log(msgfromnative);
        $(panel_nsdchat_content).append($('<p></p>').html(msgfromnative));
      });
  };
  
  AfNsdChat.prototype.startDiscovery = function() {
    NsdChat.startDiscovery(
      function(msgfromnative){
        $(panel_nsdchat_content).append($('<p></p>').html(msgfromnative));
      },
      function(msgfromnative){
        $(panel_nsdchat_content).append($('<p></p>').html(msgfromnative));
      });
  };
  AfNsdChat.prototype.stopDiscovery = function() {
    NsdChat.stopDiscovery(
      function(msgfromnative){
        $(panel_nsdchat_content).append($('<p></p>').html(msgfromnative));
      },
      function(msgfromnative){
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
    $.ui.scrollToBottom('#panel_nsdchat');
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
      
      var panel_nsd_userlist = $('#afui #content #panel_nsd').find('ul');
      $(panel_nsd_userlist).on("click", "a", function(){
        console.log('this', this);
      });
  });
})();
