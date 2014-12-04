function updateLogView(){
    var nsd_talk_history = $('#afui #content #nsd_talk').find('ul');
    var nsd_talk_footer_textarea = $('#afui #navbar #nsd_talk_footer textarea');
    var nsd_talk_footer_submit = $('#afui #navbar #nsd_talk_footer a');
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
  
  // used for content show.
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
  
  // used for userlist
  var nsd_userlist = $('#content #nsd ul.list');
  function appendUser(name, txt){
    var af_a = $.create('a', {
    'href':'#nsd_talk',
    'data-transition':'up',
    }).on('click', function(){
        // alert($(this).parent().attr('name'));
        NsdChat.resolveService(
          function(msgfromnative){
            log(msgfromnative);
          },
          function(msgfromnative){
            log(msgfromnative);
          },
          $(this).parent().attr('name')
      );
      localStorage.setItem("name", "namea");
      // $('#afui #content #nsd_talk').find('ul').html(localStorage.getItem('name'));
    });
    $.create('img', {
        className:'list-image',
        'src':'data/male_user_icon.svg',
    }).appendTo($(af_a));
    $.create('div', {
        className:'list-text',
    }).html(
        '<b>' + name + '</b><br>' + txt
    ).appendTo($(af_a));
    $(nsd_userlist).append($('<li>').attr('name', name).append($(af_a)));
  }
  function overWriteUser(device){
    var users = $(nsd_userlist).find('li');
    for(var i=0; i < users.length; i++){
      if($(users[i]).attr('name') === device.name){
        break;
      }
    }
    var list_text = $(users[i]).find('.list-text');
    if(list_text){
      $(list_text).html('<b>' + device.name + '</b><br>' + device.host); 
    } 
  }
  function rmUserByName(name){
    var users = $(nsd_userlist).find('li');
    var findUser = false;
    for(var i=0; i < users.length; i++){
      // console.log($(users[i]).attr('name'));
      if($(users[i]).attr('name') === name){
        findUser = true;
        $(users[i]).remove();
        break;
      }
    }
  }
  function rmAllUsers(){
    var users = $(nsd_userlist).find('li');
    for(var i=0; i < users.length; i++){
      $(users[i]).remove();
    }    
  }

  // used for store device info list
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
      appendUser(device.name, '用户：' + device.name);
    }
  }
  function overWriteADevice(device){
    var isDeviceExist = false;
    for(id in deviceList){
      obj = deviceList[id];
      if(obj.name == device.name){
        isDeviceExist = true;
        break;
      }
    }
    deviceList[device.name] = device;
    if(isDeviceExist){
      overWriteUser(device);
    }else{
      appendUser(device.name, '用户：' + device.name);
    }    
  }
  function removeADevice(device){
    var obj;
    for(id in deviceList){
      obj = deviceList[id];
      if(obj.name == device.name){
        delete deviceList[id];
        rmUserByName(device.name);
        return true;
      }
    }
    return false;
  }
  function clearDeviceList(){
    for(id in deviceList){
      delete deviceList[id];
    }
    rmAllUsers();
  }
  function logObj(obj){
    for(id in obj){
      if((typeof obj[id]) === object){
        logObj(obj[id]);
      }else{
        log(id + ": " + obj[id] + " - " + (typeof obj[id]));
      }
    }
  }
  
  // used for Class AfNsdChat defination.
  var AfNsdChat = function() {};

  AfNsdChat.prototype.showDeviceList = function(){
    for(id in deviceList){
      log(JSON.stringify(deviceList[id]));
    }    
  };
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
            overWriteADevice(JSON.parse(msgfromnative.data));
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
      this.clearContent();
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
  function showNsdTalk(panel){
    var nsd_talk = $(panel);
    var history = nsd_talk.find('ul');
    var footerId = nsd_talk.attr('data-footer');
    var textarea = $('#afui #navbar').find('#' + footerId).find('textarea');
    var submit = $('#afui #navbar').find('#' + footerId).find('a');
    console.log('in fucntion showNsdTalk, panel:', panel);
    console.log('in fucntion showNsdTalk, footerId:', footerId);
    console.log('in fucntion showNsdTalk, history:', history);
    console.log('in fucntion showNsdTalk, textarea:', textarea);
    console.log('in fucntion showNsdTalk, submit:', submit); 
    submit.onclick(function(){
      var content = textarea.val();
      if(content.length){
          history.append($('<li></li>').html(content));
          textarea.val('');
      }else{
          alert("内容不能为空");
      }     
    });
    // console.log('in fucntion showNsdTalk, panel:', panel);
    // console.log('in fucntion showNsdTalk, footer:', footer);
    // console.log('in fucntion showNsdTalk, history:', history);
    // console.log('in fucntion showNsdTalk, textarea:', textarea);
    // console.log('in fucntion showNsdTalk, submit:', submit); 
  };