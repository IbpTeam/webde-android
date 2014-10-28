package org.ibp.dnssd;

import java.util.logging.Logger;

import org.ibp.webde.R;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.wifi.WifiManager;
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
        nds = null;
        if(checkWifiState()){
            nds = new NetworkDiscovery(this);
            nds.findServers();
        }
        super.onResume();
    }
    @Override
    protected void onPause() {
        if(nds != null){
            nds.close();
        }
        super.onPause();
    }

    public void btn_listServiceInfo(View v){
        nds.btn_listServiceInfo();    
    }
    public void btn_registerService(View v){
        String[] props = new String[]{"Platform=HammerHead", "string"};
        nds.startServer("Android-hammerhead", 6666, props);
        logger.info("start server");
    }
    public void btn_unregisterService(View v){
        nds.stopServer();
        logger.info("stop server");
    }
    public void btn_showServiceCollector(View v){
        nds.showServiceCollector();       
    }

    public void mAlertDialog(String title, String message, DialogInterface.OnClickListener positiveListener, DialogInterface.OnClickListener negetiveListener){//退出确认
        AlertDialog.Builder ad = new AlertDialog.Builder(this);//context
        ad.setTitle(title);
        ad.setMessage(message);
        ad.setPositiveButton("是", positiveListener);
        ad.setNegativeButton("否",negetiveListener);
        ad.show();//显示对话框
    }
    
    private final int ACTION_WIFI_SETTINGS = 0;
    public boolean checkWifiState(){
        boolean isWifiEnabled = false;
        WifiManager wifi = (WifiManager) this.getSystemService(android.content.Context.WIFI_SERVICE);
        if((wifi == null) || (wifi.getWifiState() != WifiManager.WIFI_STATE_ENABLED)){
            logger.info("wifi is not ready");
            DialogInterface.OnClickListener yes = new DialogInterface.OnClickListener(){
                @Override
                public void onClick(DialogInterface arg0, int arg1) {
                    // TODO Auto-generated method stub
                    DnssdActivity.this.startActivityForResult(new Intent(android.provider.Settings.ACTION_WIFI_SETTINGS), ACTION_WIFI_SETTINGS);
                }                    
            };
            DialogInterface.OnClickListener no = new DialogInterface.OnClickListener(){
                @Override
                public void onClick(DialogInterface arg0, int arg1) {
                    // TODO Auto-generated method stub
                    DnssdActivity.this.onDestroy();
                    System.exit(0);                    
                }                    
            };
            mAlertDialog("需要打开Wifi，程序才能运行。", "是否打开Wifi ?", yes, no);
        }else{
            logger.info("wifi is ready");
            isWifiEnabled = true;
        }
        return isWifiEnabled;
    }
    
    
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        // TODO Auto-generated method stub
        switch(requestCode){
        case ACTION_WIFI_SETTINGS:
            logger.info("resultCode: " + resultCode);
            break;
        }
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

