/*
 * Copyright (C) 2012 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package ibp.plugin.socket;

import ibp.plugin.nsd.NSDHelper;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;

@SuppressLint({ "HandlerLeak", "SimpleDateFormat" })
public class SocketPlugin extends CordovaPlugin {
//
//    public static final String TAG = "NsdChat";
//    private String serverName;
//    private int serverPort;
    private SocketConnection socketConn;
    public SocketPlugin(){
        socketConn = new SocketConnection(this);
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        switch (action) {
        case "startServerSocket":
            this.startServerSocket(callbackContext);
            break;
        case "stopServerSocket":
            this.stopServerSocket(callbackContext);
            break;
        case "initHandler":
            this.initHandler(callbackContext);
            break;
        case "sendMessage":
            this.sendMessage(callbackContext);
            break;
        }
        return true;
    }
    private void sendMessage(CallbackContext callbackContext){
        
    }
    private void startServerSocket(CallbackContext callbackContext){
//        initHandler(callbackContext);
        socketConn.startServerSocket(callbackContext, 7777);
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
//                        String type = msg.getData().getString("type");
//                        String content  = msg.getData().getString("content");
//                        JSONObject data = new JSONObject();
//                        try {
//                            data.put("type", new String(type));
//                            data.put("content", new String(content));
//                        } catch (JSONException e) {
//                        }
                        PluginResult result = new PluginResult(PluginResult.Status.OK, (JSONObject)msg.obj);
                        result.setKeepCallback(true);
                        cbc.sendPluginResult(result);
                    }
                };
            } 
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
    public void processMsgObj(JSONObject mMsgObj){
        try {
            if(mMsgObj.has("content")){
                sendByHandler(new JSONObject(mMsgObj.getString("content")));
            }      
        } catch (JSONException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }  
    }
//    private void sendByHandler(String type, String data) {
//        if(null != mHandler){
//            Bundle messageBundle = new Bundle();
//            messageBundle.putString("type", type);
//            messageBundle.putString("msg", data);
//            Message message = new Message();
//            message.setData(messageBundle);
//            mHandler.sendMessage(message);
//        }
//    }
//
//    private Handler mHandler;
//
//    private void initNsd(CallbackContext callbackContext) {
//        final CallbackContext cbc = callbackContext;
//        try {
//            if (null == mHandler) {
//                mHandler = new Handler() {
//                    @Override
//                    public void handleMessage(Message msg) {
//                        String type = msg.getData().getString("type");
//                        String message = msg.getData().getString("msg");
//
//                        JSONObject data = new JSONObject();
//                        try {
//                            data.put("type", new String(type));
//                            data.put("data", new String(message));
//                        } catch (JSONException e) {
//                        }
//                        PluginResult result = new PluginResult(PluginResult.Status.OK, data);
//                        result.setKeepCallback(true);
//                        cbc.sendPluginResult(result);
//                    }
//                };
//                if (null == mNsdHelper) {
//                    mNsdHelper = new NsdHelper(cordova.getActivity(), mHandler);
//                    mNsdHelper.initializeNsd();
//                }
//                sendByHandler(cbc, "success", "Initialize NSD successful.");
//            } else {
//                sendByHandler(cbc, "error", "Nsd Has been Initialized.");
//            }
//        } catch (Exception e) {
//            sendByHandler(cbc, "error", "Exception: " + e);
//        }
//    }
//
//    private void sendByHandler(CallbackContext callbackContext, String type, String data) {
//        JSONObject obj = new JSONObject();
//        try {
//            obj.put("type", new String(type));
//            obj.put("data", new String(data));
//        } catch (JSONException e1) {
//        }
//        PluginResult result;
//        if ("error" == type) {
//            result = new PluginResult(PluginResult.Status.ERROR, obj);
//        } else {
//            result = new PluginResult(PluginResult.Status.OK, obj);
//        }
//        result.setKeepCallback(true);
//        callbackContext.sendPluginResult(result);
//    }
//
//    private void sendByHandler(String type, String data) {
//        Bundle messageBundle = new Bundle();
//        messageBundle.putString("type", type);
//        messageBundle.putString("msg", data);
//        Message message = new Message();
//        message.setData(messageBundle);
//        mHandler.sendMessage(message);
//    }
//
//    private void startDiscovery(CallbackContext callbackContext) {
//        if ((null != mNsdHelper) && (null != mHandler)) {
//            mNsdHelper.startDiscovery();
//            callbackContext.success("In startDiscovery");
//        } else {
//            callbackContext.error("Please init NSD first.");
//        }
//    }
//
//    private void stopDiscovery(CallbackContext callbackContext) {
//        if ((null != mNsdHelper) && (null != mHandler)) {
//            mNsdHelper.stopDiscovery();
//            callbackContext.success("In stopDiscovery");
//        } else {
//            callbackContext.error("Please init NSD first.");
//        }
//    }
//
//    private void registerService(CallbackContext callbackContext, String name, int port) {
//        if ((null != mNsdHelper) && (null != mHandler)) {
//            mNsdHelper.registerService(name, port);
//            callbackContext.success("In registerService: " + name + ":" + port);
//        } else {
//            callbackContext.error("Please init NSD first.");
//        }
//    }
//
//    private void unRegisterService(CallbackContext callbackContext) {
//        if ((null != mNsdHelper) && (null != mHandler)) {
//            mNsdHelper.unRegisterService();
//            callbackContext.success("In unRegisterService: " + serverName + ":" + serverPort);
//        } else {
//            callbackContext.error("Please init NSD first.");
//        }
//    }
//
//    private void stopNsd(CallbackContext callbackContext) {
//        if ((null != mNsdHelper) && (null != mHandler)) {
//            mNsdHelper.unRegisterService();
//            mNsdHelper.stopDiscovery();
//            mNsdHelper = null;
//            mHandler = null;
//            callbackContext.success("In stopNsd.");
//        } else {
//            callbackContext.error("Nsd has stopped.");
//        }
//    }
//
//    public void resolveService(CallbackContext callbackContext, String name) {
//        Log.d("device name: ", name);
//        mNsdHelper.resolveInfoByName(name);
//        callbackContext.success("In resolveService. device name: " + name);
//    }
//
//    public void onPause(boolean multitasking) {
//        activityStates("onPause");
//        if ((null != mNsdHelper) && (null != mHandler)) {
//            this.sendByHandler("Notice", "stopNsd in onPause, Please initNsd first.");
//            mNsdHelper.unRegisterService();
//            mNsdHelper.stopDiscovery();
//            mNsdHelper = null;
//            mHandler = null;
//        }
//    }
//
//    public void onResume(boolean multitasking) {
//        activityStates("onResume");
//    }
//
//    public void onDestroy() {
//        activityStates("onDestroy");
//        if ((null != mNsdHelper) && (null != mHandler)) {
//            this.sendByHandler("Notice", "stopNsd in onDestroy, Please initNsd first.");
//            mNsdHelper.unRegisterService();
//            mNsdHelper.stopDiscovery();
//            mNsdHelper = null;
//            mHandler = null;
//        }
//    }
//
//    private void activityStates(String state) {
//        Log.d("TimerPlugin", state);
//        // Toast.makeText(cordova.getActivity(), state,
//        // Toast.LENGTH_SHORT).show();
//    }
}
