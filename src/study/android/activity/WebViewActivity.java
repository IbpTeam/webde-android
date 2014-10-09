package study.android.activity;

import java.util.logging.Logger;


import android.app.Activity;
import android.os.Bundle;
import android.widget.Toast;

public class WebViewActivity extends Activity{

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // TODO Auto-generated method stub
        super.onCreate(savedInstanceState);
        activityStates("onCreate");
    }

    @Override
    protected void onStart() {
        // TODO Auto-generated method stub
        super.onStart();
        activityStates("onStart");
    }

    @Override
    protected void onRestart() {
        // TODO Auto-generated method stub
        super.onRestart();
        activityStates("onRestart");
    }

    @Override
    protected void onResume() {
        // TODO Auto-generated method stub
        super.onResume();
        activityStates("onResume");
    }

    @Override
    protected void onPause() {
        // TODO Auto-generated method stub
        super.onPause();
        activityStates("onPause");
    }

    @Override
    protected void onStop() {
        // TODO Auto-generated method stub
        super.onStop();
        activityStates("onStop");
    }

    @Override
    protected void onDestroy() {
        // TODO Auto-generated method stub
        super.onDestroy();
        activityStates("onDestroy");
    }

    private Logger logger = Logger.getLogger(WebViewActivity.class.getName());
    private void activityStates(String state){
        Toast.makeText(this, "WebViewActivity:" + state, Toast.LENGTH_LONG).show();
        logger.info(state);
    }
    
}
