package ibp.plugin.watch;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

public class WatchPlugin extends CordovaPlugin {    
    private Intent intent;
    private static WatchPlugin instance;
    public WatchPlugin(){
        instance = this;
    }
    
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        switch (action) {
        case "messageToWear":
            messageToWear(args);
            break;
        }
        return true;
    }
    public void messageToWear(JSONArray msg) throws JSONException{
        int type = msg.getInt(0);
        sendMsgToServer(type);
        //messageFromWear(type);
    }
    public void sendMsgToServer(int type){
        Log.v("sendMsgToServer", ""+type);
        intent = new Intent("io.cordova.hellocordova.ForPhoneServer");
        Bundle bundle = new Bundle();
        switch(type){
        case 0://start
            bundle.putInt("OpenPPT", 0);
            break;
        case 1://next
            bundle.putString("PPT", "1");
            break;
        case 2://stop
            bundle.putString("PPT", "2");
            break;
        case 3://prev
            bundle.putString("PPT", "0");
            break;
        }
        intent.putExtras(bundle);
        cordova.getActivity().sendBroadcast(intent);
    }
//    public void openPPT() {
//        // get json JSONArray jsonArray
//        Bundle bundle = new Bundle();
//        bundle.putInt("OpenPPT", 0);
//        intent.putExtras(bundle);
//        cordova.getActivity().sendBroadcast(intent);
//    }
//    public void sendMessageToWear(String content) {
//        Log.e("message", "You're sending a message: "+ content);
//        Bundle bundle = new Bundle();
//        bundle.putString("PPT", content);
//        intent.putExtras(bundle);
//        cordova.getActivity().sendBroadcast(intent);
//    }
    
    public static void messageFromWear(int type){
        switch(type){
        case 0://prev
            break;
        case 1://next
            break;
        case 2://stop
            break;
        case 3://start
            break;
        }
        instance.webView.post(new sendMsgToJS(type));
    }

    static class sendMsgToJS implements Runnable{
        private int type;
        public sendMsgToJS(int type){
            this.type = type;
        }
        @Override
        public void run() {
            // TODO Auto-generated method stub
            instance.webView.loadUrl("javascript:" + "window.WatchNative.messageFromWear(" + this.type + ");");
        }        
    }



//case "start":
//    this.start(callbackContext);
//    intent = new Intent("io.cordova.hellocordova.ForPhoneServer");
//    openPPT();
//    break;
//case "stop":
//    stop(callbackContext);
//    intent = new Intent("io.cordova.hellocordova.ForPhoneServer");
//    sendMessageToWear("2");
//    break;
//case "nextPage":
//    this.nextPage(callbackContext);
//    intent = new Intent("io.cordova.hellocordova.ForPhoneServer");
//    sendMessageToWear("1");
//    break;
//case "prevPage":
//    this.prevPage(callbackContext);
//    intent = new Intent("io.cordova.hellocordova.ForPhoneServer");
//    sendMessageToWear("0");
//    break;
    
    
//    class MsgReceiver extends BroadcastReceiver {
//        @Override
//        public void onReceive(Context context, Intent intent) {
//            // String message = intent.getStringExtra("message");
//            Bundle bundle = intent.getExtras();
//            Log.v("myTag", "Main activity received message");
//            // Display message in UI
//            if (bundle.containsKey("message")) {
//                String s = bundle.getString("message");
//                if (s.equals("0")) {
//                    Log.e("Tag", "The message is " + s);
//                    // WebViewActivity.backPPT();
//                } else if (s.equals("1")) {
//                    // WebViewActivity.nextPPT();
//                } else if (s.equals("2")) {
//                    // WebViewActivity.stopPPT();
//                }
//            }
//        }
//    }
}
