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
  var funcEntrance;
  nsdObj.addResolveServiceListener(function(device){
    // if((device.address === null) || (device.port < 0)){
      // alert("device in EntranceClass is error");
      // return;
    // }
    var id = device.address.replace(/\./g, '_') + '_' + device.port;
    funcEntrance = new EntranceClass(device);
    funcEntrance.loadEntrance();
    // var entranceId = "entrance_" + id;
    // if(!$('#'+entranceId).length){      
      // new EntranceClass(device);
    // }
    // $.ui.loadContent('#'+entranceId, false, false, "up");
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