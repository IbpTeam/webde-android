/*getAllCate*/
/**Object Array returned by getAllCate:
 {URI: 101, type: "Contact", path: "./frontend-dev/images/contacts.jpg", desc: "联系人"}
 {URI: 102, type: "Picture", path: "./frontend-dev/images/pictures.png", desc: "图片"}
 {URI: 103, type: "Video", path: "./frontend-dev/images/videos.png", desc: "视频"}
 {URI: 104, type: "Document", path: "./frontend-dev/images/documents.jpg", desc: "文档"}
 {URI: 105, type: "Music", path: "./frontend-dev/images/music.png", desc: "音乐"}
 {URI: 106, type: "Other", path: "./frontend-dev/images/other.jpg", desc: "其他"}
 {URI: 107, type: "Devices", path: "./frontend-dev/images/devices.jpg", desc: "设备"}
*/

/*getAllDataByCate*/
//One Element of contact
/**
  URI: rio1529rio#40ee23b453106a4d8f6e#contact
  name: 王枫
  sex: undefined
  age: 
  photoPath: 
  phone: 18500097230
  email: wangfeng@nfs.iscas.ac.cn
  others: 
 */
//One Element of Picture
/**
  is_delete: 0
  URI: rio1529rio#4cf153bbc89505b937bf#picture
  postfix: png
  filename: DeepinScreenshot20140718172730
  id: 25
  size: 1764101
  path: /home/cos/.resources/picture/data/DeepinScreenshot20140718172730.png
  location: Mars
  createTime: Fri Nov 14 2014 09:15:14 GMT+0800 (CST)
  createDev: rio1529rio
  lastAccessTime: Fri Nov 14 2014 09:15:14 GMT+0800 (CST)
  lastAccessDev: rio1529rio
  lastModifyTime: Fri Nov 14 2014 09:15:14 GMT+0800 (CST)
  lastModifyDev: rio1529rio
  others: documents,Technology,before-20140720,TechnicalResearch,desktopEnv,lgy0721
 */
//One Element of Video
/**
  is_delete: 0
  URI: rio1529rio#58e9b3bd45d1700248ba#video
  postfix: ogg
  filename: 火力全开
  id: 5
  size: 23826202
  path: /home/cos/.resources/video/data/火力全开.ogg
  directorName: Xiquan
  actorName: Xiquan
  createTime: Thu Nov 20 2014 15:57:40 GMT+0800 (CST)
  createDev: rio1529rio
  lastAccessTime: Thu Nov 20 2014 15:57:40 GMT+0800 (CST)
  lastAccessDev: rio1529rio
  lastModifyTime: Thu Nov 20 2014 15:57:40 GMT+0800 (CST)
  lastModifyDev: rio1529rio
  others: video 
 */
//One Element of document
/**One Element of document
  is_delete: 0
  URI: rio1529rio#693be79d86e01358c560#document
  postfix: txt
  filename: NewFile
  id: 1
  size: 0
  path: /home/cos/.resources/document/data/NewFile.txt
  project: 上海专项
  createTime: Fri Nov 14 2014 09:15:13 GMT+0800 (CST)
  createDev: rio1529rio
  lastAccessTime: Fri Nov 14 2014 09:15:13 GMT+0800 (CST)
  lastAccessDev: rio1529rio
  lastModifyTime: Fri Nov 14 2014 09:15:13 GMT+0800 (CST)
  lastModifyDev: rio1529rio
  others: documents  
*/
//Music
/**
  is_delete: 0
  URI: rio1529rio#c30e7e666092faa76d7c#music
  postfix: mp3
  filename: 那些年
  id: 12
  size: 6000504
  path: /home/cos/.resources/music/data/那些年.mp3
  format: MPEG 1 layer 3
  bit_rate: 128003
  frequency: 44100
  TIT2: 那些年
  TPE1: 胡夏
  TALB: 那些年,我们一起追的女孩 电影原声带
  TDRC: 2011-08-08
  APIC: e (image/jpeg, 61221 bytes)
  track: 371.12
  TXXX: null
  COMM: null
  createTime: Thu Nov 20 2014 15:57:39 GMT+0800 (CST)
  createDev: rio1529rio
  lastAccessTime: Wed Jan 14 2015 15:13:53 GMT+0800 (CST)
  lastAccessDev: rio1529rio
  lastModifyTime: Thu Nov 20 2014 15:57:39 GMT+0800 (CST)
  lastModifyDev: rio1529rio
  others: musics 
 */


/**Code Patch
// function entry(){
  // var device = {"type":"_http._tcp.","port":7777,"address":"null","name":"nsd-android-test"};
  // var homeObj = new HomeClass(device);
  // homeObj.show();
// }
// $(window).on("afui:ready", entry);

// function debugPort(){
  // var device = {"name": "test", "address":"192.168.5.176", "port": 8888};
  // if(!_entrances[device.address+'.'+device.port]){
    // _entrances[device.address+'.'+device.port] = new EntranceClass(device, socketObj);
  // }
  // _entrances[device.address+'.'+device.port].loadEntrance();
// }
// debugPort();
  
/*
  function logObj(obj){
    for(id in obj){
      if((typeof obj[id]) === object){
        logObj(obj[id]);
      }else{
        log(id + ": " + obj[id] + " - " + (typeof obj[id]));
      }
    }
  }
 */