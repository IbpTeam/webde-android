package dev.android.dnssd;

import java.util.List;
import java.util.logging.Logger;

import org.ibp.webde.R;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo.State;
import android.net.wifi.WifiManager;
import android.os.Bundle;
import android.view.ContextMenu;
import android.view.ContextMenu.ContextMenuInfo;
import android.view.KeyEvent;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Toast;

@SuppressLint("NewApi")
public class DnssdActivity extends Activity {
    public static final String TAG = "DnssdDiscovery";
    public static Logger logger = Logger.getLogger(DnssdActivity.class.getName());
    android.os.Handler handler = new android.os.Handler();
    public static DnssdActivity instance;
    public static int PORT = 9090;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        instance = this;
    }

    public LoggerView loggerView;
    public NsdChatUserList userListView;
    private NetworkDiscovery nds = null;
    private final int LOGGERVIEW = 0, NSDCHATUSERLIST = 1, NSDCHATVIEW = 2;
    public int curView = LOGGERVIEW;
    public void showLoggerView(){
        setContentView(loggerView);
        this.registerForContextMenu(loggerView);
        curView = LOGGERVIEW;     
    }
    public void showNstChatUserList(){
        if (userListView == null) {
            userListView = new NsdChatUserList(this);
        }
        if(nds != null){
            userListView.updateAdapter(nds.getServiceInfoList());                
        }
        setContentView(userListView);
        curView = NSDCHATUSERLIST;
    }
    public void nofityStateChange(List<AbsServiceInfo> mServiceInfoList){
        if(curView == NSDCHATUSERLIST){
            userListView.updateAdapter(mServiceInfoList);
            logger.info("in function nofityStateChange, " + mServiceInfoList.size());
        }
    }
    private NsdChatView chatView;
    private NsdChatConnection connection;
    public void showNsdChatViewFromUserList(AbsServiceInfo serviceInfo){
        this.setContentView(R.layout.nsdchat_view);
        if(connection == null){
            connection = new NsdChatConnection();
        }
        chatView = null;
        chatView = new NsdChatView(connection);
        connection.startClient(serviceInfo.getName(), serviceInfo.getAddress(), serviceInfo.getPort());
        curView = NSDCHATVIEW;
    }
    public void showNsdChatViewFromOptionMenu(){
        this.setContentView(R.layout.nsdchat_view);
        if(connection == null){
            connection = new NsdChatConnection();
        }
        chatView = null;
        chatView = new NsdChatView(connection);
        //"xifeiwu", "192.168.160.176", 6666
        connection.startServer();
        curView = NSDCHATVIEW;
    }
    @Override
    protected void onResume() {
        //loggerView must initial anyway.
        if (loggerView == null) {
            loggerView = new LoggerView(this, null);
        }
        switch(curView){
        case LOGGERVIEW:
            showLoggerView();
            break;
        case NSDCHATUSERLIST:
        case NSDCHATVIEW:
            showNstChatUserList();
            break;
        }
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

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        // TODO Auto-generated method stub
        if(keyCode == KeyEvent.KEYCODE_BACK){
            switch(this.curView){
            case NSDCHATVIEW:
                if(connection != null){
                    connection.tearDown();
                }
                this.showNstChatUserList();
                break;
            case NSDCHATUSERLIST:
                this.showLoggerView();
                break;
            case LOGGERVIEW:
                this.onDestroy();
                System.exit(0);
                break;
            }
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
    
    public void mAlertDialog(String title, String message, DialogInterface.OnClickListener positiveListener, DialogInterface.OnClickListener negetiveListener){//退出确认
        AlertDialog.Builder ad = new AlertDialog.Builder(this);//context
        ad.setTitle(title);
        ad.setMessage(message);
        ad.setPositiveButton("是", positiveListener);
        ad.setNegativeButton("否",negetiveListener);
        ad.show();
    }
    
    public boolean checkWifiState(){
        boolean isWifiEnabled = false;
        WifiManager wifi = (WifiManager) this.getSystemService(android.content.Context.WIFI_SERVICE);
        DialogInterface.OnClickListener yes = new DialogInterface.OnClickListener(){
            @Override
            public void onClick(DialogInterface arg0, int arg1) {
                // TODO Auto-generated method stub
                DnssdActivity.this.startActivity(new Intent(android.provider.Settings.ACTION_WIFI_SETTINGS));
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
        menu.add(0, OTHER_OPERATION, 0, "用户列表");
        return true;
    }
    
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // TODO Auto-generated method stub
        switch (item.getItemId()) {
        case LIST_SERVICE_INFO:
            Toast.makeText(this, "服务列表", Toast.LENGTH_SHORT).show();
            nds.printServiceInfoList();    
            break;
        case REGISTER_SERVICE:
            Toast.makeText(this, "发布服务", Toast.LENGTH_SHORT).show();
            String[] props = new String[]{"Platform=HammerHead", "string"};
            nds.startServer("Android-hammerhead", PORT, props);
            this.showNsdChatViewFromOptionMenu();
            break;
        case UNREGISTER_SERVICE:
            Toast.makeText(this, "注销服务", Toast.LENGTH_SHORT).show();
            nds.stopServer();
            break;
        case OTHER_OPERATION:
            showNstChatUserList();
            break;
        }
        return super.onOptionsItemSelected(item);
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
    public void onCreateContextMenu(ContextMenu menu, View v, ContextMenuInfo menuInfo) {
        // TODO Auto-generated method stub
        logger.info("in onCreateContextMenu");
        super.onCreateContextMenu(menu, v, menuInfo);
        menu.setHeaderTitle("操作选项");
        menu.add(0, 0, 0, "运行文件");
        menu.add(0, 1, 0, "删除文件");
        menu.add(0, 2, 0, "上传保存数据");
    }
    @Override
    public boolean onContextItemSelected(MenuItem item) {
        // TODO Auto-generated method stub
        logger.info("in onContextItemSelected");
        switch (item.getItemId()) {
        case 0:
            break;
        case 1:
            break;
        case 2:
            break;
        default:
            break;
        }
        return super.onContextItemSelected(item);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        // TODO Auto-generated method stub
        switch(requestCode){
        default:
            logger.info("resultCode: " + resultCode);
            break;
        }
    }
}