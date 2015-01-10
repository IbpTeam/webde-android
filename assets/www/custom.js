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
cordova.define("module.nsd", function(require, exports, module) {
  var nsdLogObj = new NsdLogClass();
  var socketObj = new SocketClass(nsdLogObj);
  var nsdObj = new NsdClass("nsd-android-test", 7777, nsdLogObj);

  nsdObj.scrollToBottom = function(){
    nsdLogObj.scrollToBottom();
  };
  nsdObj.clearContent = function(){
    nsdLogObj.clearContent();
  };
  var _entrances = new Object();
  nsdObj.addResolveServiceListener(function(device){
    if(!_entrances[device.address+'.'+device.port]){
      _entrances[device.address+'.'+device.port] = new EntranceClass(device, socketObj);
    }
    _entrances[device.address+'.'+device.port].loadEntrance();
  });
  var registerCb = {
    // serviceInfo = [this._mName, this._mPort];
    start:function(serviceInfo){
      socketObj.startServerSocket(serviceInfo);
    },
    stop:function(){
      socketObj.stopServerSocket();
    }
  };
  nsdObj.addRegisterServiceListener(registerCb);
  
  socketObj.addReceiveMessageListener(function(msgfromnative){
    if(_entrances[msgfromnative.address+'.'+msgfromnative.port]){
      _entrances[msgfromnative.address+'.'+msgfromnative.port].processMsg(msgfromnative);
    }
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
    window.NsdModule = cordova.require('module.nsd');
    window.AfCamera = cordova.require('af.camera');
  });
  // window.onunload = function(){
    // alert("window is unload");
    // console.log("window is unload");
  // };
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