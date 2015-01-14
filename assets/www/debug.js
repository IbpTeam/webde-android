
var TestAPI = function(device){
  this._device = {};
  $.extend(this._device, device);
  this._ID = "testapi";
  this._address = device.address;
  this._port = 8888;
};
TestAPI.prototype.loadTestAPI = function(title){
  if(!$('#'+this._ID).length){
    this.newTestAPI(title);
  }
  if(!this._remotedata || !this._remoteapp){
    this.loadRemoteJS();
  }
  if(!this._panel){
    this._panel = $('#'+this._ID);
    if(this._panel.find('.afScrollPanel')){
      this._panelScroll = this._panel.find('.afScrollPanel');
    }
  }
  $.ui.loadContent(this._ID, false, false, "fade");
};
TestAPI.prototype.newTestAPI = function(title){
  $.ui.addContentDiv(this._ID, "", title);
  this._panel = $('#'+this._ID);
  /**NOTICE: may be encounter error later*/
  if(this._panel.find('.afScrollPanel')){
    this._panelScroll = this._panel.find('.afScrollPanel');
  }
};
TestAPI.prototype.loadRemoteJS = function(cb){
  var that = this;
  //全局方法中对本地对象参数的设置。
  var origin = "http://" + this._address + ":" + this._port;
  requirejs([origin + "/lib/api/data.js", origin + "/lib/api/app.js"], function(data, app){
    that._remotedata = data;
    that._remotedata.sendrequest = function (a, ar) {
      var sd = {};
      var cb = ar.shift();
      sd.api = a;
      sd.args = ar;
      $.ajax({
        url : origin +"/callapi",
        type : "post",
        contentType : "application/json;charset=utf-8",
        dataType : "json",
        data : JSON.stringify(sd),
        success : function(r) {
          setTimeout(cb.apply(null, r), 0);
        },
        error : function(e) {
          throw e;
        }
      });
    };
    
    that._remoteapp = app;
    that._remoteapp.sendrequest = function (a, ar) {
      var sd = {};
      var cb = ar.shift();
      sd.api = a;
      sd.args = ar;
      $.ajax({
        url : origin +"/callapi",
        type : "post",
        contentType : "application/json;charset=utf-8",
        dataType : "json",
        data : JSON.stringify(sd),
        success : function(r) {
          setTimeout(cb.apply(null, r), 0);
        },
        error : function(e) {
          throw e;
        }
      });
    };
    // console.log("data.js: " + that._remotedata);
    // console.log("app.js: " + that._remoteapp);
    var ul = $.create("ul", {className: "list"});    
    ul.append($.create("li", {className: "divider"}).html("data.js方法接口"));
    for(var key in that._remotedata){
      console.log(key);
      ul.append(
        $.create("li", {}).append(
          $.create("a", {}).html(key)
        )
      );
    }
    ul.append($.create("li", {className: "divider"}).html("app.js方法接口"));
    for(var key in that._remoteapp){
      console.log(key);
      console.log(that._remoteapp[key]);
      ul.append(
        $.create("li", {}).append(
          $.create("a", {}).html(key)
        )
      );
    }
    if(that._panelScroll){
      ul.appendTo(that._panelScroll);
    }else{
      ul.appendTo(that._panel);
    }
    //that.getRemoteData();
  },
  function(data){
    alert("fail to load script: " + origin +"/lib/api/data.js");
  });  
};
(
function(){
  function entry(){    
    var device = {"name": "test", "address":"192.168.5.176", "port": 8888};
    var testAPI = new TestAPI(device);
    testAPI.loadTestAPI("TestAPI");
  }
  $(window).on("afui:ready", entry);  
}
)();

// function startDebug(){
  // console.log("in function startDebug.");
// }
// function setBlankPanle(){
  // var afmblank = $("#blank");
  // var blank = afmblank.get(0);
  // blank.setAttribute("data-load", startDebug());  
// }
// setBlankPanle();
