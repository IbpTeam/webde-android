package dev.android.dnssd;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Logger;

import javax.jmdns.JmDNS;
import javax.jmdns.ServiceEvent;
import javax.jmdns.ServiceInfo;
import javax.jmdns.ServiceListener;
import javax.jmdns.impl.constants.DNSConstants;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.net.nsd.NsdServiceInfo;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

@SuppressLint("NewApi")
public class DnssdActivity extends Activity {
    public static final String TAG = "DnssdDiscovery";
    private Logger logger = Logger.getLogger(DnssdActivity.class.getName());
    android.os.Handler handler = new android.os.Handler();

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
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

