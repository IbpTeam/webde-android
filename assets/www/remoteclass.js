
/**
 * DataClass类，用于聊天界面。
 */
var DataClass = function(device){
  /** format of device: {"type":"_http._tcp.","port":0,"address":"null","name":"Test-UserB"}*/
  this._device = {};
  $.extend(this._device, device);
  this._id = device.address.replace(/\./g, '_') + '_' + device.port;
  this._dataId = this._id + "_remote_data";
  this._address = device.address;
  this._port = 8888;  
};
DataClass.prototype.loadData = function(title){
  if(!$('#'+this._dataId).length){
    this.newData(title);
  }
  if(!this._remotedata || !this._remoteapp){
    this.loadRemoteJS();
  }
  if(!this._panel){
    this._panel = $('#'+this._dataId);
    if(this._panel.find('.afScrollPanel')){
      this._panelScroll = this._panel.find('.afScrollPanel');
    }
  }
  $.ui.loadContent(this._dataId, false, false, "fade");
};
DataClass.prototype.newData = function(title){
  $.ui.addContentDiv(this._dataId, "", title);
  this._panel = $('#'+this._dataId);
  /**NOTICE: may be encounter error later*/
  if(this._panel.find('.afScrollPanel')){
    this._panelScroll = this._panel.find('.afScrollPanel');
  }
  this._panel.attr("data-footer", "none");
  // this.loadRemoteJS();
};
DataClass.prototype.loadRemoteJS = function(cb){
  var that = this;
  //全局方法中对本地对象参数的设置。
  var origin = "http://" + this._address + ":" + this._port;
  requirejs([origin + "/lib/api/data.js", origin + "/lib/api/app.js"], function(data, app){
    // console.log("data.js: " + data);
    // console.log("app.js: " + app);
    // for(var key in app){
      // console.log(key);
    // }
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
    
    that.getRemoteData();
  },
  function(data){
    alert("fail to load script: " + origin +"/lib/api/data.js");
  });  
};
DataClass.prototype.getRemoteData = function(){
  var that = this;
  function handleDataCB(objArray){
    /** format of objArray:
    URI: "rio1529rio#693be79d86e01358c560#document"
    createDev: "rio1529rio"
    createTime: "Fri Nov 14 2014 09:15:13 GMT+0800 (CST)"
    filename: "NewFile"
    id: 1
    is_delete: 0
    lastAccessDev: "rio1529rio"
    lastAccessTime: "Fri Nov 14 2014 09:15:13 GMT+0800 (CST)"
    lastModifyDev: "rio1529rio"
    lastModifyTime: "Fri Nov 14 2014 09:15:13 GMT+0800 (CST)"
    others: "documents"
    path: "/home/cos/.resources/document/data/NewFile.txt"
    postfix: "txt"
    project: "上海专项"
    size: "0"
    */
    // console.log(objArray);
    for(var idx = 0; idx < objArray.length; idx++){
      if(objArray[idx].postfix == 'ppt' || objArray[idx].postfix == 'pptx')
      {
        console.log(objArray[idx].filename);
        var file = $.create("div", {className:"file"})
        .data("uri", objArray[idx].URI)
        .append(
          $.create("div", {className: "icon"}).append(
            $.create("img",{src: "data/icons/powerpoint.png"})
          )
        )
        .append(
          $.create("div", {className: "name", id:objArray[idx].filename}).html(objArray[idx].filename)
        )
        // .on("touchstart", function(e){
          // // $(this).addClass('focus');
          // console.log("touchstart: ");
          // for(var i=0; i<e.touches.length; i++){
            // console.log(e.touches[idx].target);
          // }
        // })
        // .on("touchmove", function(e){
          // $(this).removeClass('focus');
          // // console.log("touchmove");
        // })
        .on("longTap", function(e){
          $(this).addClass('focus');          
        })
        .on("touchend", function(e){   
          if($(this).hasClass('focus')){
            $(this).removeClass('focus');
            var uri = $(this).data('uri');
            // console.log("You click" + uri);
            that.openRemoteData(uri);
          }
        });
        // console.log(that._panel);
        if(that._panelScroll){
          file.appendTo(that._panelScroll);
        }else{
          file.appendTo(that._panel);
        }
      }
    }
  }
  if(!this._remotedata){
    this.loadRemoteJS();
  }else{
    this._remotedata.getAllDataByCate(handleDataCB, "document");
  }
};

DataClass.prototype.openRemoteData = function(uri){
  var that = this;

  function showPopUpPanel(obj){
    /**console.log('get ppt source file', obj);
     * format of obj:
     * {
     * openmethod: "html",
     * format: "txt",
     * title: "文件浏览",
     * content: "成功打开文件/home/cos/.resources/document/data/Firefox OS调研.pptx",
     * windowname: "Firefox OS调研.pptx"
     * }
     */
    btns = {
      "Stop" : function(){
        console.log("Close CB");
        that._remoteapp.sendKeyToApp(function(){}, obj['windowname'], 'Escape');
        },
      "Play" : function(){
        console.log("Play CB");
        that._remoteapp.sendKeyToApp(function(){}, obj['windowname'], 'F5');
        },
      "PageUp" : function(){
        console.log("PageUp CB");
        that._remoteapp.sendKeyToApp(function(){}, obj['windowname'], 'Up');
        },
      "PageDown" : function(){
        console.log("PageDown CB");
        that._remoteapp.sendKeyToApp(function(){}, obj['windowname'], 'Down');
        },
    };
    $("#afui").popPanel({
      title:"播放PPT",
      message:"选择下面的按键操作PPT",
      // onShow:function(){console.log("showing popup");},
      buttons: btns,
    });
  }
  this._remotedata.openDataByUri(showPopUpPanel, uri);
};


/**
 * Browser Remote File.
 */
var RemoteFileBrowser = function(device){
  this._device = {};
  $.extend(this._device, device);
  this._id = device.address.replace(/\./g, '_') + '_' + device.port;
  this._ID = this._id + "_RemoteFileBrowser";
  this._address = device.address;
  this._port = 8888;
  this._cateInfo = new Object();
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
        that._cateInfo[obj.type] = new Object();
        $.extend(that._cateInfo[obj.type], obj);
        var icon;
        switch(obj.type){
          case "Contact":
            icon = "icon user big";
          break;
          case "Picture":
            icon = "icon picture big";
          break;
          case "Video":
            icon = "icon tv big";
          break;
          case "Document":
            icon = "icon paper big";
          break;
          case "Music":
            icon = "icon headset big";
          break;
        };
        ul.append(
          $.create("li", {}).append(
            $.create("a", {className: icon}).html(obj.desc).data("type", obj.type).on("click", function(){
              //console.log($(this).data("type"));
              that.getAllDataByCate($(this).data("type"));
            })
          )
        );
      }
      // that.LogObjObj(that._cateInfo);
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
RemoteFileBrowser.prototype.getAllCate = function(){
  var that = this;
  function getAllCateCb(objArr){
    that.LogObjArray(objArr);
  }  
  this._remotedata.getAllCate(getAllCateCb);
};

RemoteFileBrowser.prototype.getAllDataByCate = function(type){
  var that = this;
  var cate = type;
  function getAllDataByCateCb(objArray){
    // that.LogObjArray(objArray);
    
    if(that._panelScroll){
      that._panelScroll.empty();
    }else{
      that._panel.empty();
    }
    for(var idx = 0; idx < objArray.length; idx++){
      // console.log(objArray[idx].filename);
      var tmpArray = that.getNameAndIconByObj(cate, objArray[idx]);
      var name = tmpArray[0];
      var icon = tmpArray[1];
      console.log(name + ": " + icon);
      var file = $.create("div", {className:"file"})
      .data("uri", objArray[idx].URI)
      .append(
        $.create("div", {className: "icon"}).append(
          $.create("img",{src: "data/icons/" + icon})
        )
      )
      .append(
        $.create("div", {className: "name", id:name}).html(name)
      )
      .on("longTap", function(e){
        $(this).addClass('focus');          
      })
      .on("touchend", function(e){   
        if($(this).hasClass('focus')){
          $(this).removeClass('focus');
          var uri = $(this).data('uri');
          console.log("You click" + uri);
          // that.openRemoteData(uri);
        }
      });
      // console.log(that._panel);
      if(that._panelScroll){
        file.appendTo(that._panelScroll);
      }else{
        file.appendTo(that._panel);
      }
    }
  }
  //Contact, Picture, Video, Document, Music
  this._remotedata.getAllDataByCate(getAllDataByCateCb, type);  
};
RemoteFileBrowser.prototype.getNameAndIconByObj = function(type, obj){
  var name, icon;
  switch(type){
    case "Contact":
      name = obj.name;
      icon = "Contacts.png";
    break;
    case "Picture":
      name = obj.filename;
      icon = "image.png";
    break;
    case "Video":
      name = obj.filename;
      icon = "Videos.png";
    break;
    case "Document":
      name = obj.filename;
      switch(obj.postfix){
        case "ppt":
        case "pptx":
          icon = "powerpoint.png";
        break;
        case 'xls':
        case 'xlsx':
        case 'et':
        case 'ods':        
          icon = "excel.png";
        break;
        case 'doc':
        case 'docx':
        case 'wps':
          icon = "word.png";
        break;
        case 'pdf':
          icon = "pdf.png";
        break;
        case 'txt':
          icon = "text.png";
        break;
        default:
          icon = "none.png";
        break;
      }
    break;
    case "Music":
      name = obj.filename;
      icon = "music.png";
    break;
  };
  return [name, icon];
};
RemoteFileBrowser.prototype.log = function(str){
  console.log(str);
};
RemoteFileBrowser.prototype.LogObj = function(obj){
  for(var key in obj){
    this.log(key + ": " + obj[key]);
  }
};
RemoteFileBrowser.prototype.LogObjArray = function(objArr){
  for(var id in objArr){
    this.log("-----=====Content Of Object=====-----");
    this.LogObj(objArr[id]);
  }
};
RemoteFileBrowser.prototype.LogObjObj = function(objObj){
  for(var key in objObj){
    this.log("-----=====Content Of " + key + "=====-----");
    this.LogObj(objObj[key]);
  }
};
RemoteFileBrowser.prototype.LogUnkown = function(obj){
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