package ibp.plugin.watch;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

public class WatchPlugin extends CordovaPlugin {
    public static String TAG = "WatchPlugin";
    private Intent intent;
    private static WatchPlugin instance;
    
    private Intent serviceIntent;
    private final int STARTSERVICE = -1;
    private final int STOPSERVICE = -2;
    public WatchPlugin(){
        instance = this;
        //Log.v(TAG, cordova.getActivity());
        //Log.v(TAG, Service4Watch.class.getName());
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
        Log.v(TAG, "sendMsgToServer: "+type);
        intent = new Intent("io.cordova.hellocordova.ForPhoneServer");
        Bundle bundle = new Bundle();
        switch(type){
        case STARTSERVICE:
            serviceIntent = new Intent(cordova.getActivity(), Service4Watch.class);
            cordova.getActivity().startService(serviceIntent);
            break;
        case STOPSERVICE:
            if(null != serviceIntent){
                cordova.getActivity().stopService(serviceIntent);
            }
            break;
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
}
