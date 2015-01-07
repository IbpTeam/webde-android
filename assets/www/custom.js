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
  
/**
 * NSDChat类，用于聊天界面。
 */
  var NSDChat = function(device){
    /** format of device: {"type":"_http._tcp.","port":0,"address":"null","name":"Test-UserB"}*/
    this.device = {};
    $.extend(this.device, device);
  };
  NSDChat.prototype.load = function(){
    var that = this;
    var id = "nsd_talk_" + this.device.address.replace(/\./g, '_') + '_' + this.device.port;
    if(! $('#'+id).length){
      $.ui.addContentDiv(id, "<p>Connect To " + this.device.address + ":" + this.device.port + "</p><ul></ul>", this.device.address);
      $('#'+id).get(0).setAttribute("data-footer", "nsd_talk_footer");
      // $('#' + id).get(0).setAttribute("data-modal", "true");
      $.ui.loadContent('#'+id, false, false, "up");
      this.nsd_talk = $('#'+id);
      this.history = this.nsd_talk.find('ul');
      var footerId = this.nsd_talk.attr('data-footer');
      var textarea = $('#afui #navbar').find('#' + footerId).find('textarea');
      var submit = $('#afui #navbar').find('#' + footerId).find('a');
      submit.unbind("click");
      submit.bind("click", function(){
        var message = textarea.val();
        function successCb(){
          that.history.append($('<li></li>').html("I say: " + message));
          textarea.val('');          
        }
        function errorCb(){
          that.history.append($('<li></li>').html("Failed to send Message: " + message));
          textarea.val('');          
        }
        if(message.length){
          afSocket.sendMessage(successCb, errorCb, [that.device.name, that.device.address, that.device.port, message]);
        }else{
          alert("内容不能为空");
        }
      });
    } else {
      $.ui.loadContent('#'+id, false, false, "up");
    }
  };
  NSDChat.prototype.processMsg = function(msgObj){
    this.history.append($('<li></li>').html(msgObj.from + ": " + msgObj.message));
  };
  
/**
 * NSDUserList类，实现用户列表。
 */
  // var NSDUserList = function(){
    // this.userlist = $('#content #nsd ul.list');
    // this.nsdchatObj = new Object();//do not need to delete when device offline.
  // };
  // NSDUserList.prototype.processMsg = function(msgObj){
    // if(this.nsdchatObj[msgObj.address+'.'+msgObj.port]){
      // this.nsdchatObj[msgObj.address+'.'+msgObj.port].processMsg(msgObj);
    // }else{
      // myLog("Panel Does Not Exist.", "NSDUserList.prototype.processMsg");
    // }
  // };
  // NSDUserList.prototype.appendUser = function (name, txt){
    // var that = this;
    // var af_a = $.create('<a>').on('click', function(e){
      // window.NSD.resolveService(
        // function(msgfromnative){
          // myLog(JSON.stringify(msgfromnative), "NSDUserList.prototype.appendUser");
          // overWriteADevice(msgfromnative);
          // if(!that.nsdchatObj[msgfromnative.address+'.'+msgfromnative.port]){
            // that.nsdchatObj[msgfromnative.address+'.'+msgfromnative.port] = new NSDChat(msgfromnative);
          // }
          // that.nsdchatObj[msgfromnative.address+'.'+msgfromnative.port].load();
        // },
        // function(msgfromnative){
          // myLog(msgfromnative, "NSDUserList.prototype.appendUser");
        // },
        // $(this).parent().attr('name')
      // );
      // localStorage.setItem("name", $(this).parent().attr('name'));
      // e.preventDefault();
      // e.stopPropagation();
    // });
    // $.create('img', {
        // className:'list-image',
        // 'src':'data/male_user_icon.svg',
    // }).appendTo($(af_a));
    // $.create('div', {
        // className:'list-text',
    // }).html(
        // '<b>' + name + '</b><br>' + txt
    // ).appendTo($(af_a));
    // this.userlist.append($('<li>').attr('name', name).append($(af_a)));
  // };
  // NSDUserList.prototype.overWriteUser = function (device){
    // var users = this.userlist.find('li');
    // for(var i=0; i < users.length; i++){
      // if(users[i].getAttribute('name') === device.name){
        // break;
      // }
    // }
    // var list_text = $(users[i]).find('.list-text');
    // if(list_text){
      // $(list_text).html('<b>' + device.name + '</b><br>' + device.address + ":" + device.port); 
    // } 
  // };
  // NSDUserList.prototype.rmUserByName = function (name){
    // var users = this.userlist.find('li');
    // var findUser = false;
    // for(var i=0; i < users.length; i++){
      // if(users[i].getAttribute('name') === name){
        // findUser = true;
        // $(users[i]).remove();
        // break;
      // }
    // }
    // return findUser;
  // };
  // NSDUserList.prototype.rmAllUsers = function (){
    // var users = this.userlist.find('li');
    // for(var i=0; i < users.length; i++){
      // $(users[i]).remove();
    // }    
  // };
  // var afNsdUserList = new NSDUserList();  


/**
 * AfSocket类，实现Socket通信
 * 
 */
  var AfSocket = function(){
  };
  /**
   * format of msgfromnative
   * "port":7777
   * "message":"Hi  this is in IMSender test"
   * "to":"rtty123"
   * "time":1418979857244
   * "address":"192.168.5.176"
   * "uuid":"rio1529rio"
   * "from":"cos"
   * "type":"app1"   
   */
  AfSocket.prototype.initServerHandler = function(){
    window.Socket.initHandler(
      function(msgfromnative){
        myLog(msgfromnative, "AfSocket.prototype.initServerHandler");
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
  AfSocket.prototype.startServerSocket = function(serverInfo){
    var that = this;
    window.Socket.startServerSocket(
      function(msgfromnative){
        myLog(msgfromnative, "AfSocket.prototype.startServerSocket");
        that.initServerHandler();
      },
      function(msgfromnative){
        myLog(msgfromnative, "AfSocket.prototype.startServerSocket");
      },
      serverInfo);    
  };
  AfSocket.prototype.stopServerSocket = function(){
    var that = this;
    window.Socket.stopServerSocket(
      function(msgfromnative){
        myLog(msgfromnative, "AfSocket.prototype.stopServerSocket");
        // that.initServerHandler();
      },
      function(msgfromnative){
        myLog(msgfromnative, "AfSocket.prototype.stopServerSocket");
      });    
  };
  /**发送消息msgArr，格式：[name, address, port, content]*/
  AfSocket.prototype.sendMessage = function(successcb, errorcb, msgArr){
    window.Socket.sendMessage(
      function(msgfromnative){
        myLog(msgfromnative + " and message to send:" + msgArr, "AfSocket.prototype.sendMessage");
        successcb();
      },
      function(msgfromnative){
        myLog(msgfromnative + " and message to send:" + msgArr, "AfSocket.prototype.sendMessage");
        errorcb();
      },
      msgArr);
  };
  var afSocket = new AfSocket();
  
  
        // if(!that.nsdchatObj[msgfromnative.address+'.'+msgfromnative.port]){
          // that.nsdchatObj[msgfromnative.address+'.'+msgfromnative.port] = new NSDChat(msgfromnative);
        // }
        // that.nsdchatObj[msgfromnative.address+'.'+msgfromnative.port].load();

  var nsdLogObj = new NsdLogClass();
  var nsdObj = new NsdClass("nsd-android-test", 7777, nsdLogObj);
  nsdObj.scrollToBottom = nsdLogObj.scrollToBottom;
  nsdObj.clearContent = nsdLogObj.clearContent;
  module.exports = nsdObj;
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
    window.NsdModule = cordova.require('af.nsd');
    window.AfCamera = cordova.require('af.camera');
  });
  // channel.onPause.subscribe(function() {
    // console.log('onPause');
  // });
  // channel.onResume.subscribe(function() {
    // console.log('onResume');
  // });
  // channel.onDestroy.subscribe(function() {
    // console.log('onDestroy');
  // });
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