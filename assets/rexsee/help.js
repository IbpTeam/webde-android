function toggle(id){
	var obj = document.getElementById(id);
	obj.style.display=(obj.style.display=='none')?'':'none';	
}
window.onException = function(className, message){
	rexseeDialog.alert("ÏµÍ³´íÎó","Class: "+className+"<br><br>Error: "+unescape(message));
}
