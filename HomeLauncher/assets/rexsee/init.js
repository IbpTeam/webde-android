function sizeFireFox(id,minusHeight){
	if  ( window.navigator.userAgent.indexOf("Firefox") != -1 || window.navigator.userAgent.indexOf("MSIE 10.0") != -1 ) {
		document.getElementById(id).style.height=document.body.clientHeight-minusHeight;
	}
	window.onresize = function() {
		sizeFireFox(id,minusHeight);
	}
}
function toggle(id){
	var obj = document.getElementById(id);
	obj.style.display=(obj.style.display=='none')?'':'none';	
	try {
		var logo = document.getElementById(id+'_logo');
		var src = logo.src.split("/");
		src = src[src.length-1].split(".")[0];
		if ( src=="expand" ) logo.src = "images/collapse.gif";
		else if ( src=="collapse" ) logo.src = "images/expand.gif";
	} catch(e) {
	}
}
function mover(obj){
	if ( obj.style.backgroundColor.toUpperCase()!="#A2BF4E" && obj.style.backgroundColor.toUpperCase()!="RGB(162, 191, 78)"){
		obj.style.backgroundColor="#D5E1F4";
	}
}
function mout(obj){
	if ( obj.style.backgroundColor.toUpperCase()!="#A2BF4E" && obj.style.backgroundColor.toUpperCase()!="RGB(162, 191, 78)"){
		obj.style.backgroundColor="#E7EEF8";
	}
}
function getParameter(name){
 	var paramStr=location.search;
	if(paramStr.length==0) return null;
	if(paramStr.charAt(0)!='?') return null;
 	//paramStr=unescape(paramStr);
 	paramStr=paramStr.substring(1);
 	if(paramStr.length==0) return null;
	var params=paramStr.split('&');
 	for(var i=0;i<params.length;i++){
 		var parts=params[i].split('=',2);
 		if(parts[0]==name){
 			if(parts.length<2||typeof(parts[1])=="undefined"||parts[1]=="undefined"||parts[1]=="null") return "";
 			return parts[1];
 		}
 	}
 	return null;
}
function ajaxSubmit(url,postStr,action) {
	var ajax=false; 
	try { ajax = new ActiveXObject("Msxml2.XMLHTTP"); }
	catch (e) { try { ajax = new ActiveXObject("Microsoft.XMLHTTP"); } catch (E) { ajax = false; } }
	if (!ajax && typeof XMLHttpRequest!='undefined') ajax = new XMLHttpRequest(); 
	ajax.open("POST", url, true); 
	ajax.setRequestHeader("Content-Type","application/x-www-form-urlencoded"); 
	ajax.send(postStr);
	ajax.onreadystatechange = function() { 
		if (ajax.readyState == 4 && ajax.status == 200) { 
			if ( !action || action == "" ) alert(ajax.responseText);
			else eval(action+"('"+escape(ajax.responseText)+"')");
		} 
	} 
}
