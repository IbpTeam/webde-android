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
import android.view.WindowManager;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.Toast;

@SuppressLint("NewApi")
public class DnssdActivity extends Activity {
    public static final String TAG = "DnssdDiscovery";
    private Logger logger = Logger.getLogger(DnssdActivity.class.getName());
    android.os.Handler handler = new android.os.Handler();
    public StringBuffer strBuffer;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.dnssd);
        this.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);
        
        strBuffer = new StringBuffer("用SurfaceView显示发现的网络服务设备\n");
    }

    @Override
    protected void onStart() {
        super.onStart();
    }

    @Override
    protected void onStop() {
        super.onStop();
    }
    
    @Override
    public boolean onCreateOptionsMenu(Menu menu){
        
        menu.add(Menu.NONE,Menu.FIRST+1,1,"服务列表");
        menu.add(Menu.NONE,Menu.FIRST+2, 2, "注册服务");
        menu.add(Menu.NONE,Menu.FIRST+3, 3, "注销服务");
        
        return true;
    }
   
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {

        case Menu.FIRST + 1:

            logger.info("list of network services");
            nds.btn_listServiceInfo();
            break;

        case Menu.FIRST + 2:
            
            String[] props = new String[]{"Platform=HammerHead", "string"};
            nds.startServer("Android-hammerhead", 6666, props);
            logger.info("start server");
            strBuffer.append("start server"+ "\n");
            break;

        case Menu.FIRST + 3:
            nds.stopServer();
            logger.info("stop server");
            strBuffer.append("stop server"+ "\n");
            break;

        }

        return false;

    }
    
    @Override
    public void onOptionsMenuClosed(Menu menu) {
//        Toast.makeText(this, "选项菜单关闭了", Toast.LENGTH_LONG).show();
    }

    @Override
    public boolean onPrepareOptionsMenu(Menu menu) {
        Toast.makeText(this,"Preparing Options Menu",Toast.LENGTH_LONG).show();

        //如果返回false，此方法就把用户点击menu的动作给销毁了，onCreateOptionsMenu方法将不会被调用
        return true;
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
        strBuffer.append("start server"+ "\n"); 
    }
    public void btn_unregisterService(View v){
        nds.stopServer();
        logger.info("stop server");
        strBuffer.append("stop server"+ "\n"); 
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

