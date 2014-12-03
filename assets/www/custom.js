function updateLogView(){
    var nsd_talk_history = $('#afui #content #nsd_talk').find('ul');
    var nsd_talk_footer = $('#afui #nsd_talk_footer').find('textarea');
    var content = nsd_talk_footer.val();
    if(content.length){
        nsd_talk_history.append($('<li></li>').html(content));
        nsd_talk_footer.val('');
    }else{
        alert("内容不能为空");
    }
    $(nsd_talk_history).on("click", "a", function(){
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
        $('#content #hellocallback #hellocallback_content').html(msgfromnative);
      },
      function(msgfromnative){
        console.log(msgfromnative);
        $('#content #hellocallback #hellocallback_content').html(msgfromnative);
      });
      console.log("in function startTimer.");
  };
  AfHelloCallback.prototype.stopTimer = function () {
    HelloCallback.stop(
      function(msgfromnative){
        console.log(msgfromnative);
        $('#content #hellocallback #hellocallback_content').html(msgfromnative);
      },
      function(msgfromnative){
        console.log(msgfromnative);
        $('#content #hellocallback #hellocallback_content').html(msgfromnative);
      });
      console.log("in function stopTimer.");
  };
  var afHelloCallback = new AfHelloCallback();  
  module.exports = afHelloCallback;
});

cordova.define("af.timer", function(require, exports, module) {
  var TimerPlugin = cordova.require('ibp.plugin.timer.timer');
  var device_timer = $('#content #device_timer');
  var content = $('<div></div>');
  if($(device_timer).find('.afScrollPanel')){
    $(device_timer).find('.afScrollPanel').append($(content));
  }else{
    $(device_timer).append($(content));
  }
  function log(info){
    console.log(info);
    $(content).html($('<p></p>').html(info).html());//$('<p></p>').html(info)
  }
  var AfTimer = function() {};   
  AfTimer.prototype.startTimer = function () {
    TimerPlugin.start(
      function(msgfromnative){
        log(msgfromnative.data);
      },
      function(msgfromnative){
        log(msgfromnative.data);
      });
  };
  AfTimer.prototype.stopTimer = function () {
    TimerPlugin.stop(
      function(msgfromnative){
        log(msgfromnative);
      },
      function(msgfromnative){
        log(msgfromnative);
      });
  };
  var afTimer = new AfTimer();  
  module.exports = afTimer;
});
/**
 * module af.nsdchat for nsdchat show.
 */
cordova.define("af.nsdchat", function(require, exports, module) {
  var NsdChat = cordova.require('ibp.plugin.nsdchat.nsdchat');
  var device_nsdchat = $('#content #device_nsdchat');
  var content = $('<div></div>');
  if($(device_nsdchat).find('.afScrollPanel')){
    $(device_nsdchat).find('.afScrollPanel').append($(content));
  }else{
    $(device_nsdchat).append($(content));
  }
  function log(info){
    console.log(info);
    $(content).append($('<p></p>').html(info));
  }
  var deviceList = new Object();
  function addADevice(device){
    var isDeviceExist = false;
    for(id in deviceList){
      obj = deviceList[id];
      if(obj.name == device.name){
        isDeviceExist = true;
        break;
      }
    }
    if(isDeviceExist){
      log("Error: " + device.name + " has exist.");
    }else{
      deviceList[device.name] = device;
    }
  }
  function removeADevice(device){
    var obj;
    for(id in deviceList){
      obj = deviceList[id];
      if(obj.name == device.name){
        delete deviceList[id];
        return true;
      }
    }
    return false;
  }
  function clearDeviceList(){
    for(id in deviceList){
      delete deviceList[id];
    }    
  }
  
  var AfNsdChat = function() {};
  AfNsdChat.prototype.showDeviceList = function(){
    for(id in deviceList){
      log(JSON.stringify(deviceList[id]));
    }    
  };
  function logObj(obj){
    for(id in obj){
      if((typeof obj[id]) === object){
        logObj(obj[id]);
      }else{
        log(id + ": " + obj[id] + " - " + (typeof obj[id]));
      }
    }
  }
  AfNsdChat.prototype.initNsd = function() {
    NsdChat.initNsd(
      function(msgfromnative){
        switch(msgfromnative.type){
          case 'onServiceFound':
            log(msgfromnative.type + ": " + JSON.parse(msgfromnative.data).name);
            addADevice(JSON.parse(msgfromnative.data));
          break;
          case 'onServiceLost':
            log(msgfromnative.type + ": " + JSON.parse(msgfromnative.data).name);
            removeADevice(JSON.parse(msgfromnative.data));
          break;
          case 'onServiceResolved'://JSON.stringify
            log(msgfromnative.type + ": " + JSON.parse(msgfromnative.data).name);
          break;
          case 'onResolveFailed':
            log(msgfromnative.type + ": " + msgfromnative.data);
          break;
          case 'success':
          case 'error':
            log(msgfromnative.type + ": " + msgfromnative.data);
          break;
          default:
            log(msgfromnative.type + ": " + msgfromnative.data);
          break;
        }
      },
      function(msgfromnative){
        log(msgfromnative.type + ": " + msgfromnative.data);
      });
  };
  
  AfNsdChat.prototype.stopNsd = function() {
    NsdChat.stopNsd(
      function(msgfromnative){
        log(msgfromnative);
      },
      function(msgfromnative){
        log(msgfromnative);
      });
      clearDeviceList();
  };
  
  AfNsdChat.prototype.startDiscovery = function() {
    NsdChat.startDiscovery(
      function(msgfromnative){
        log(msgfromnative);
      },
      function(msgfromnative){
        log(msgfromnative);
      });
  };
  AfNsdChat.prototype.stopDiscovery = function() {
    NsdChat.stopDiscovery(
      function(msgfromnative){
        log(msgfromnative);
      },
      function(msgfromnative){
        log(msgfromnative);
      });
  };
  AfNsdChat.prototype.registerService = function() {
    serviceInfo = ['nsd-android-test', '8000'];
    NsdChat.registerService(
      function(msgfromnative){
        log(msgfromnative);
      },
      function(msgfromnative){
        log(msgfromnative);
      },
      serviceInfo);
  };
  AfNsdChat.prototype.unRegisterService = function() {
    NsdChat.unRegisterService(
      function(msgfromnative){
        log(msgfromnative);
      },
      function(msgfromnative){
        log(msgfromnative);
      });
  };
  AfNsdChat.prototype.scrollToBottom = function(){
    $.ui.scrollToBottom('#device_nsdchat');
  };
  AfNsdChat.prototype.clearContent = function(){
    $(content).html('');
  };
  var afNsdChat = new AfNsdChat();  
  module.exports = afNsdChat;
});
(function(){
  var channel = cordova.require('cordova/channel');
  channel.onPluginsReady.subscribe(function() {
    window.AfTimer = cordova.require('af.timer');
    window.AfNsdChat = cordova.require('af.nsdchat');
    window.AfHelloCallback = cordova.require('af.hellocallback');
    var nsd_userlist = $('#afui #content #nsd').find('ul');
    $(nsd_userlist).on("click", "a", function(){
      console.log('this', this);
    });
  });
  channel.onPause.subscribe(function() {
    console.log('onPause');
  });
  channel.onResume.subscribe(function() {
    console.log('onResume');
  });
  channel.onDestroy.subscribe(function() {
    console.log('onDestroy');
  });
})();
