package ibp.plugin.test;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.json.JSONArray;
import org.json.JSONException;

import android.util.Log;

/**
 * This class echoes a string called from JavaScript.
 */
public class TestCordovaPlugin extends CordovaPlugin {
    public static String TAG = "TestCordovaPlugin";

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        switch (action) {
        case "init":
            break;
        }
        return true;
    }

    @Override
    public Object onMessage(String id, Object data) {
        // TODO Auto-generated method stub
        Log.v(TAG, "onMessage:" + id);
        this.webView.loadUrl("javascript:" + "window.TestCordovaNative.onMessages(" + id + ");");
        return true;//super.onMessage(id, data);
    }
    
}
