package org.ibp.dnssd;

import java.util.logging.Logger;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo.State;
import android.net.wifi.WifiManager;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Toast;

@SuppressLint("NewApi")
public class DnssdActivity extends Activity {
    public static final String TAG = "DnssdDiscovery";
    public Logger logger = Logger.getLogger(DnssdActivity.class.getName());
    android.os.Handler handler = new android.os.Handler();

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
    }

    @Override
    protected void onStart() {
        super.onStart();
    }

    @Override
    protected void onStop() {
        super.onStop();
    }

    private String value = "范德萨分的萨福打算；分的萨罗分挨饿哦萨福家的萨罗；分诶萨阿凡达类似fices阿凡达" +
    		"类似adieus否定了萨福诶萨弗兰克的萨abies份额了萨福诶哦无分发了房间哦i诶萨\n解放奥i哦非萨德佛诶萨佛饿死啊发送的f\n";
    public LoggerView loggerView;
    private NetworkDiscovery nds;
    @Override
    protected void onResume() {
        if (loggerView == null) {
            loggerView = new LoggerView(this);
        }
        setContentView(loggerView);
        handler.postDelayed(new Runnable(){
            @Override
            public void run() {
                // TODO Auto-generated method stub
                nds = null;
                if(checkWifiState()){
                    nds = new NetworkDiscovery(DnssdActivity.this);
                    nds.findServers();
                }                
            }
            
        }, 200);
        super.onResume();
    }
    @Override
    protected void onPause() {
        if(nds != null){
            nds.close();
        }
        if (loggerView != null) {
            loggerView.surfaceDestroyed(null);            
        }
        super.onPause();
    }


    public void mAlertDialog(String title, String message, DialogInterface.OnClickListener positiveListener, DialogInterface.OnClickListener negetiveListener){//退出确认
        AlertDialog.Builder ad = new AlertDialog.Builder(this);//context
        ad.setTitle(title);
        ad.setMessage(message);
        ad.setPositiveButton("是", positiveListener);
        ad.setNegativeButton("否",negetiveListener);
        ad.show();
    }
    
    private final int ACTION_WIFI_SETTINGS = 0;
    public boolean checkWifiState(){
        boolean isWifiEnabled = false;
        WifiManager wifi = (WifiManager) this.getSystemService(android.content.Context.WIFI_SERVICE);
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
        if((wifi == null) || (wifi.getWifiState() != WifiManager.WIFI_STATE_ENABLED)){
            mAlertDialog("需要打开Wifi，程序才能运行。", "是否打开Wifi ?", yes, no);
        }else{
            if(checkConnectionState()){
                isWifiEnabled = true;
                logger.info("wifi is ready");
            }else{
                mAlertDialog("请连接一个可用Wifi", "是否重设Wifi参数 ?", yes, no);
            }
        }
        return isWifiEnabled;
    }

    private boolean checkConnectionState() {
        boolean isConnectionEnable = false;
        ConnectivityManager connManager = (ConnectivityManager) this.getSystemService(CONNECTIVITY_SERVICE);
        State state = connManager.getNetworkInfo(ConnectivityManager.TYPE_WIFI).getState();
        if (State.CONNECTED == state) {
            isConnectionEnable = true;
        }
        return isConnectionEnable;
    }
    
    private final int LIST_SERVICE_INFO = 0, REGISTER_SERVICE = 1, UNREGISTER_SERVICE = 2, OTHER_OPERATION = 3;
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // TODO Auto-generated method stub
        super.onCreateOptionsMenu(menu);
        menu.add(0, LIST_SERVICE_INFO, 0, "服务列表");
        menu.add(0, REGISTER_SERVICE, 0, "发布服务");
        menu.add(0, UNREGISTER_SERVICE, 0, "注销服务");
        menu.add(0, OTHER_OPERATION, 0, "其它操作");
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // TODO Auto-generated method stub
        switch (item.getItemId()) {
        case LIST_SERVICE_INFO:
            Toast.makeText(this, "服务列表", Toast.LENGTH_SHORT).show();
            nds.btn_listServiceInfo();    
            break;
        case REGISTER_SERVICE:
            Toast.makeText(this, "发布服务", Toast.LENGTH_SHORT).show();
            String[] props = new String[]{"Platform=HammerHead", "string"};
            nds.startServer("Android-hammerhead", 6666, props);
            break;
        case UNREGISTER_SERVICE:
            Toast.makeText(this, "注销服务", Toast.LENGTH_SHORT).show();
            nds.stopServer();
            break;
        case OTHER_OPERATION:
            Toast.makeText(this, "其它操作", Toast.LENGTH_SHORT).show();
            loggerView.refreshSubVec(value);
            break;
        }
        return super.onOptionsItemSelected(item);
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
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        // TODO Auto-generated method stub
        switch(requestCode){
        case ACTION_WIFI_SETTINGS:
            logger.info("resultCode: " + resultCode);
            break;
        }
    }
}