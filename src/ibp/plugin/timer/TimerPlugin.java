package ibp.plugin.timer;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.widget.Toast;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * This class shows current time to javascript.
 * author: xifeiwu
 */
@SuppressLint({ "SimpleDateFormat", "HandlerLeak" }) 
public class TimerPlugin extends CordovaPlugin {

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        switch(action){
        case "start":
            this.start(callbackContext);
            return true;
        case "stop":
            this.stop(callbackContext);
            return true;
        }
        return false;
    }

    private Handler mHandler;
    private void initHandler(CallbackContext callbackContext){
        final CallbackContext cbc = callbackContext;
        try {
            if(null == mHandler){
                mHandler = new Handler() {
                    @Override
                    public void handleMessage(Message msg) {
                        sendJSONObjectByHandler(cbc, "time", msg.getData().getString("time"));
                    }
                };
            }
        } catch(Exception e) {
        }        
    }
    private void sendJSONObjectByHandler(CallbackContext callbackContext, String type, String data){
        JSONObject obj = new JSONObject();
        try {
            obj.put("type", new String(type));
            obj.put("data", new String(data));
        } catch(JSONException e1) {
        }
        PluginResult result;
        if("error" == type){
            result = new PluginResult(PluginResult.Status.ERROR, obj);
        }else{
            result = new PluginResult(PluginResult.Status.OK, obj);            
        }
        result.setKeepCallback(true);
        callbackContext.sendPluginResult(result);        
    }
    private Thread th;
    private boolean flag = false;
    private SimpleDateFormat formatter; 
    private void start(CallbackContext callbackContext){
        if(!flag){
            initHandler(callbackContext);
            formatter = new SimpleDateFormat("yyyy年MM月dd日HH时mm分ss秒");
            th = new Thread(timecnt);
            flag = true;
            th.start();
            sendJSONObjectByHandler(callbackContext, "success", "OK, Timer started.");
        }else{
            sendJSONObjectByHandler(callbackContext, "error", "Error, Timer has started.");
        }
    }
    private void stop(CallbackContext callbackContext){
        if(flag){
            flag = false;
            callbackContext.success("OK, Timer stoped.");
        }else{
            callbackContext.error("Error, Timer has stoped.");            
        }
    }
    
    Runnable timecnt = new Runnable(){
        @Override
        public void run() {
            // TODO Auto-generated method stub
            while(flag){
                Bundle messageBundle = new Bundle();
                messageBundle.putString("time", formatter.format(new Date(System.currentTimeMillis())));
                Message message = new Message();
                message.setData(messageBundle);
                mHandler.sendMessage(message);
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
            }
        }   
    };

    public void onPause(boolean multitasking) {
        flag = false;
        activityStates("onPause");
    }
    public void onResume(boolean multitasking) {
        th = new Thread(timecnt);
        flag = true;
        th.start();
        activityStates("onResume");
    }
    public void onDestroy() {
        flag = false;
        activityStates("onDestroy");        
    }
    private void activityStates(String state){
        Log.d("TimerPlugin", state);
        Toast.makeText(cordova.getActivity(), state, Toast.LENGTH_SHORT).show();
    }
}
