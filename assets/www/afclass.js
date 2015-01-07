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
  this._mName = name;
  this._mPort = port;  
  this._deviceList = new Object();
  this._d = debug;
  this._userlist = $('#content #nsd ul.list');
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
      afSocket.startServerSocket(serviceInfo);
    },
    function(msgfromnative){
      that._d.myLog(msgfromnative, "NsdClass.prototype.registerService");
    },
    serviceInfo
  );
};
NsdClass.prototype.unRegisterService = function() {
  var that = this;
  window.NSDNative.unRegisterService(
    function(msgfromnative){
      that._d.myLog(msgfromnative, "NsdClass.prototype.unRegisterService");
      afSocket.stopServerSocket();
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
        // if(!that.nsdchatObj[msgfromnative.address+'.'+msgfromnative.port]){
          // that.nsdchatObj[msgfromnative.address+'.'+msgfromnative.port] = new NSDChat(msgfromnative);
        // }
        // that.nsdchatObj[msgfromnative.address+'.'+msgfromnative.port].load();
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
// NsdClass.prototype.scrollToBottom = function(){
  // $.ui.scrollToBottom('#device_nsd');
// };
// NsdClass.prototype.clearContent = function(){
  // $(content).html('');
// };