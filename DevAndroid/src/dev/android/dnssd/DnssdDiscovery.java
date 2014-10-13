package dev.android.dnssd;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.logging.Logger;

import javax.jmdns.JmDNS;
import javax.jmdns.ServiceEvent;
import javax.jmdns.ServiceInfo;
import javax.jmdns.ServiceListener;

import dev.android.activity.R;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

@SuppressLint("NewApi")
public class DnssdDiscovery extends Activity {
    public static final String TAG = "DnssdDiscovery";
    private TextView textView;
    private StringBuffer strBuffer;
    private Logger logger = Logger.getLogger(DnssdDiscovery.class.getName());
    android.os.Handler handler = new android.os.Handler();

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.dnssd);
        textView = (TextView) findViewById(R.id.text);
        strBuffer = new StringBuffer();
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
    protected void onResume() {
        handler.postDelayed(new Runnable() {
            public void run() {
                activeServiceListener();
            }
        }, 500);
        super.onResume();
    }
    @Override
    protected void onPause() {
        closeJmDns();
        super.onPause();
    }
    /**
     * another way to start mdns:
     *     private NetworkDiscovery nds;
     *     nds = new NetworkDiscovery(this);
     *     nds.startServer(6666);
     *     nds.findServers();
     *
     *     nds.reset();
     * 
     */
    public void updateTextView2(View v){
        String value = strBuffer.toString();
        logger.info("value of strBuffer:");
        logger.info(value);
        logger.info("end");
        textView.setText(value);
    }    
    private void updateTextView(){
        textView.setText(strBuffer.toString());
    }

    private android.net.wifi.WifiManager wifiManager;
    private android.net.wifi.WifiManager.MulticastLock mMulticastLock;
    private String SERVICE_NAME = "AndroidTest";
    private String TYPE = "_http._tcp.local.";
    private JmDNS mJmDNS = null;
    private ServiceListener mServiceListener = null;

    public void closeJmDns() {
        if (mJmDNS != null) {
            if (mServiceListener != null) {
                mJmDNS.removeServiceListener(TYPE, mServiceListener);
                mServiceListener = null;
            }
            mJmDNS.unregisterAllServices();
        }
        if (mMulticastLock != null && mMulticastLock.isHeld()) {
            mMulticastLock.release();
        }
        try {
            mJmDNS.close();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }
    private void wifiLock() {
        WifiManager wifiManager = (WifiManager) getSystemService(android.content.Context.WIFI_SERVICE);
        mMulticastLock = wifiManager.createMulticastLock(SERVICE_NAME);
        mMulticastLock.setReferenceCounted(true);
        mMulticastLock.acquire();
    }
    
    private void activeServiceListener(){

        wifiManager = (android.net.wifi.WifiManager) getSystemService(android.content.Context.WIFI_SERVICE);
        
        WifiInfo wifiInfo = wifiManager.getConnectionInfo();
        int intaddr = wifiInfo.getIpAddress();
        byte[] byteaddr = new byte[]{
            (byte) (intaddr & 0xff),
            (byte) (intaddr >> 8 & 0xff),
            (byte) (intaddr >> 16 & 0xff),
            (byte) (intaddr >> 24 & 0xff)
        };
        InetAddress addr = null;
        try {
            addr = InetAddress.getByAddress(byteaddr);
            logger.info("local address: " + addr.getHostAddress());
        } catch (UnknownHostException e1) {
            // TODO Auto-generated catch block
            e1.printStackTrace();
        }
        
        
        mMulticastLock = wifiManager.createMulticastLock("mylockthereturn");
        mMulticastLock.setReferenceCounted(true);
        mMulticastLock.acquire();

        try {
            mJmDNS = JmDNS.create(addr);
            mServiceListener = new ServiceListener() {
                @Override
                public void serviceAdded(ServiceEvent event) {
                    String notify = "Service added: " + event.getName() + "." + event.getType();
                    mJmDNS.getServiceInfo(event.getType(), event.getName());
                    updateTextView();
                    logger.info(notify);
                    mJmDNS.requestServiceInfo(event.getType(), event.getName(), 0);
                }

                @Override
                public void serviceRemoved(ServiceEvent event) {
                    String notify = "Service removed: " + event.getName() + "." + event.getType();
                    strBuffer.append(notify + "\n");
                    updateTextView();
                    logger.info(notify);
                }

                @Override
                public void serviceResolved(ServiceEvent event) {
                    ServiceInfo info = event.getInfo();
                    String name = info.getName();
                    String type = info.getType();
                    //try function: getHostAddresses, getURLs
                    InetAddress[] addresses = info.getInet4Addresses();
                    int port = info.getPort();
                    byte[] txts = info.getTextBytes();
                    logger.info("Service resolved: {");
                    logger.info("name: " + name + "; ");
                    logger.info("type: " + type + "; ");
                    logger.info("address: ");
                    for(int i = 0; i < addresses.length; i++){
                        logger.info(addresses[i].getHostAddress() + ", ");//
                        
                    }
                    logger.info("; ");
                    logger.info("port: " + port + "; ");
                    logger.info("txts: ");
                    int off = 0;
                    String txt;
                    while (off < info.getTextBytes().length) {
                        int len = info.getTextBytes()[off++] & 0xFF;
                        if ((len == 0) || (off + len > info.getTextBytes().length)) {
                            break;
                        }
                        txt = readUTF(info.getTextBytes(), off, len);
                        off += len;
                        logger.info(txt + ", ");   
                    }
                    logger.info("}");

                    String notify = "Service resolved: " + name + "(" + addresses[0].getHostAddress() + ":" + port + ")";
                    strBuffer.append(notify + "\n");
                    updateTextView();
                }
            };
            mJmDNS.addServiceListener(TYPE, mServiceListener);            
            
            ServiceInfo serviceInfo = ServiceInfo.create("_http._tcp.local.",
                    "AndroidTest", 8888, 0, 0, writeUTF("name=AndroidTest"));            
            mJmDNS.registerService(serviceInfo);
        } catch (IOException e) {
            e.printStackTrace();
            return;
        }
    }
    /**
     * Read data bytes as a UTF stream.
     */
    public String readUTF(byte data[], int off, int len) {
        int offset = off;
        StringBuffer buf = new StringBuffer();
        for (int end = offset + len; offset < end;) {
            int ch = data[offset++] & 0xFF;
            switch (ch >> 4) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    // 0xxxxxxx
                    break;
                case 12:
                case 13:
                    if (offset >= len) {
                        return null;
                    }
                    // 110x xxxx 10xx xxxx
                    ch = ((ch & 0x1F) << 6) | (data[offset++] & 0x3F);
                    break;
                case 14:
                    if (offset + 2 >= len) {
                        return null;
                    }
                    // 1110 xxxx 10xx xxxx 10xx xxxx
                    ch = ((ch & 0x0f) << 12) | ((data[offset++] & 0x3F) << 6) | (data[offset++] & 0x3F);
                    break;
                default:
                    if (offset + 1 >= len) {
                        return null;
                    }
                    // 10xx xxxx, 1111 xxxx
                    ch = ((ch & 0x3F) << 4) | (data[offset++] & 0x0f);
                    break;
            }
            buf.append((char) ch);
        }
        return buf.toString();
    }

    /**
     * Write a UTF string with a length to a stream.
     */
    public byte[] writeUTF(String str) throws IOException {
        byte[] txts = null;
        if(0 != str.length()){
            ByteArrayOutputStream out = new ByteArrayOutputStream(str.length() + 1);
            out.write(str.length());
            for (int i = 0, len = str.length(); i < len; i++) {
                int c = str.charAt(i);
                if ((c >= 0x0001) && (c <= 0x007F)) {
                    out.write(c);
                } else {
                    if (c > 0x07FF) {
                        out.write(0xE0 | ((c >> 12) & 0x0F));
                        out.write(0x80 | ((c >> 6) & 0x3F));
                        out.write(0x80 | ((c >> 0) & 0x3F));
                    } else {
                        out.write(0xC0 | ((c >> 6) & 0x1F));
                        out.write(0x80 | ((c >> 0) & 0x3F));
                    }
                }
            }
            txts = out.toByteArray();
        }
        return txts;
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

