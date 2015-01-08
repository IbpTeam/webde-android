// used for content show.
var NsdLogClass = function(){
  this._device_nsd = $('#content #device_nsd');
  this._content = $('<div></div>');
  if(this._device_nsd.find('.afScrollPanel')){
    this._device_nsd.find('.afScrollPanel').append(this._content);
  }else{
    this._device_nsd.append(this._content);
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
// var nsdLogObj = new NsdLogClass();

/**
 * Class NsdClass is used for Network Service Discovery.
 */ 
var NsdClass = function(name, port, debug) {
  if(!window.NSDNative){
    alert("object window.NSD does not exist.");
    return;
  }
  this._mName = name;
  this._mPort = port;  
  this._deviceList = new Object();
  this._d = debug;
  this._userlist = $('#content #nsd ul.list');
  this._resolveServiceListener = new Array();
  this._registerServiceListener = new Array();
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
  this._entranceId = "entrance_" + this._id;
  // this._chatId = "chat_" + this._id;
  // this._dataId = "data_" + this._id;
  this._chat = new ChatClass(device, socketObj);
};
EntranceClass.prototype.processMsg = function(msgfromnative){
  this._chat.loadChat();
  this._chat.processMsg(msgfromnative);
};
EntranceClass.prototype.loadEntrance = function(){
  if(!$('#'+this._entranceId).length){      
    this.newEntrance();
  }
  $.ui.loadContent('#'+this._entranceId, false, false, "up");
};
EntranceClass.prototype.newEntrance = function(){
  var that = this;
  var device = this._device;
  $.ui.addContentDiv(this._entranceId,
    "<p>Your are Going to communicate with" + device.address + ":" + device.port + ". </p>"
    + "<p>Please Choose an Action Below:</p>"
    + "<ul class='grid-photo'><ul>",
    device.name);
  var entrance = $('#'+this._entranceId);
  entrance.get(0).setAttribute("data-tab", "none");
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
      // console.log("load content: #"+that._chatId);
      that._chat.loadChat();
    })
  ).appendTo(funclist);
  $.create('<li>').append(
     $.create('div', {
        className:'grid-photo-box',
     }).append(
      $.create('a', {}).html("文件浏览")
    ).on('click', function(e){
      // console.log("load content: #"+that._dataId);
      // e.preventDefault();
      // e.stopPropagation();
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
  this._chatId = "chat_" + this._id;
  this._socket = socketObj;
  this._footerId = "nsd_talk_footer";
};
ChatClass.prototype.loadChat = function(){
  if(!$('#'+this._chatId).length){
    this.newChat();
  }
  $.ui.loadContent(this._chatId, false, false, "fade");
  this.reBindSendMsgBtn();
};
ChatClass.prototype.newChat = function(){  
  $.ui.addContentDiv(this._chatId, "<p>Connect To " + this._device.address + ":" + this._device.port + "</p><ul></ul>", this._device.address);
  $('#'+this._chatId).get(0).setAttribute("data-footer", this._footerId);
  // $('#' + id).get(0).setAttribute("data-modal", "true");  
  this._chat = $('#'+this._chatId);
  this._history = this._chat.find('ul');
  // this._textarea = $('#afui #navbar').find('#' + this._footerId).find('textarea');
  // this._submit = $('#afui #navbar').find('#' + this._footerId).find('a');
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
      // that.initServerHandler();
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
