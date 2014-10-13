package dev.android.activity;

import java.util.logging.Logger;

import dev.android.dnssd.DnssdDiscovery;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

public class MainActivity extends Activity{

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // TODO Auto-generated method stub
        super.onCreate(savedInstanceState);
        this.setContentView(R.layout.main);
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

    private Logger logger = Logger.getLogger(MainActivity.class.getName());
    private void activityStates(String state){
        Toast.makeText(this, MainActivity.class.getName() + " - " + state, Toast.LENGTH_SHORT).show();
        logger.info(state);
    }
    
    public void startWebviewActivity(View view){
        Intent intent = new Intent(this, WebViewActivity.class);
        startActivity(intent);
    }
    
    public void startDesktopActivity(View view){
        Intent intent = new Intent(this, DesktopActivity.class);
        startActivity(intent);
    }
    
    public void startDnsSDActivity(View view){
        Intent intent = new Intent(this, DnssdDiscovery.class);
        startActivity(intent);
    }
}
