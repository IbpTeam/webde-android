var CameraClass = function(){
  if(!window.navigator.camera){
    window.alert("window.navigator.camera is not found.");
    return;
  }
  this._ID = "org_apache_cordova_camera";
  this._navID = "nav_" + this._ID;
};
CameraClass.prototype.show = function(title){
  if(!$('#'+this._ID).length){      
    this.newPanel(title);
  }
  $.ui.loadContent('#'+this._ID, false, false, "slide");
};
CameraClass.prototype.newPanel = function(title){  
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
  this.addImageDiv();
};
CameraClass.prototype.addNavBar = function(){  
  var that = this;
  var ul = $.create("ul", {className: "list"})
  .append(
    $.create("li", {className: "divider"}).html(this._ID)
  )
  .append(
    $("<li>").append($("<a>").html("startCamera").on("click", function(){
      that.startCamera();
      $.ui.toggleSideMenu();
    }))
  )
  .append(
    $("<li>").append($("<a>").html("cameraGallery").on("click", function(){
      that.cameraGallery();
      $.ui.toggleSideMenu();
    }))
  );  
  var nav = $.create("nav", {id: this._navID});
  nav.append(ul).appendTo($("#afui"));
};
CameraClass.prototype.addImageDiv = function(){
  this._camera_image = $.create("div", {
    id : "camera-image",
    className : "ui-body ui-body-b",
  }).css({
    "background-size" : "100%",
    "min-height" : "250px"
  });
  if(this._panelScroll){
    this._panelScroll.append(this._camera_image);
  }else{
    this._panel.append(this._camera_image);
  }
};
CameraClass.prototype.log = function(str){
  console.log(str);
  // this._ui.append($("<li>").html(str));
  this._ui.html(str);
};
/* Camera */
CameraClass.prototype.startCamera = function () {
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
CameraClass.prototype.cameraGallery = function() {
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

var NativeClass = function(){
  this._ID = "native";
  this._panel = $("#" + this._ID);
  if(this._panel.find('.afScrollPanel')){
    this._panelScroll = this._panel.find('.afScrollPanel');
  }
  //this._navbar = this._panel.data("tab");
  this.initPanel();
  this._timer = new TimerClass();
  this._camera = new CameraClass();
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
      that._camera.show();
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
  this._navID = "nav_" + this._ID;
};
TimerClass.prototype.show = function(title){
  if(!$('#'+this._ID).length){      
    this.newPanel(title);
  }
  $.ui.loadContent('#'+this._ID, false, false, "slide");
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
  });
  document.addEventListener("deviceready", function(){console.log("device ready");}, false);
  document.addEventListener("pause", function(){console.log("pause");}, false);
  document.addEventListener("resume", function(){console.log("resume");}, false);
  channel.onPause.subscribe(function(){console.log("channel onPause");});
  channel.onResume.subscribe(function(){console.log("channel onResume");});
})();