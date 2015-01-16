var HomeClass = function(device){
  this._device = {};
  $.extend(this._device, device);
  this._ID = "home";
  this._httpPort = 8888;
  this._socketPort = 7777;
  this.initObject();
  this.initPanel();
};
HomeClass.prototype.show = function(){
  $.ui.loadContent(this._ID, false, false, "fade");  
};
HomeClass.prototype.initObject = function(){
  var that = this;
  this._nsdLogObj = new NsdLogClass();
  this._entrances = new Object();
  
  this._socketObj = new SocketClass(this._nsdLogObj);
  var serviceInfo = [this._device.name, this._socketPort];
  this._socketObj.startServerSocket(serviceInfo); 
  this._socketObj.addReceiveMessageListener(function(msgfromnative){
    console.log(msgfromnative);
    if(that._entrances[msgfromnative.address+'.'+msgfromnative.port]){
      that._entrances[msgfromnative.address+'.'+msgfromnative.port].processMsg(msgfromnative);
    }
  });  

  this._nsdObj = new NsdClass(this._device, this._nsdLogObj);
  this._nsdObj.addResolveServiceListener(function(device){
    if(!that._entrances[device.address+'.'+device.port]){
      that._entrances[device.address+'.'+device.port] = new EntranceClass(device, that._socketObj);
    }
    that._entrances[device.address+'.'+device.port].show();
  });
  var registerCb = {
    /** format of ServiceInfo: [this._mName, this._mPort];*/
    start:function(serviceInfo){
      //socketObj.startServerSocket(serviceInfo);
    },
    stop:function(){
      socketObj.stopServerSocket();
    }
  };
  this._nsdObj.addRegisterServiceListener(registerCb);
};

HomeClass.prototype.initPanel = function(){
  var that = this;
  var h2 = $.create("h2", {}).css({"text-align": "center"}).html("远程交互");
  var explan = $("<ul>").css({"margin-bottom": "10px"})
  .append(
    $("<li>").html("网络发现：通过网络发现列表。")
  )
  .append(
    $("<li>").html("设备连接：通过输入IP地址。")
  )
  .append(
    $("<li>").html("二维码扫描：通过二维码扫描。")
  );
  var ul = $.create("ul", {className: "list inset"})
  .append(
    $.create("li", {className: "divider"}).html("登录界面入口")
  )
  .append(
    $("<li>").append($("<a>").html("网络发现").on("click", function(){
      $("footer#tohomepanel a").removeClass("pressed");
      // $.ui.loadContent("#nsd", false, false, "slide");
      that._nsdObj.show();
    }))
  )
  .append(
    $("<li>").append($("<a>").html("设备连接").on("click", function(){
      var popup = $("#afui").popup(
        {
          title : "输入设备信息",
          message : "用户名: <input type='text' class='af-ui-forms' data-id='name'><br> " +
          "设备地址: <input type='text' class='af-ui-forms' data-id='address' style='webkit-text-security:disc'>",
          cancelText : "取消",
          cancelCallback : function() {
          },
          doneText : "登录",
          doneCallback : function() {
            var name = $('#' + popup.id).find("input[data-id='name']").val();
            var address = $('#' + popup.id).find("input[data-id='address']").val();
            var fullUrl = 'http://' + address + ':' + that._httpPort;
            if(address){
              HomeClass.prototype.checkNetwork(fullUrl,
                function(){
                  console.log(name + ": " + address + " ok");
                  if(!name){
                    name = address;
                  }
                  var device = {"type":"_http._tcp.","port":that._socketPort,"address":address,"name":name};
                  if(!that._entrances[device.address+'.'+device.port]){
                    that._entrances[device.address+'.'+device.port] = new EntranceClass(device, that._socketObj);
                  }
                  that._entrances[device.address+'.'+device.port].show();
                },
                function(){
                  window.alert(fullUrl + " is not open.");
                }
              );
            }else{
                window.alert("地址不能为空");            
            }
            console.log(name + ": " + address);
          },
          cancelOnly : false
        }
      );
      //add default value.      
      $('#' + popup.id).find("input[data-id='address']").attr("value", "192.168.5.176");
    }))
  )
  .append(
    $("<li>").append($("<a>").html("二维码扫描").on("click", function(){
      console.log("to 二维码扫描");
    }))
  );
  this._ID = '#home';
  this._panel = $('#content ' + this._ID);
  if(this._panelScroll = this._panel.find('.afScrollPanel')){
    this._panelScroll.append(h2);
    this._panelScroll.append(explan);
    this._panelScroll.append(ul);
  }else{
    this._panel.append(h2);
    this._panelScroll.append(explan);
    this._panel.append(ul);    
  };
  this.show();
};

HomeClass.prototype.checkNetwork = function(url2test, successcb, failcb){
  $.ajax({
    type: "GET",
    cache: false,
    url: url2test,
    data: "",
    success: function(){
      successcb();
    },
    error:function(){
      failcb();
    }
  });
};

// used for content show.
var NsdLogClass = function(){
  this._panel = $('#content #device_nsd');
  this._content = $('<div></div>');
  if(this._panel.find('.afScrollPanel')){
    this._panelScroll = this._panel.find('.afScrollPanel');
  }
  if(this._panelScroll){
    this._panelScroll.append(this._content);
  }else{
    this._panel.append(this._content);
  }
  this._debug = true;
};
NsdLogClass.prototype.myLog = function(info, prefix){
  if(!this._debug){
    return;
  }
  switch(typeof info){
    case "object":
      info = JSON.stringify(info);
    break;
  }
  info = prefix + ": " + info;
  console.log(info);
  this._content.append($('<p></p>').html(info));
};
NsdLogClass.prototype.scrollToBottom = function(){
  $.ui.scrollToBottom('#device_nsd');
};
NsdLogClass.prototype.clearContent = function(){
  this._content.html('');
};

/**
 * Class NsdClass is used for Network Service Discovery.
 */ 
var NsdClass = function(device, debug) {
  if(!window.NSDNative){
    alert("object window.NSD does not exist.");
    return;
  }
  this._device = {};
  $.extend(this._device, device);
  this._ID = "nsd";
  this._mName = device.name;
  this._mPort = device.port;  
  this._deviceList = new Object();
  this._d = debug;
  this._resolveServiceListener = new Array();
  this._registerServiceListener = new Array();
};
NsdClass.prototype.show = function(title){
  if(!$('#'+this._ID).length){
    this.newPanel(title);
  }
  $.ui.loadContent(this._ID, false, false, "slide");
};
NsdClass.prototype.newPanel = function(title){
  if(!title){
    title = "在线服务列表"; 
  }
  $.ui.addContentDiv(this._ID, "", title);
  this._panel = $('#'+this._ID);
  this._panel.data("nav", "nav_nsd").data("footer", "tohomepanel");  
  if(this._panel.find('.afScrollPanel')){
    this._panelScroll = this._panel.find('.afScrollPanel');
  }
  this._userlist = $.create("ul", {className: "list"});
  if(this._panelScroll){
    this._panelScroll.append(this._userlist);
  }else{
    this._panel.append(this._userlist);    
  }
  this.addNavBar();
};

// <!-- 在线服务列表 data-tab="navbar_nsd"  -->
// <div class="panel" id="nsd" title="在线服务列表" data-nav="nav_nsd" data-footer='tohomepanel'>
    // <ul class="list">             
    // </ul>
// </div>
NsdClass.prototype.addNavBar = function(){
  var that = this;
  var ul = $.create("ul", {className: "list"})
  .append(
    $.create("li", {className: "divider"}).html("需要插件ibp.plugin.nsd")
  )
  .append(
    $("<li>").append($("<a>").html("initNsd").on("click", function(){
      that.initNsd();
      $.ui.toggleSideMenu();
    }))
  )
  .append(
    $("<li>").append($("<a>").html("stopNsd").on("click", function(){
      that.stopNsd();
      $.ui.toggleSideMenu();
    }))
  )
  .append(
    $("<li>").append($("<a>").html("startDiscovery").on("click", function(){
      that.startDiscovery();
      $.ui.toggleSideMenu();
    }))
  )
  .append(
    $("<li>").append($("<a>").html("showDeviceList").on("click", function(){
      that.showDeviceList();
      $.ui.toggleSideMenu();
    }))
  )
  .append(
    $("<li>").append($("<a>").html("stopDiscovery").on("click", function(){
      that.stopDiscovery();
      $.ui.toggleSideMenu();
    }))
  )
  .append(
    $("<li>").append($("<a>").html("registerService").on("click", function(){
      that.registerService();
      $.ui.toggleSideMenu();
    }))
  )
  .append(
    $("<li>").append($("<a>").html("unRegisterService").on("click", function(){
      that.unRegisterService();
      $.ui.toggleSideMenu();
    }))
  )
  .append(
    $("<li>").append($("<a>").html("scrollToBottom").on("click", function(){
      that._d.scrollToBottom();
      $.ui.toggleSideMenu();
    }))
  )
  .append(
    $("<li>").append($("<a>").html("clearContent").on("click", function(){
      that._d.clearContent();
      $.ui.toggleSideMenu();
    }))
  );  
  var nav = $.create("nav", {id: "nav_nsd"});
  nav.append(ul).appendTo($("#afui"));
// <nav id="nav_nsd">    
    // <ul class="list">
        // <li class="divider">
            // 需要插件ibp.plugin.nsd
        // </li>
        // <li>
            // <a onclick="NsdModule.initNsd();$.ui.toggleSideMenu();">initNsd</a>
        // </li>
        // <li>
            // <a onclick="NsdModule.stopNsd();$.ui.toggleSideMenu();">stopNsd</a>
        // </li>
        // <li>
            // <a onclick="NsdModule.startDiscovery();$.ui.toggleSideMenu();">startDiscovery</a>
        // </li>
        // <li>
            // <a onclick="NsdModule.showDeviceList();$.ui.toggleSideMenu();">showDeviceList</a>
        // </li>
        // <li>
            // <a onclick="NsdModule.stopDiscovery();$.ui.toggleSideMenu();">stopDiscovery</a>
        // </li>
        // <li>
            // <a onclick="NsdModule.registerService();">registerService</a>
        // </li>
        // <li>
            // <a onclick="NsdModule.unRegisterService();">unRegisterService</a>
        // </li>
    // </ul>
  // </nav>
};
NsdClass.prototype.addResolveServiceListener = function(cb){
  this._resolveServiceListener.push(cb);
};
NsdClass.prototype.removeResolveServiceListener = function(cb){
  for(index in this._resolveServiceListener){
  if(this._resolveServiceListener[index] == cb)
    this._resolveServiceListener.splice(index, 1);
  }
};
NsdClass.prototype.callResolveServiceListener = function(msgfromnative){
  for(index in this._resolveServiceListener){
    this._resolveServiceListener[index](msgfromnative);
  }
};
NsdClass.prototype.addRegisterServiceListener = function(cb){
  //format: {start:startcb, stop:stopcb}
  this._registerServiceListener.push(cb);
};
NsdClass.prototype.removeRegisterServiceListener = function(cb){
  for(index in this._registerServiceListener){
  if(this._registerServiceListener[index] == cb)
    this._registerServiceListener.splice(index, 1);
  }
};
NsdClass.prototype.callRegisterServiceListener = function(state, serviceInfo){
  for(index in this._registerServiceListener){
    this._registerServiceListener[index][state](serviceInfo);
  }
};
NsdClass.prototype.initNsd = function() {
  //initNsd is used for service discovery, onPause, onDestroy, onResume.
  var that = this;
  window.NSDNative.initNsd(
    function(msgfromnative){
      switch(typeof msgfromnative){
        case "object":
          switch(msgfromnative.type){
            case 'onServiceFound':
              that._d.myLog(msgfromnative.type + ": " + JSON.parse(msgfromnative.data).name, "NsdClass.prototype.initNsd");
              that.addADevice(JSON.parse(msgfromnative.data));
            break;
            case 'onServiceLost':
              that._d.myLog(msgfromnative.type + ": " + JSON.parse(msgfromnative.data).name, "NsdClass.prototype.initNsd");
              that.removeADevice(JSON.parse(msgfromnative.data));
            break;
            case 'onPause':
            case 'onDestroy':
              that._d.myLog(msgfromnative.type + ": " + msgfromnative.data, "NsdClass.prototype.initNsd");
              that.clearDeviceList();
            break;
            default:
              that._d.myLog(msgfromnative.type + ": " + msgfromnative.data, "NsdClass.prototype.initNsd");
            break;
          }
          break;
        case "string":
          that._d.myLog(msgfromnative, "NsdClass.prototype.initNsd");
        break;
      }
    },
    function(msgfromnative){
      that._d.myLog(msgfromnative, "NsdClass.prototype.initNsd");
    });
};
/*
 * NsdClass.prototype.resolveService = function(){}
 * resolveService is closely related to query selector object,
 * so it is used as a inner function.
 */
NsdClass.prototype.stopNsd = function() {
  var that = this;
  window.NSDNative.stopNsd(
    function(msgfromnative){
      that._d.myLog(msgfromnative, "NsdClass.prototype.stopNsd");
    },
    function(msgfromnative){
      that._d.myLog(msgfromnative, "NsdClass.prototype.stopNsd");
    });
    this.clearDeviceList();
};

NsdClass.prototype.startDiscovery = function() {
  var that = this;
  window.NSDNative.startDiscovery(
    function(msgfromnative){
      that._d.myLog(msgfromnative, "NsdClass.prototype.startDiscovery");
    },
    function(msgfromnative){
      that._d.myLog(msgfromnative, "NsdClass.prototype.startDiscovery");
    }
  );
};
NsdClass.prototype.stopDiscovery = function() {
  var that = this;
  window.NSDNative.stopDiscovery(
    function(msgfromnative){
      that._d.myLog(msgfromnative, "NsdClass.prototype.stopDiscovery");
    },
    function(msgfromnative){
      that._d.myLog(msgfromnative, "NsdClass.prototype.stopDiscovery");
    }
  );
  this.clearDeviceList();
};
NsdClass.prototype.registerService = function() {
  var that = this;
  serviceInfo = [this._mName, this._mPort];
  window.NSDNative.registerService(
    function(msgfromnative){
      that._d.myLog(msgfromnative, "NsdClass.prototype.registerService");
      // afSocket.startServerSocket(serviceInfo);
      that.callRegisterServiceListener("start", serviceInfo);
    },
    function(msgfromnative){
      that._d.myLog(msgfromnative, "NsdClass.prototype.registerService");
    },
    serviceInfo
  );
};
NsdClass.prototype.unRegisterService = function() {
  var that = this;
  serviceInfo = [this._mName, this._mPort];
  window.NSDNative.unRegisterService(
    function(msgfromnative){
      that._d.myLog(msgfromnative, "NsdClass.prototype.unRegisterService");
      // afSocket.stopServerSocket();
      that.callRegisterServiceListener("stop", serviceInfo);
    },
    function(msgfromnative){
      that._d.myLog(msgfromnative, "NsdClass.prototype.unRegisterService");
    });
};

// used for store device info list
/*
 * {"type":"._http._tcp","port":8080,"address":"192.168.5.176","name":"TestUserA"}
 * {"type":"_http._tcp.","port":0,"address":"null","name":"TestUserA"} 
 */
NsdClass.prototype.addADevice = function(device){
  var isDeviceExist = false;
  for(id in this._deviceList){
    obj = this._deviceList[id];
    if(obj.name == device.name){
      isDeviceExist = true;
      break;
    }
  }
  if(isDeviceExist){
    this._d.myLog("Error: " + device.name + " has exist.", "addADevice");
  }else{
    this._deviceList[device.name] = device;
    this.appendUser(device.name, '用户：' + device.name);
  }
};
NsdClass.prototype.overWriteADevice = function(device){
  var isDeviceExist = false;
  for(id in this._deviceList){
    obj = this._deviceList[id];
    if(obj.name == device.name){
      isDeviceExist = true;
      break;
    }
  }
  this._deviceList[device.name] = device;
  if(isDeviceExist){
    this.overWriteUser(device);
  }else{
    this.appendUser(device.name, '用户：' + device.name);
  }    
};
NsdClass.prototype.removeADevice = function(device){
  var obj;
  for(id in this._deviceList){
    obj = this._deviceList[id];
    if(obj.name == device.name){
      delete this._deviceList[id];
      this.rmUserByName(device.name);
      return true;
    }
  }
  return false;
};
NsdClass.prototype.clearDeviceList = function(){
  for(id in this._deviceList){
    delete this._deviceList[id];
  }
  this.rmAllUsers();
};
NsdClass.prototype.showDeviceList = function(){
  for(id in this._deviceList){
    this._d.myLog(JSON.stringify(this._deviceList[id]), "NsdClass.prototype.showDeviceList");
  }    
};

// The following function is used to change view of online device.
NsdClass.prototype.appendUser = function (name, txt){
  var that = this;
  var af_a = $.create('<a>').on('click', function(e){
    window.NSDNative.resolveService(
      function(msgfromnative){
        that._d.myLog(JSON.stringify(msgfromnative), "NSDUserList.prototype.appendUser");
        that.overWriteADevice(msgfromnative);
        that.callResolveServiceListener(msgfromnative);
      },
      function(msgfromnative){
        that._d.myLog(msgfromnative, "NSDUserList.prototype.appendUser");
      },
      $(this).parent().attr('name')
    );
    localStorage.setItem("name", $(this).parent().attr('name'));
    e.preventDefault();
    e.stopPropagation();
  });
  $.create('img', {
      className:'list-image',
      'src':'data/male_user_icon.svg',
  }).appendTo($(af_a));
  $.create('div', {
      className:'list-text',
  }).html(
      '<b>' + name + '</b><br>' + txt
  ).appendTo($(af_a));
  this._userlist.append($('<li>').attr('name', name).append($(af_a)));
};
NsdClass.prototype.overWriteUser = function (device){
  var users = this._userlist.find('li');
  for(var i=0; i < users.length; i++){
    if(users[i].getAttribute('name') === device.name){
      break;
    }
  }
  var list_text = $(users[i]).find('.list-text');
  if(list_text){
    $(list_text).html('<b>' + device.name + '</b><br>' + device.address + ":" + device.port); 
  } 
};
NsdClass.prototype.rmUserByName = function (name){
  var users = this._userlist.find('li');
  var findUser = false;
  for(var i=0; i < users.length; i++){
    if(users[i].getAttribute('name') === name){
      findUser = true;
      $(users[i]).remove();
      break;
    }
  }
  return findUser;
};
NsdClass.prototype.rmAllUsers = function (){
  var users = this._userlist.find('li');
  for(var i=0; i < users.length; i++){
    $(users[i]).remove();
  }    
};

/**
 * EntranceClass: entrance for communicate with device
 */
var EntranceClass = function(device, socketObj){
  /** 
   * format of device: 
   * {"type":"_http._tcp.","port":0,"address":"null","name":"Test-UserB"}
   */
  if((device.address === null) || (device.port < 0)){
    alert("device in EntranceClass is error");
    return;
  }
  this._device = {};
  $.extend(this._device, device);  
  this._id = device.address.replace(/\./g, '_') + '_' + device.port;
  this._entranceId = this._id + "_entrance";
  this._chat = new ChatClass(device, socketObj);
  this._data = new DataClass(device);
  this._remotefilebrowser = new RemoteFileBrowser(device);
};
EntranceClass.prototype.processMsg = function(msgfromnative){
  this._chat.loadChat();
  this._chat.processMsg(msgfromnative);
};
EntranceClass.prototype.show = function(){
  if(!$('#'+this._entranceId).length){      
    this.newPanel();
  }
  $.ui.loadContent('#'+this._entranceId, false, false, "up");
};
EntranceClass.prototype.newPanel = function(){
  var that = this;
  var device = this._device;
  $.ui.addContentDiv(this._entranceId,
    "<p>设备名：" + device.name + "</p>"
    + "<p>设备地址：" + device.address + ":" + device.port + ". </p>"
    + "<p>请选择下面的操作：</p>"
    + "<ul class='grid-photo'><ul>",
    "功能列表");
  var entrance = $('#'+this._entranceId);
  //entrance.get(0).setAttribute("data-tab", "none");
  var funclist = entrance.find('ul');
  /*
   * 不能为a绑定事件？
   */
  $.create('<li>').append(
     $.create('div', {
        className:'grid-photo-box',
     }).append(
       $.create('a', {}).html("聊天")
    ).on('click', function(e){
      that._chat.loadChat("聊天");
    })
  ).appendTo(funclist);
  $.create('<li>').append(
     $.create('div', {
        className:'grid-photo-box',
     }).append(
       //href:"http://192.168.5.176:8888/index.html", target:"_blank"
      $.create('a', {}).html("ppt列表")
    )
    .on('click', function(e){
      that._data.loadData("ppt列表");
      // e.preventDefault();
      // e.stopPropagation();
    })
  ).appendTo(funclist);
  $.create('<li>').append(
     $.create('div', {
        className:'grid-photo-box',
     }).append(
      $.create('a', {}).html("文件浏览")
    )
    .on('click', function(e){
      that._remotefilebrowser.show("文件浏览");
    })
  ).appendTo(funclist);
  
};

/**
 * ChatClass类，用于聊天界面。
 */
var ChatClass = function(device, socketObj){
  /** format of device: {"type":"_http._tcp.","port":0,"address":"null","name":"Test-UserB"}*/
  this._device = {};
  $.extend(this._device, device);
  this._id = device.address.replace(/\./g, '_') + '_' + device.port;
  this._chatId = this._id + "_chat";
  this._socket = socketObj;
  this._footerId = "nsd_talk_footer";
};
ChatClass.prototype.loadChat = function(title){
  if(!$('#'+this._chatId).length){
    this.newChat(title);
  }
  $.ui.loadContent(this._chatId, false, false, "fade");
  this.reBindSendMsgBtn();
};
ChatClass.prototype.newChat = function(title){  
  $.ui.addContentDiv(this._chatId, "<p>Connect To " + this._device.address + ":" + this._device.port + "</p><ul></ul>", title);
  $('#'+this._chatId).get(0).setAttribute("data-footer", this._footerId);
  // $('#' + id).get(0).setAttribute("data-modal", "true");  
  this._chat = $('#'+this._chatId);
  this._history = this._chat.find('ul');
};
ChatClass.prototype.reBindSendMsgBtn = function(){
  var that = this;
  this._textarea = $('#afui #navbar').find('#' + this._footerId).find('textarea');
  this._submit = $('#afui #navbar').find('#' + this._footerId).find('a');
  this._submit.unbind("click");
  this._submit.bind("click", function(){
    var message = that._textarea.val();
    function successCb(){
      that._history.append($('<li></li>').html("I say: " + message));
      that._textarea.val('');          
    }
    function errorCb(){
      that._history.append($('<li></li>').html("Failed to send Message: " + message));
      that._textarea.val('');          
    }
    if(message.length){
      that._socket.sendMessage(successCb, errorCb, [that._device.name, that._device.address, that._device.port, message]);
    }else{
      alert("内容不能为空");
    }
  });  
};
ChatClass.prototype.processMsg = function(msgObj){
  this._history.append($('<li></li>').html(msgObj.from + ": " + msgObj.message));
};

/**
 * AfSocket类，实现Socket通信
 * 
 */
var SocketClass = function(debug){
  if(!window.SocketNative){
    alert("object window.SocketNative does not exist.");
    return;
  }
  this._receiveMessageListener = new Array();
  this._d = debug;
};
SocketClass.prototype.addReceiveMessageListener = function(cb){
  this._receiveMessageListener.push(cb);
};
SocketClass.prototype.removeReceiveMessageListener = function(cb){
  for(index in this._receiveMessageListener){
  if(this._receiveMessageListener[index] == cb)
    this._receiveMessageListener.splice(index, 1);
  }
};
SocketClass.prototype.callReceiveMessageListener = function(msgfromnative){
  for(index in this._receiveMessageListener){
    if(this._receiveMessageListener[index]){
      this._receiveMessageListener[index](msgfromnative);
    }
  }
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
SocketClass.prototype.initServerHandler = function(){
  var that = this;
  window.SocketNative.initHandler(
    function(msgfromnative){
      switch(typeof msgfromnative){
        case "object":
          // afNsdUserList.processMsg(msgfromnative);
          that._d.myLog(msgfromnative, "SocketClass.prototype.initServerHandler");
          that.callReceiveMessageListener(msgfromnative);
        break;
        case "string":
          that._d.myLog(msgfromnative, "SocketClass.prototype.initServerHandler");
        break;
      }
    },
    function(msgfromnative){
      that._d.myLog(msgfromnative, "SocketClass.prototype.initServerHandler");
    });    
};
SocketClass.prototype.startServerSocket = function(serverInfo){
  var that = this;
  window.SocketNative.startServerSocket(
    function(msgfromnative){
      that._d.myLog(msgfromnative, "SocketClass.prototype.startServerSocket");
      that.initServerHandler();
    },
    function(msgfromnative){
      that._d.myLog(msgfromnative, "SocketClass.prototype.startServerSocket");
    },
    serverInfo);    
};
SocketClass.prototype.stopServerSocket = function(){
  var that = this;
  window.SocketNative.stopServerSocket(
    function(msgfromnative){
      that._d.myLog(msgfromnative, "SocketClass.prototype.stopServerSocket");
    },
    function(msgfromnative){
      that._d.myLog(msgfromnative, "SocketClass.prototype.stopServerSocket");
    });    
};
/**发送消息msgArr，格式：[name, address, port, content]*/
SocketClass.prototype.sendMessage = function(successcb, errorcb, msgArr){
  var that = this;
  window.SocketNative.sendMessage(
    function(msgfromnative){
      that._d.myLog(msgfromnative + " and message to send:" + msgArr, "SocketClass.prototype.sendMessage");
      successcb();
    },
    function(msgfromnative){
      that._d.myLog(msgfromnative + " and message to send:" + msgArr, "SocketClass.prototype.sendMessage");
      errorcb();
    },
    msgArr);
};
