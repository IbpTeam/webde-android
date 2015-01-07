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

  var nsdLogObj = new NsdLogClass();
  var nsdObj = new NsdClass("nsd-android-test", 7777, nsdLogObj);
  nsdObj.scrollToBottom = function(){
    nsdLogObj.scrollToBottom();
  };
  nsdObj.clearContent = function(){
    nsdLogObj.clearContent();
  };
  nsdObj.addResolveServiceListener(function(device){
    if((device.address === null) || (device.port < 0)){
      alert("device in EntranceClass is error");
      return;
    }
    var id = device.address.replace(/\./g, '_') + '_' + device.port;
    var entranceId = "entrance_" + id;
    if(!$('#'+entranceId).length){      
      new EntranceClass(device);
    }    
    $.ui.loadContent('#'+entranceId, false, false, "up");
  });
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