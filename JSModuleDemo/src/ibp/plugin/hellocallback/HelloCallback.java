package ibp.plugin.hellocallback;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * This class echoes a string called from JavaScript.
 */
public class HelloCallback extends CordovaPlugin {
    private CallbackContext startCallbackContext;
    private CallbackContext stopCallbackContext;
    private String prefix;

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        switch(action){
        case "start":
            prefix = args.getString(0);
            this.start(callbackContext);
            return true;
//            break;
        case "stop":
            this.stop(callbackContext);
            return true;
//            break;
        case "getTime":
//            PluginResult.Status status = PluginResult.Status.NO_RESULT;
//            PluginResult pluginResult = new PluginResult(status);
//            pluginResult.setKeepCallback(true);
//            callbackContext.sendPluginResult(pluginResult);
            return true;
        }
        return false;
    }

    private Thread th;
    private boolean flag = false;
    private SimpleDateFormat formatter; 
    //private Date curDate = new Date(System.currentTimeMillis());//获取当前时间       
    //private String curTime = formatter.format(curDate); 
    private void start(CallbackContext callbackContext){
        startCallbackContext = callbackContext;
        formatter = new SimpleDateFormat("yyyy年MM月dd日HH时mm分ss秒");
        th = new Thread(timecnt);
        flag = true;
        th.start();

        PluginResult result = new PluginResult(PluginResult.Status.OK,
                "Timer has started.");
        result.setKeepCallback(true);
        startCallbackContext.sendPluginResult(result);
//        startCallbackContext.success("Timer has started.");
    }
    private void stop(CallbackContext callbackContext){
        stopCallbackContext = callbackContext;
        flag = false;
        stopCallbackContext.success("Timer has stoped.");
    }
    private void getTime(){
//        JSONObject data = new JSONObject();
//        try {
//            data.put("time", formatter.format(new Date(System.currentTimeMillis())));
//        } catch(JSONException e) {
//        }
        PluginResult result = new PluginResult(PluginResult.Status.OK,
                formatter.format(new Date(System.currentTimeMillis())));
        result.setKeepCallback(true);
        startCallbackContext.sendPluginResult(result);
    }
    
    Runnable timecnt = new Runnable(){
        @Override
        public void run() {
            // TODO Auto-generated method stub
            while(flag){
                getTime();
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
            }
        }   
    };
}

