var WatchClass = function(){
  if(!window.WatchNative){
    window.alert("window.WatchNative is not found.");
    return;
  }
  this.sendMessage([-1]);
};
WatchClass.prototype.sendMessage = function(info_arr){
  // var args = new Array();
  // args.push();
  window.WatchNative.messageToWear(null, null, info_arr);
};
WatchClass.prototype.addListener = function(cb){
  window.WatchNative.addListener(cb);  
};

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
  this._watch = new WatchClass();
};
DataClass.prototype.loadData = function(title){
  if(!$('#'+this._dataId).length){
    this.newData(title);
  }
  // if(!this._remotedata || !this._remoteapp){
    // this.loadRemoteJS();
  // }  
  this.getRemoteData();
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
DataClass.prototype.getRemoteData = function(){
  var that = this;
  function handleDataCB(type, objArray){
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
    if(type !== null){
      console.log("handleDataCB Error");
      return;
    }
    if(that._panelScroll){
      that._panelScroll.html("");
    }else{
      that._panel.html("");
    }
    // console.log(objArray);
    for(var idx = 0; idx < objArray.length; idx++){
      if(objArray[idx].postfix == 'ppt' || objArray[idx].postfix == 'pptx')
      {
        console.log(objArray[idx].filename);
        var file = $.create("div", {className:"file"})
        .data("uri", objArray[idx].URI)
        .append(
          $.create("div", {className: "icon"}).append(
            $.create("img",{src: "custom/data/icons/powerpoint.png"})
          )
        )
        .append(
          $.create("div", {className: "name", id:objArray[idx].filename}).html(objArray[idx].filename)
        )
        /**touchstart touchmove touchend*/
        .on("longTap", function(e){
          $(this).addClass('focus');          
        })
        .on("touchend", function(e){   
          if($(this).hasClass('focus')){
            $(this).removeClass('focus');
            var uri = $(this).data('uri');
            console.log("You click" + uri);
            that.openRemoteData(uri);
          }
        });
        if(that._panelScroll){
          file.appendTo(that._panelScroll);
        }else{
          file.appendTo(that._panel);
        }
      }
    }
  }
  window._remotedata.getAllDataByCate(handleDataCB, "document");  
};
DataClass.prototype.setWatchCallback = function(){
  var that = this;
  this._watch.addListener(function(type){
    switch(type){
      case 1:
        window._remoteapp.sendKeyToApp(function(){}, that._remoteWindowName, 'Down');
      break;
      case 0:
        window._remoteapp.sendKeyToApp(function(){}, that._remoteWindowName, 'Up');
      break;
    }
  });
};
DataClass.prototype.openRemoteData = function(uri){
  var that = this;
  function showPopUpPanel(status, obj){
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
    that._remoteWindowName = obj['windowname'];
    btns = {
      "Stop" : function(){
          console.log("Close CB");
          window._remoteapp.sendKeyToApp(function(){}, that._remoteWindowName, 'Escape');
          if(that._watch){
            that._watch.sendMessage([2]);
          }
        },
      "Play" : function(){
          console.log("Play CB");
          window._remoteapp.sendKeyToApp(function(){}, that._remoteWindowName, 'F5');
          if(that._watch){
            that._watch.sendMessage([0]);
          }
        },
      "PageUp" : function(){
          console.log("PageUp CB");
          window._remoteapp.sendKeyToApp(function(){}, that._remoteWindowName, 'Up');
        },
      "PageDown" : function(){
          console.log("PageDown CB");
          window._remoteapp.sendKeyToApp(function(){}, that._remoteWindowName, 'Down');
        },
    };
    $("#afui").popPanel({
      title:"播放PPT",
      message:"选择下面的按键操作PPT",
      // onShow:function(){console.log("showing popup");},
      buttons: btns,
    });
  }
  window._remotedata.openDataByUri(showPopUpPanel, uri);
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
  //if(!this._remotedata || !this._remoteapp){
  //  this.loadRemoteJS();
  this.setNavBar();
  //}else{
    $.ui.loadContent(this._ID, false, false, "fade");
  //}
};
RemoteFileBrowser.prototype.newPanel = function(title){
  $.ui.addContentDiv(this._ID, "", title);
  this._panel = $('#'+this._ID);  
  if(this._panel.find('.afScrollPanel')){
    this._panelScroll = this._panel.find('.afScrollPanel');
  }
  this._panel.attr("data-footer", "none");
};
RemoteFileBrowser.prototype.setNavBar = function(){
  var that = this;
  //全局方法中对本地对象参数的设置。
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
  if(!$('#nav_remotefilebrowser').length){
    window._remotedata.getAllCate(getAllCateCB);
  }
};
RemoteFileBrowser.prototype.getAllCate = function(){
  var that = this;
  function getAllCateCb(objArr){
    that.LogObjArray(objArr);
  }  
  window._remotedata.getAllCate(getAllCateCb);
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
    $.ui.toggleSideMenu();
  }
  //Contact, Picture, Video, Document, Music
  window._remotedata.getAllDataByCate(getAllDataByCateCb, type);  
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
