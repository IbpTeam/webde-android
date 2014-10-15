package dev.android.dnssd;

import java.util.logging.Logger;

import dev.android.activity.R;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Bundle;
import android.view.View;

@SuppressLint("NewApi")
public class DnssdActivity extends Activity {
    public static final String TAG = "DnssdDiscovery";
    private Logger logger = Logger.getLogger(DnssdActivity.class.getName());
    android.os.Handler handler = new android.os.Handler();

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.dnssd);
    }

    @Override
    protected void onStart() {
        super.onStart();
    }

    @Override
    protected void onStop() {
        super.onStop();
    }

    private NetworkDiscovery nds;
    @Override
    protected void onResume() {
//        handler.postDelayed(new Runnable() {
//            public void run() {
//                activeServiceListener();
//            }
//        }, 500);
        String[] props = new String[]{"Platform=HammerHead", "string"};
        nds = new NetworkDiscovery(this);
        nds.startServer("Android-hammerhead", 6666, props);
        nds.findServers();
        super.onResume();
    }
    @Override
    protected void onPause() {
        nds.close();
        super.onPause();
    }

    public void btn_listServiceInfo(View v){
        nds.btn_listServiceInfo();    
    }
    public void btn_unregisterService(View v){
        nds.stopServer();
        logger.info("stop server");
    }
    public void btn_showServiceInfo(View v){
        nds.showServiceCollector();       
    }
    
    private Thread th;
    private boolean flag = true;
    private void startServiceListener(){
        th = new Thread(new Runnable(){
            @Override
            public void run() {
                // TODO Auto-generated method stub
            }
            
        });
        flag = true;
        th.start();
    }

}

