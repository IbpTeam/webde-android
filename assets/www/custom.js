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
 * module af.nsd for nsd show.
 */
cordova.define("af.nsd", function(require, exports, module) {
  // var NsdChat = cordova.require('ibp.plugin.nsdchat.nsdchat');
  if(!window.NSD){
    alert("object window.NSD does not exist.");
    return;
  }
  var NSDChat = function(device){
    this.device = {};
    $.extend(this.device, device);
  };
  NSDChat.prototype.load = function(){
    var that = this;
    var id = "nsd_talk_" + this.device.address.replace(/\./g, '_') + '_' + this.device.port;
    if(! $('#'+id).length){
      $.ui.addContentDiv(id, "<p>Connect To " + this.device.address + ":" + this.device.port + "</p><ul></ul>", this.device.address);
      $('#'+id).get(0).setAttribute("data-footer", "nsd_talk_footer");
      // $('#' + id).get(0).setAttribute("data-transition", "up");
      // $('#' + id).get(0).setAttribute("data-modal", "true");
      $.ui.loadContent('#'+id, false, false, "up");
      this.nsd_talk = $('#'+id);
      this.history = this.nsd_talk.find('ul');
      var footerId = this.nsd_talk.attr('data-footer');
      var textarea = $('#afui #navbar').find('#' + footerId).find('textarea');
      var submit = $('#afui #navbar').find('#' + footerId).find('a');
      // console.log('in fucntion showNsdTalk, footerId:', footerId);
      // console.log('in fucntion showNsdTalk, history:', history);
      // console.log('in fucntion showNsdTalk, textarea:', textarea);
      // console.log('in fucntion showNsdTalk, submit:', submit);
      submit.unbind("click");
      submit.bind("click", function(){
        var content = textarea.val();
        if(content.length){
            that.history.append($('<li></li>').html(content));
            textarea.val('');
        }else{
            alert("内容不能为空");
        }     
      });
    } else {      
      $.ui.loadContent('#'+id, false, false, "up");
    }
  };
  NSDChat.prototype.processMsg = function(msgObj){
    this.history.append($('<li></li>').html(msgObj.message));
  };

  var NSDUserList = function(){
    this.userlist = $('#content #nsd ul.list');
    this.nsdchatObj = new Object();//do not need to delete when device offline.
  };
  NSDUserList.prototype.processMsg = function(msgObj){
    if(this.nsdchatObj[msgfromnative.address+'.'+msgfromnative.port]){
      this.nsdchatObj[msgfromnative.address+'.'+msgfromnative.port].processMsg(msgObj);
    }else{
      log("NSDUserList.prototype.processMsg: Panel Does Not Exist.");
    }
  };
  NSDUserList.prototype.appendUser = function (name, txt){
    var that = this;
    var af_a = $.create('<a>').on('click', function(e){
      window.NSD.resolveService(
        function(msgfromnative){
          log(JSON.stringify(msgfromnative));
          overWriteADevice(msgfromnative);
          if(!that.nsdchatObj[msgfromnative.address+'.'+msgfromnative.port]){
            that.nsdchatObj[msgfromnative.address+'.'+msgfromnative.port] = new NSDChat(msgfromnative);
          }
          that.nsdchatObj[msgfromnative.address+'.'+msgfromnative.port].load();
        },
        function(msgfromnative){
          log(msgfromnative);
        },
        $(this).parent().attr('name')
      );
      localStorage.setItem("name", $(this).parent().attr('name'));
      e.preventDefault();
      e.stopPropagation();
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
    this.userlist.append($('<li>').attr('name', name).append($(af_a)));
  };
  NSDUserList.prototype.overWriteUser = function (device){
    var users = this.userlist.find('li');
    for(var i=0; i < users.length; i++){
      if(users[i].getAttribute('name') === device.name){
        break;
      }
    }
    var list_text = $(users[i]).find('.list-text');
    if(list_text){
      $(list_text).html('<b>' + device.name + '</b><br>' + device.address + ":" + device.port); 
    } 
  };
  NSDUserList.prototype.rmUserByName = function (name){
    var users = this.userlist.find('li');
    var findUser = false;
    for(var i=0; i < users.length; i++){
      if(users[i].getAttribute('name') === name){
        findUser = true;
        $(users[i]).remove();
        break;
      }
    }
    return findUser;
  };
  NSDUserList.prototype.rmAllUsers = function (){
    var users = this.userlist.find('li');
    for(var i=0; i < users.length; i++){
      $(users[i]).remove();
    }    
  };
  var afNsdUserList = new NSDUserList();  


  // used for content show.
  var device_nsd = $('#content #device_nsd');
  var content = $('<div></div>');
  if($(device_nsd).find('.afScrollPanel')){
    $(device_nsd).find('.afScrollPanel').append($(content));
  }else{
    $(device_nsd).append($(content));
  }
  function myLog(info, prefix){
    switch(typeof info){
      case "object":
        info = JSON.stringify(info);
      break;
    }
    info = "prefix: " + info;
    console.log(info);
    $(content).append($('<p></p>').html(info));
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
      myLog("Error: " + device.name + " has exist.", "addADevice");
    }else{
      deviceList[device.name] = device;
      afNsdUserList.appendUser(device.name, '用户：' + device.name);
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
      afNsdUserList.overWriteUser(device);
    }else{
      afNsdUserList.appendUser(device.name, '用户：' + device.name);
    }    
  }
  function removeADevice(device){
    var obj;
    for(id in deviceList){
      obj = deviceList[id];
      if(obj.name == device.name){
        delete deviceList[id];
        afNsdUserList.rmUserByName(device.name);
        return true;
      }
    }
    return false;
  }
  function clearDeviceList(){
    for(id in deviceList){
      delete deviceList[id];
    }
    afNsdUserList.rmAllUsers();
  }
  
  // used for Class AfNsd defination.
  var AfNsd = function(name, port) {
    this.mName = name;
    this.mPort = port;
  };
  AfNsd.prototype.showDeviceList = function(){
    for(id in deviceList){
      myLog(JSON.stringify(deviceList[id]), "AfNsd.prototype.showDeviceList");
    }    
  };
  AfNsd.prototype.initNsd = function() {
    window.NSD.initNsd(
      function(msgfromnative){
        switch(typeof msgfromnative){
          case "object":
            switch(msgfromnative.type){
              case 'onServiceFound':
                myLog(msgfromnative.type + ": " + JSON.parse(msgfromnative.data).name, "AfNsd.prototype.initNsd");
                addADevice(JSON.parse(msgfromnative.data));
              break;
              case 'onServiceLost':
                myLog(msgfromnative.type + ": " + JSON.parse(msgfromnative.data).name, "AfNsd.prototype.initNsd");
                removeADevice(JSON.parse(msgfromnative.data));
              break;
              case 'onPause':
                myLog(msgfromnative.type + ": " + msgfromnative.data, "AfNsd.prototype.initNsd");
                clearDeviceList();
              break;
              default:
                myLog(msgfromnative.type + ": " + msgfromnative.data, "AfNsd.prototype.initNsd");
              break;
            }
            break;
          case "string":
            myLog(msgfromnative, "AfNsd.prototype.initNsd");
          break;
        }
      },
      function(msgfromnative){
        myLog(msgfromnative, "AfNsd.prototype.initNsd");
      });
  };
  
  AfNsd.prototype.stopNsd = function() {
    window.NSD.stopNsd(
      function(msgfromnative){
        myLog(msgfromnative, "AfNsd.prototype.stopNsd");
      },
      function(msgfromnative){
        myLog(msgfromnative, "AfNsd.prototype.stopNsd");
      });
      clearDeviceList();
      this.clearContent();
  };
  
  AfNsd.prototype.startDiscovery = function() {
    window.NSD.startDiscovery(
      function(msgfromnative){
        myLog(msgfromnative, "AfNsd.prototype.startDiscovery");
      },
      function(msgfromnative){
        myLog(msgfromnative, "AfNsd.prototype.startDiscovery");
      });
  };
  AfNsd.prototype.stopDiscovery = function() {
    window.NSD.stopDiscovery(
      function(msgfromnative){
        myLog(msgfromnative, "AfNsd.prototype.stopDiscovery");
      },
      function(msgfromnative){
        myLog(msgfromnative, "AfNsd.prototype.stopDiscovery");
      });
      clearDeviceList();
  };
  AfNsd.prototype.registerService = function() {
    var that = this;
    serviceInfo = [this.mName, this.mPort];
    window.NSD.registerService(
      function(msgfromnative){
        myLog(msgfromnative, "AfNsd.prototype.registerService");
        that.startServerSocket();
      },
      function(msgfromnative){
        myLog(msgfromnative, "AfNsd.prototype.registerService");
      },
      serviceInfo);
  };
  AfNsd.prototype.unRegisterService = function() {
    window.NSD.unRegisterService(
      function(msgfromnative){
        myLog(msgfromnative, "AfNsd.prototype.unRegisterService");
      },
      function(msgfromnative){
        myLog(msgfromnative, "AfNsd.prototype.unRegisterService");
      });
  };
  AfNsd.prototype.startServerSocket = function(){
    var that = this;
    window.Socket.startServerSocket(
      function(msgfromnative){
        myLog(msgfromnative, "AfNsd.prototype.startServerSocket");
        that.initServerHandler();
      },
      function(msgfromnative){
        myLog(msgfromnative, "AfNsd.prototype.startServerSocket");
      },
      that.mPort);    
  };
  /**
    "port":7777
    "message":"Hi  this is in IMSender test"
    "to":"rtty123"
    "time":1418979857244
    "address":"192.168.5.176"
    "uuid":"rio1529rio"
    "from":"cos"
    "type":"app1"
   */
  AfNsd.prototype.initServerHandler = function(){
    window.Socket.initHandler(
      function(msgfromnative){
        myLog(msgfromnative, "AfNsd.prototype.initServerHandler");
        switch(typeof msgfromnative){
          case "object":
            afNsdUserList.processMsg(msgfromnative);
          break;
          case "string":
          break;
        }
      },
      function(msgfromnative){
        myLog(msgfromnative, "AfNsd.prototype.initServerHandler");
      });    
  };
  AfNsd.prototype.scrollToBottom = function(){
    $.ui.scrollToBottom('#device_nsd');
  };
  AfNsd.prototype.clearContent = function(){
    $(content).html('');
  };
  var afNsd = new AfNsd("nsd-android-test", 7777);  
  module.exports = afNsd;
});

cordova.define("af.camera", function(require, exports, module) {
  // var TimerPlugin = cordova.require('ibp.plugin.timer.timer');
  var device_camera = $('#content #device_camera');
  var content = $('<div></div>');
  if(device_camera.find('.afScrollPanel')){
    device_camera.find('.afScrollPanel').append($(content));
  }else{
    device_camera.append($(content));
  }
  // content.html(<div id="camera-image" class="ui-body ui-body-b" style="background-size:100%;min-height:250px"></div>);

  var camera_image = $.create("div", {
    id : "camera-image",
    className : "ui-body ui-body-b",
  }).css({
    "background-size" : "100%",
    "min-height" : "250px"
  }); 
  content.append(camera_image);
// log(navigator.camera);
  function log(info){
    console.log(info);
    $(content).append($('<p></p>').html(info));
  }
  var AfCamera = function() {};
  
  /* Camera */
  AfCamera.prototype.startCamera = function () {
      var onSuccess = function(url) {
      //    $('#camera-image').html("<img src="+url+" width='250' />");
          $('#camera-image').css("background-image", "url('data: image/jpeg;base64,"+encodeURIComponent(url)+"')");
          $('#camera-image').css("background-repeat", "no-repeat");
          $('#camera-image').css("width", "250px");
      };
      var onFail = function() {
          alert('Error');
      };
      navigator.camera.getPicture(onSuccess, onFail, {
          quality: 50,
      //    destinationType: navigator.camera.DestinationType.FILE_URL,    
          destinationType: navigator.camera.DestinationType.DATA_URL
      });
  };
  
  AfCamera.prototype.cameraGallery = function cameraGallery() {        
      var onSuccess = function(url) {
      //    $('#camera-image').html("<img src="+url+" width='250' />");
          $('#camera-image').css("background-image", "url('data: image/jpeg;base64,"+encodeURIComponent(url)+"')");
          $('#camera-image').css("background-repeat", "no-repeat");
          $('#camera-image').css("width", "250px");
      };
      var onFail = function() {
          alert('Error');
      };
      navigator.camera.getPicture(onSuccess, onFail, {
          quality: 50,
      //    destinationType: navigator.camera.DestinationType.FILE_URL,
          destinationType: navigator.camera.DestinationType.DATA_URL,
          sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
      });
  };
  var afCamera = new AfCamera();
  module.exports = afCamera;
});

(function(){
  var channel = cordova.require('cordova/channel');
  channel.onPluginsReady.subscribe(function() {
    window.AfTimer = cordova.require('af.timer');
    window.AfNsd = cordova.require('af.nsd');
    window.AfCamera = cordova.require('af.camera');
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
/*
  function logObj(obj){
    for(id in obj){
      if((typeof obj[id]) === object){
        logObj(obj[id]);
      }else{
        log(id + ": " + obj[id] + " - " + (typeof obj[id]));
      }
    }
  }
  */