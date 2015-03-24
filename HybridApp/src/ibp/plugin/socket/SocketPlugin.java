/**
 * author: xifeiwu
 */

package ibp.plugin.socket;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.annotation.SuppressLint;
import android.os.Handler;
import android.os.Message;

@SuppressLint({ "HandlerLeak", "SimpleDateFormat" })
public class SocketPlugin extends CordovaPlugin {
    private SocketConnection socketConn;
    private String mName;
    private int mPort = 0;
    public SocketPlugin(){
        socketConn = new SocketConnection(this);
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        switch (action) {
        case "startServerSocket":
            mName = args.getString(0);
            mPort = args.getInt(1);
            this.startServerSocket(callbackContext, mPort);
            break;
        case "stopServerSocket":
            this.stopServerSocket(callbackContext);
            break;
        case "initHandler":
            this.initHandler(callbackContext);
            break;
        case "sendMessage":
            this.sendMessage(callbackContext, args);
            break;
        }
        return true;
    }

    public void onPause(boolean multitasking) {
        if ((socketConn.getServerSocketState()) && (null != mHandler)) {
            new Thread(new Runnable(){
                @Override
                public void run() {
                    // TODO Auto-generated method stub
                    socketConn.stopServerSocket(null);
                    closeHandler();                    
                }                
            }).start();
        }
    }

    public void onResume(boolean multitasking) {
    }
    /**
     * @param callbackContext
     * @param origMsg: [name, address, port, message]
     */
    private void sendMessage(CallbackContext callbackContext, JSONArray origMsg){
        try {
            JSONObject msgObj = new JSONObject();
            String dstName = origMsg.getString(0);
            String dstAddress = origMsg.getString(1);
            int dstPort = origMsg.getInt(2);
            String message = origMsg.getString(3);
            if(null != mName){
                msgObj.put("from", mName);
            }
            msgObj.put("to", dstName);
            msgObj.put("message", message);
            msgObj.put("type", "app1");
            if(socketConn.sendMessage(dstAddress, dstPort, msgObj)){
                callbackContext.success("Plugin.sendMessage success");
            }else{
                callbackContext.error("Plugin.sendMessage error");
            }
        } catch (JSONException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }
    private void startServerSocket(CallbackContext callbackContext, int port){
//        initHandler(callbackContext);
        socketConn.startServerSocket(callbackContext, port);
    }
    private void stopServerSocket(CallbackContext callbackContext){
        socketConn.stopServerSocket(callbackContext);
    }
    private Handler mHandler;
    private void initHandler(CallbackContext callbackContext){
        final CallbackContext cbc = callbackContext;
        try {
            if (null == mHandler) {
                mHandler = new Handler() {
                    @Override
                    public void handleMessage(Message msg) {
                        PluginResult result = null;
                        switch(msg.what){
                        case 0:
                            result = new PluginResult(PluginResult.Status.OK, (JSONObject)msg.obj);
                            result.setKeepCallback(true);
                            break;
                        case -1:
                            result = new PluginResult(PluginResult.Status.NO_RESULT);
                            mHandler = null;
                            break;
                        }
                        cbc.sendPluginResult(result);
                    }
                };
            }
            PluginResult result = new PluginResult(PluginResult.Status.OK, "initHandler: success.");
            result.setKeepCallback(true);
            callbackContext.sendPluginResult(result);
        } catch (Exception e) {
            PluginResult result = new PluginResult(PluginResult.Status.ERROR, "initHandler Exception: " + e);
            callbackContext.sendPluginResult(result);
        }        
    } 
    public void sendByHandler(JSONObject contentObj) {
        if(null != mHandler){
            Message message = new Message();
            message.obj = contentObj;
            mHandler.sendMessage(message);
        }
    }    
    public void closeHandler() {
        if(null != mHandler){
            Message message = new Message();
            message.what = -1;
            mHandler.sendMessage(message);
        }
    }
    public void processMsgObj(JSONObject mMsgObj){
        try {
            if(mMsgObj.has("content")){
                JSONObject objToJS = new JSONObject(mMsgObj.getString("content"));
                objToJS.put("address", mMsgObj.getString("address"));
                objToJS.put("port", mPort);
                sendByHandler(objToJS);
            }      
        } catch (JSONException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }  
    }
}