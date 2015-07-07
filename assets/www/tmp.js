define(function() {
  var o = {};
  function sendrequest(a, ar) {
    var sd = {};
    var cb = ar.shift();
    sd.api = a;
    sd.args = ar;
    $.ajax({
      url : "/callapi",
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
  o.loadFile = function() {
    sendrequest("data.loadFile", Array.prototype.slice.call(arguments));
  };
  o.loadResources = function() {
    sendrequest("data.loadResources", Array.prototype.slice.call(arguments));
  };
  o.loadContacts = function() {
    sendrequest("data.loadContacts", Array.prototype.slice.call(arguments));
  };
  o.getAllCate = function() {
    sendrequest("data.getAllCate", Array.prototype.slice.call(arguments));
  };
  o.getAllDataByCate = function() {
    sendrequest("data.getAllDataByCate", Array.prototype.slice.call(arguments));
  };
  o.getAllContacts = function() {
    sendrequest("data.getAllContacts", Array.prototype.slice.call(arguments));
  };
  o.rmDataByUri = function() {
    sendrequest("data.rmDataByUri", Array.prototype.slice.call(arguments));
  };
  o.getDataByUri = function() {
    sendrequest("data.getDataByUri", Array.prototype.slice.call(arguments));
  };
  o.getDataByPath = function() {
    sendrequest("data.getDataByPath", Array.prototype.slice.call(arguments));
  };
  o.openDataByUri = function() {
    sendrequest("data.openDataByUri", Array.prototype.slice.call(arguments));
  };
  o.updateDataValue = function() {
    sendrequest("data.updateDataValue", Array.prototype.slice.call(arguments));
  };
  o.getRecentAccessData = function() {
    sendrequest("data.getRecentAccessData", Array.prototype.slice.call(arguments));
  };
  o.getServerAddress = function() {
    sendrequest("data.getServerAddress", Array.prototype.slice.call(arguments));
  };
  o.getDeviceDiscoveryService = function() {
    sendrequest("data.getDeviceDiscoveryService", Array.prototype.slice.call(arguments));
  };
  o.pasteFile = function() {
    sendrequest("data.pasteFile", Array.prototype.slice.call(arguments));
  };
  o.createFile = function() {
    sendrequest("data.createFile", Array.prototype.slice.call(arguments));
  };
  o.getResourceDataDir = function() {
    sendrequest("data.getResourceDataDir", Array.prototype.slice.call(arguments));
  };
  o.getAllTagsByCategory = function() {
    sendrequest("data.getAllTagsByCategory", Array.prototype.slice.call(arguments));
  };
  o.getTagsByUri = function() {
    sendrequest("data.getTagsByUri", Array.prototype.slice.call(arguments));
  };
  o.getTagsByUris = function() {
    sendrequest("data.getTagsByUris", Array.prototype.slice.call(arguments));
  };
  o.setTagByUri = function() {
    sendrequest("data.setTagByUri", Array.prototype.slice.call(arguments));
  };
  o.getFilesByTags = function() {
    sendrequest("data.getFilesByTags", Array.prototype.slice.call(arguments));
  };
  o.getFilesByTagsInCategory = function() {
    sendrequest("data.getFilesByTagsInCategory", Array.prototype.slice.call(arguments));
  };
  o.rmTagAll = function() {
    sendrequest("data.rmTagAll", Array.prototype.slice.call(arguments));
  };
  o.rmTagsByUri = function() {
    sendrequest("data.rmTagsByUri", Array.prototype.slice.call(arguments));
  };
  o.initDesktop = function() {
    sendrequest("data.initDesktop", Array.prototype.slice.call(arguments));
  };
  o.getAllDesktopFile = function() {
    sendrequest("data.getAllDesktopFile", Array.prototype.slice.call(arguments));
  };
  o.readDesktopConfig = function() {
    sendrequest("data.readDesktopConfig", Array.prototype.slice.call(arguments));
  };
  o.writeDesktopConfig = function() {
    sendrequest("data.writeDesktopConfig", Array.prototype.slice.call(arguments));
  };
  o.shellExec = function() {
    sendrequest("data.shellExec", Array.prototype.slice.call(arguments));
  };
  o.moveFile = function() {
    sendrequest("data.moveFile", Array.prototype.slice.call(arguments));
  };
  o.renameDesktopFile = function() {
    sendrequest("data.renameDesktopFile", Array.prototype.slice.call(arguments));
  };
  o.linkAppToDesktop = function() {
    sendrequest("data.linkAppToDesktop", Array.prototype.slice.call(arguments));
  };
  o.unlinkApp = function() {
    sendrequest("data.unlinkApp", Array.prototype.slice.call(arguments));
  };
  o.moveToDesktopSingle = function() {
    sendrequest("data.moveToDesktopSingle", Array.prototype.slice.call(arguments));
  };
  o.moveToDesktop = function() {
    sendrequest("data.moveToDesktop", Array.prototype.slice.call(arguments));
  };
  o.removeFileFromDB = function() {
    sendrequest("data.removeFileFromDB", Array.prototype.slice.call(arguments));
  };
  o.removeFileFromDesk = function() {
    sendrequest("data.removeFileFromDesk", Array.prototype.slice.call(arguments));
  };
  o.getFilesFromDesk = function() {
    sendrequest("data.getFilesFromDesk", Array.prototype.slice.call(arguments));
  };
  o.getAllVideo = function() {
    sendrequest("data.getAllVideo", Array.prototype.slice.call(arguments));
  };
  o.getAllMusic = function() {
    sendrequest("data.getAllMusic", Array.prototype.slice.call(arguments));
  };
  o.createFileOnDesk = function() {
    sendrequest("data.createFileOnDesk", Array.prototype.slice.call(arguments));
  };
  o.renameFileOnDesk = function() {
    sendrequest("data.renameFileOnDesk", Array.prototype.slice.call(arguments));
  };
  o.getIconPath = function() {
    sendrequest("data.getIconPath", Array.prototype.slice.call(arguments));
  };
  o.setRelativeTagByPath = function() {
    sendrequest("data.setRelativeTagByPath", Array.prototype.slice.call(arguments));
  };
  o.deviceInfo = function() {
    sendrequest("data.deviceInfo", Array.prototype.slice.call(arguments));
  };
  o.getMusicPicData = function() {
    sendrequest("data.getMusicPicData", Array.prototype.slice.call(arguments));
  };
  o.getVideoThumbnail = function() {
    sendrequest("data.getVideoThumbnail", Array.prototype.slice.call(arguments));
  };
  o.test_rdfHandle = function() {
    sendrequest("data.test_rdfHandle", Array.prototype.slice.call(arguments));
  };
  o.test_baseinfo = function() {
    sendrequest("data.test_baseinfo", Array.prototype.slice.call(arguments));
  };
  o.renameDataByUri = function() {
    sendrequest("data.renameDataByUri", Array.prototype.slice.call(arguments));
  };
  o.test_typeHandle = function() {
    sendrequest("data.test_typeHandle", Array.prototype.slice.call(arguments));
  };
  o.test_desktop = function() {
    sendrequest("data.test_desktop", Array.prototype.slice.call(arguments));
  };
  return o;
}); 