
var TestAPI = function(device){
  this._device = {};
  $.extend(this._device, device);
  this._ID = "testapi";
  this._address = device.address;
  this._port = 8888;  
  this._panel = $('#'+this._ID);
  if(this._panel.find('.afScrollPanel')){
    this._panelScroll = this._panel.find('.afScrollPanel');
  }
  
  this._remotedatajs = new RemoteDataJS(device);
  this._remoteappjs = new RemoteAppJS(device);
  this._remotefilebrowser = new RemoteFileBrowser(device);
  var that = this;
  var ul = $.create("ul", {className: "list"});
  ul.append(
    $.create("li", {}).append(
      $.create("a", {}).html("data.js方法接口").on("click", function(e){
        //console.log("data.js方法接口");
        that._remotedatajs.show();
      })
    )
  );
  ul.append(
    $.create("li", {}).append(
      $.create("a", {}).html("app.js方法接口").on("click", function(e){
        // console.log("app.js方法接口");)
        that._remoteappjs.show();
      })
    )
  );
  ul.append(
    $.create("li", {}).append(
      $.create("a", {}).html("文件浏览").on("click", function(e){
        //console.log("文件浏览");        
        that._remotefilebrowser.show();
      })
    )
  );
  // console.log(ul.get(0));
  if(this._panelScroll){
    ul.appendTo(this._panelScroll);
  }else{
    ul.appendTo(this._panel);
  }
};
TestAPI.prototype.loadTestAPI = function(title){
  $.ui.loadContent(this._ID, false, false, "fade");
};
// TestAPI.prototype.newTestAPI = function(title){
  // $.ui.addContentDiv(this._ID, "", title);
  // this._panel = $('#'+this._ID);
// };

/**
 * Show functions of remote data.js
 */
var RemoteDataJS = function(device){
  this._device = {};
  $.extend(this._device, device);
  this._ID = "remotedatajs";
  this._address = device.address;
  this._port = 8888;
};
RemoteDataJS.prototype.show = function(title){
  if(!$('#'+this._ID).length){
    this.newPanel(title);
  }
  if(!this._remotedata){
    this.loadRemoteJS();
  }
  $.ui.loadContent(this._ID, false, false, "fade");
};
RemoteDataJS.prototype.newPanel = function(title){
  $.ui.addContentDiv(this._ID, "", title);
  this._panel = $('#'+this._ID);
  if(this._panel.find('.afScrollPanel')){
    this._panelScroll = this._panel.find('.afScrollPanel');
  }
};
RemoteDataJS.prototype.loadRemoteJS = function(cb){
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
    var ul = $.create("ul", {className: "list"});
    ul.append($.create("li", {className: "divider"}).html("data.js方法接口"));
    for(var key in that._remotedata){
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
  },
  function(data){
    alert("fail to load script: " + origin +"/lib/api/data.js");
  });  
};
RemoteDataJS.prototype.log = function(str){
  console.log(str);
};
RemoteDataJS.prototype.LOG = function(obj){
  var that = this;
  function logObj(obj){
    for(var id in obj){
      if((typeof obj[id]) === "object"){
        that.log("This is an object, key: " + id);
        logObj(obj[id]);
      }else{
        that.log(id + ": " + obj[id] + " - " + (typeof obj[id]));
      }
    }
  }
  logObj(obj);
};
RemoteDataJS.prototype.LogObjArray = function(objArr){
  for(var id in objArr){
    // this.log(objArr[id]);
    this.log("-----=====new Object=====-----");
    for(var key in objArr[id]){
      this.log(key + ": " + objArr[id][key]);
    }
  }
};
RemoteDataJS.prototype.getAllCate = function(){
  var that = this;
  function getAllCateCb(objArr){
    that.LogObjArray(objArr);
  }  
  this._remotedata.getAllCate(getAllCateCb);
};
RemoteDataJS.prototype.getAllDataByCate = function(){
  var that = this;
  function getAllDataByCateCb(objArr){
    that.LogObjArray(objArr);
  }
  //contact, Picture, video, document, Music
  this._remotedata.getAllDataByCate(getAllDataByCateCb, "document");  
};

/**
 * Show functions of remote app.js
 */
var RemoteAppJS = function(device){
  this._device = {};
  $.extend(this._device, device);
  this._ID = "remoteappjs";
  this._address = device.address;
  this._port = 8888;
};
RemoteAppJS.prototype.show = function(title){
  if(!$('#'+this._ID).length){
    this.newPanel(title);
  }
  if(!this._remotedata){
    this.loadRemoteJS();
  }
  $.ui.loadContent(this._ID, false, false, "fade");
};
RemoteAppJS.prototype.newPanel = function(title){
  $.ui.addContentDiv(this._ID, "", title);
  this._panel = $('#'+this._ID);
  if(this._panel.find('.afScrollPanel')){
    this._panelScroll = this._panel.find('.afScrollPanel');
  }
};
RemoteAppJS.prototype.loadRemoteJS = function(cb){
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
    var ul = $.create("ul", {className: "list"});
    ul.append($.create("li", {className: "divider"}).html("app.js方法接口"));
    for(var key in that._remoteapp){
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
  },
  function(data){
    alert("fail to load script: " + origin +"/lib/api/data.js");
  });  
};
RemoteAppJS.prototype.log = function(str){
  console.log(str);
};
RemoteAppJS.prototype.LOG = function(obj){
  var that = this;
  function logObj(obj){
    for(var id in obj){
      if((typeof obj[id]) === "object"){
        that.log("This is an object, key: " + id);
        logObj(obj[id]);
      }else{
        that.log(id + ": " + obj[id] + " - " + (typeof obj[id]));
      }
    }
  }
  logObj(obj);
};
RemoteAppJS.prototype.LogObjArray = function(objArr){
  for(var id in objArr){
    // this.log(objArr[id]);
    this.log("-----=====new Object=====-----");
    for(var key in objArr[id]){
      this.log(key + ": " + objArr[id][key]);
    }
  }
};

/**
 * Browser Remote File.
 */
var RemoteFileBrowser = function(device){
  this._device = {};
  $.extend(this._device, device);
  this._ID = "RemoteFileBrowser";
  this._address = device.address;
  this._port = 8888;
};
RemoteFileBrowser.prototype.show = function(title){
  if(!$('#'+this._ID).length){
    this.newPanel(title);
  }
  if(!this._remotedata || !this._remoteapp){
    this.loadRemoteJS();
  }else{
    $.ui.loadContent(this._ID, false, false, "fade");
  }
};
RemoteFileBrowser.prototype.newPanel = function(title){
  $.ui.addContentDiv(this._ID, "", title);
  this._panel = $('#'+this._ID);
  
  if(this._panel.find('.afScrollPanel')){
    this._panelScroll = this._panel.find('.afScrollPanel');
  }
};
RemoteFileBrowser.prototype.loadRemoteJS = function(cb){
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
    function getAllCateCB(objArr){
      // that.LogObjArray(objArr);
      var ul = $.create("ul", {className: "list"});
      ul.append($.create("li", {className: "divider"}).html("远程文件浏览"));
      for(var idx in objArr){
        obj = objArr[idx];
        if(("Other" == obj.type) || ("Devices" == obj.type)){
          continue;
        }
        ul.append(
          $.create("li", {}).append(
            $.create("a", {}).html(obj.desc).on("click", function(){
              console.log(obj.type);
            })
          )
        );
      }
      var nav = $.create("nav", {id: "nav_remotefilebrowser"});
      nav.append(ul).appendTo($("#afui"));
      that._panel.attr("data-nav", "nav_remotefilebrowser");
      $.ui.loadContent(that._ID, false, false, "fade");
    }
    that._remotedata.getAllCate(getAllCateCB);
  },
  function(data){
    alert("fail to load script: " + origin +"/lib/api/data.js");
  });  
};
RemoteFileBrowser.prototype.log = function(str){
  console.log(str);
};
RemoteFileBrowser.prototype.LOG = function(obj){
  var that = this;
  function logObj(obj){
    for(var id in obj){
      if((typeof obj[id]) === "object"){
        that.log("This is an object, key: " + id);
        logObj(obj[id]);
      }else{
        that.log(id + ": " + obj[id] + " - " + (typeof obj[id]));
      }
    }
  }
  logObj(obj);
};
RemoteFileBrowser.prototype.LogObjArray = function(objArr){
  for(var id in objArr){
    // this.log(objArr[id]);
    this.log("-----=====new Object=====-----");
    for(var key in objArr[id]){
      this.log(key + ": " + objArr[id][key]);
    }
  }
};

RemoteFileBrowser.prototype.getAllCate = function(){
  var that = this;
  function getAllCateCb(objArr){
    that.LogObjArray(objArr);
  }  
  this._remotedata.getAllCate(getAllCateCb);
};

RemoteFileBrowser.prototype.getAllDataByCate = function(type){
  var that = this;
  function getAllDataByCateCb(objArr){
    that.LogObjArray(objArr);
  }
  //contact, Picture, video, document, Music
  this._remotedata.getAllDataByCate(getAllDataByCateCb, type);  
};

var testAPI;
function entry(){
  var device = {"name": "test", "address":"192.168.5.176", "port": 8888};
  testAPI = new TestAPI(device);
  testAPI.loadTestAPI("TestAPI");
}
$(window).on("afui:ready", entry);
// (
// function(){
// }
// )();

// function startDebug(){
  // console.log("in function startDebug.");
// }
// function setBlankPanle(){
  // var afmblank = $("#blank");
  // var blank = afmblank.get(0);
  // blank.setAttribute("data-load", startDebug());  
// }
// setBlankPanle();
