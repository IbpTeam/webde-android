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

var NativeClass = function(){
  this._ID = "native";
  this._panel = $("#" + this._ID);
  if(this._panel.find('.afScrollPanel')){
    this._panelScroll = this._panel.find('.afScrollPanel');
  }
  this.initPanel();
  this._timer = new TimerClass();
};
NativeClass.prototype.show = function(){
  $.ui.loadContent(this._ID, false, false, "slide");
};
NativeClass.prototype.initPanel = function(){
  var that = this;
  var explan = $("<p>").css({"margin-bottom": "12px", "text-align": "center"}).html("用于对本地功能模块的测试。");
  var ul = $.create("ul", {className: "list inset"}).css({"margin-top": "12px"})
  .append(
    $.create("li", {className: "divider"}).html("本地模块测试")
  )
  .append(
    $("<li>").append($("<a>").html("ibp.plugin.timer").on("click", function(){
      console.log("ibp.plugin.timer");
      that._timer.show();
    }))
  )
  .append(
    $("<li>").append($("<a>").html("org.apache.cordova.camera").on("click", function(){
      console.log("org.apache.cordova.camera");
    }))
  );
  if(this._panelScroll){
    this._panelScroll.append(ul);
  }else{
    this._panel.append(ul);
  };
};

var TimerClass = function(){
  if(!window.TimerNative){
    window.alert("window.TimerNative is not found.");
    return;
  }
  this._ID = "ibp_plugin_timer";
  this._navID = "nav_ibp_plugin_timer";
};
TimerClass.prototype.show = function(title){
  if(!$('#'+this._ID).length){      
    this.newPanel(title);
  }
  $.ui.loadContent('#'+this._ID, false, false, "up");
};
TimerClass.prototype.newPanel = function(title){  
  if(!title){
    title = this._ID;
  }
  var that = this;
  $.ui.addContentDiv(this._ID, "<ul></ul>", title);
  this._panel = $('#'+this._ID);
  this._ui = this._panel.find("ul");
  if(this._panel.find('.afScrollPanel')){
    this._panelScroll = this._panel.find('.afScrollPanel');
  }
  this._panel.data("nav", this._navID);
  this.addNavBar();
};
TimerClass.prototype.addNavBar = function(){  
  var that = this;
  var ul = $.create("ul", {className: "list"})
  .append(
    $.create("li", {className: "divider"}).html(this._ID)
  )
  .append(
    $("<li>").append($("<a>").html("startTimer").on("click", function(){
      that.startTimer();
      $.ui.toggleSideMenu();
    }))
  )
  .append(
    $("<li>").append($("<a>").html("stopTimer").on("click", function(){
      that.stopTimer();
      $.ui.toggleSideMenu();
    }))
  );  
  var nav = $.create("nav", {id: this._navID});
  nav.append(ul).appendTo($("#afui"));
};
TimerClass.prototype.log = function(str){
  console.log(str);
  // this._ui.append($("<li>").html(str));
  this._ui.html(str);
};
TimerClass.prototype.startTimer = function () {
  var that = this;
  window.TimerNative.start(
    function(msgfromnative){
      that.log(msgfromnative.data);
    },
    function(msgfromnative){
      that.log(msgfromnative.data);
    });
};
TimerClass.prototype.stopTimer = function () {
  var that = this;
  window.TimerNative.stop(
    function(msgfromnative){
      that.log(msgfromnative);
    },
    function(msgfromnative){
      that.log(msgfromnative);
    });
};
  
(function(){
  var channel = cordova.require('cordova/channel');
  channel.onPluginsReady.subscribe(function() {
    var device = {"type":"_http._tcp.","port":7777,"address":"null","name":"nsd-android-test"};
    window.homeObj = new HomeClass(device);
    window.nativeObj = new NativeClass();
    //homeObj.show();
    //console.log(homeObj);
    // window.AfTimer = cordova.require('af.timer');
    // window.AfCamera = cordova.require('af.camera');
  });
  // document.body.style.zoom=0.75;
  // document.getElementById("afui").style.height = "100%";
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