package ibp.plugin.watch;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.util.Log;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.ResultCallback;
import com.google.android.gms.wearable.DataApi;
import com.google.android.gms.wearable.DataEvent;
import com.google.android.gms.wearable.DataEventBuffer;
import com.google.android.gms.wearable.DataMap;
import com.google.android.gms.wearable.DataMapItem;
import com.google.android.gms.wearable.MessageApi;
import com.google.android.gms.wearable.MessageEvent;
import com.google.android.gms.wearable.Node;
import com.google.android.gms.wearable.NodeApi;
import com.google.android.gms.wearable.PutDataMapRequest;
import com.google.android.gms.wearable.PutDataRequest;
import com.google.android.gms.wearable.Wearable;
import com.google.android.gms.wearable.WearableListenerService;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Date;

/**
 * Created by f on 2015/6/4.
 */
public class ListenerServiceForMobile extends WearableListenerService implements DataApi.DataListener,
        GoogleApiClient.ConnectionCallbacks, GoogleApiClient.OnConnectionFailedListener {

    // 发送数据path
    private static final String WEAR_OPEN_PPT = "/wear/open-ppt";
    private static final String WEAR_OPEN_LIST = "/wear/open-list";
    private static final String WEAR_PPT_CONTROL = "/wear/ppt-control";
    private static final String WEAR_DATA = "/wear/date-change";
    // 接收数据path
    private static final String PHONE_OPEN_PPT = "/phone/open-ppt";
    private static final String PHONE_OPEN_LIST = "/phone/open-list";
    private static final String PHONE_PPT_CONTROL = "/phone/ppt-control";
    private static final String PHONE_PATH = "/phone/date-change";
    private Intent intent = new Intent("io.cordova.hellocordova.PPTControl");

    protected Node mNode;
    protected String NodeID = null;
    private ServiceMsgReceiver msgReceiver;
    GoogleApiClient mGoogleApiClient;

    // -----------------------------------------------implement-------------------------------------------------------
    @Override
    public void onCreate() {
        super.onCreate();
        Log.v(WatchPlugin.TAG, "ListenerServiceForMobile");
        // 注册通信
        mGoogleApiClient = new GoogleApiClient.Builder(this).addConnectionCallbacks(this)
                .addOnConnectionFailedListener(this).addApi(Wearable.API).build();
        mGoogleApiClient.connect();

        // 注册broadcast监听
        msgReceiver = new ServiceMsgReceiver();
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction("io.cordova.hellocordova.ForPhoneServer");
        registerReceiver(msgReceiver, intentFilter);
    }

    @Override
    public void onMessageReceived(MessageEvent messageEvent) {
        String MessagePath = messageEvent.getPath();
        Log.v(WatchPlugin.TAG, "OnMessageR, received a message for wear");
        Log.v(WatchPlugin.TAG, "MessagePath, the Path is " + MessagePath);
        /*
         * Receive the message from wear
         */
        if (MessagePath.equals(PHONE_OPEN_PPT)) {
            String s = new String(messageEvent.getData());
            // Intent startIntent = new Intent(this, BackActivities.class);
            // startIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            // startActivity(startIntent);
            // Lyn : js openPPT
            // comment later
            // WebViewActivity.openPPT();
            WatchPlugin.messageFromWear(3);
        } else if (MessagePath.equals(PHONE_PPT_CONTROL)) {
            String s = new String(messageEvent.getData());
            Log.d(WatchPlugin.TAG, "the message is " + s);
            // Bundle bundle = new Bundle();
            // bundle.putString("message", s);
            // intent.putExtras(bundle);
            // sendBroadcast(intent);
            switch (s) {
            case "0":// prev
                WatchPlugin.messageFromWear(0);
                break;
            case "1":// next
                WatchPlugin.messageFromWear(1);
                break;
            case "2":// stop
                WatchPlugin.messageFromWear(2);
                break;
            }
            // Lyn : js playPPT
            // WebViewActivity.openPPT();
            super.onMessageReceived(messageEvent);
        }

    }

    @Override
    public void onDataChanged(DataEventBuffer dataEvents) {
        Log.d("Function", "This is function onDataChanged");
        for (DataEvent event : dataEvents) {
            if (event.getType() == DataEvent.TYPE_DELETED) {

            } else if (event.getType() == DataEvent.TYPE_CHANGED) {
                DataMap dataMap = DataMapItem.fromDataItem(event.getDataItem()).getDataMap();
                if (event.getDataItem().getUri().getPath().equals("only-wear")) {
                    String content = dataMap.get("content");
                    if (content == "left") {

                    } else if (content == "right") {

                    }

                }

            }
        }
        super.onDataChanged(dataEvents);
    }

    @Override
    public void onConnected(Bundle bundle) {
        Wearable.DataApi.addListener(mGoogleApiClient, this);
        Wearable.NodeApi.getConnectedNodes(mGoogleApiClient).setResultCallback(
                new ResultCallback<NodeApi.GetConnectedNodesResult>() {
                    @Override
                    public void onResult(NodeApi.GetConnectedNodesResult nodes) {
                        for (Node node : nodes.getNodes()) {
                            mNode = node;
                            NodeID = mNode.getId();
                            Log.d(WatchPlugin.TAG, "The node id is " + NodeID);
                            // 获得node ID后发送消息启动activity

                        }
                    }
                });
    }

    @Override
    public void onConnectionSuspended(int i) {

    }

    @Override
    public void onConnectionFailed(ConnectionResult connectionResult) {

    }

    @Override
    public void onDestroy() {
        unregisterReceiver(msgReceiver);
        super.onDestroy();
    }

    // -----------------------------------------------implement-------------------------------------------------------

    // -----------------------------------------------custom-------------------------------------------------------
    public void SendMessageToWear(String content, String path) {
        Log.e(WatchPlugin.TAG, "You're sending a message at service: " + content);
        byte[] abc = new byte[0];
        try {
            abc = content.getBytes("UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }

        if (NodeID != null) {
            Wearable.MessageApi.sendMessage(mGoogleApiClient, mNode.getId(), path, abc).setResultCallback(
                    new ResultCallback<MessageApi.SendMessageResult>() {
                        @Override
                        public void onResult(MessageApi.SendMessageResult sendMessageResult) {

                            if (!sendMessageResult.getStatus().isSuccess()) {
                                Log.e(WatchPlugin.TAG, "Failed to send message with status code: "
                                        + sendMessageResult.getStatus().getStatusCode());
                            } else {
                                Log.e(WatchPlugin.TAG, "Success on send ");
                            }
                        }
                    });
        }
    }

    public void SendDataToWear(Bundle bundle, String path, String key, int type) {// type:
                                                                                  // 0
                                                                                  // for
                                                                                  // StringArrayList;
                                                                                  // 1
                                                                                  // for
                                                                                  // IntegerArrayList
        Log.d(WatchPlugin.TAG, "path is " + path + "key is " + key);
        PutDataMapRequest dataMap = PutDataMapRequest.create(path);

        switch (type) {
        case 0:
            ArrayList<String> ValueString = bundle.getStringArrayList(key);
            dataMap.getDataMap().putStringArrayList(key, ValueString);
            Log.d(WatchPlugin.TAG, "case 0");
        case 1:
            ArrayList<Integer> ValueInt = bundle.getIntegerArrayList(key);
            dataMap.getDataMap().putIntegerArrayList(key, ValueInt);
            Log.d(WatchPlugin.TAG, "case 1");
        }
        // 加入时间，确保数据变化
        dataMap.getDataMap().putLong("TimeKey", new Date().getTime());

        PutDataRequest request = dataMap.asPutDataRequest();
        Wearable.DataApi.putDataItem(mGoogleApiClient, request).setResultCallback(
                new ResultCallback<DataApi.DataItemResult>() {
                    @Override
                    public void onResult(DataApi.DataItemResult dataItemResult) {
                        if (dataItemResult.getStatus().isSuccess()) {
                            Log.d(WatchPlugin.TAG, "DataSend, Data sending success");
                        } else {
                            Log.d(WatchPlugin.TAG, "DataSend, Data sending Failed");
                        }
                    }
                });

    }

    // -----------------------------------------------custom-------------------------------------------------------

    public class ServiceMsgReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            Log.e(WatchPlugin.TAG, "Broadcast get a message");
            Bundle bundle = intent.getExtras();
            if (bundle.containsKey("PPT")) {
                String message = bundle.getString("PPT");
                Log.e(WatchPlugin.TAG, "BroadCastMessage, Service received message: " + message);
                // send message to wear
                SendMessageToWear(message, WEAR_PPT_CONTROL);

            } else if (bundle.containsKey("PPTList")) {
                // ArrayList<String> FileList =
                // bundle.getStringArrayList("PPTList");
                SendDataToWear(bundle, WEAR_DATA, "PPTPages", 1);
                SendDataToWear(bundle, WEAR_OPEN_LIST, "PPTList", 0);
            } else if (bundle.containsKey("OpenPPT")) {
                int aaa = bundle.getInt("OpenPPT");
                Log.e(WatchPlugin.TAG, "BroadCastMessage, Service received message: " + aaa);
                SendMessageToWear("0", WEAR_OPEN_PPT);
            }

        }
    }
}
