package dev.android.dnssd;

import android.annotation.SuppressLint;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.util.Log;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetAddress;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import javax.jmdns.JmDNS;
import javax.jmdns.ServiceEvent;
import javax.jmdns.ServiceInfo;
import javax.jmdns.ServiceListener;
import javax.jmdns.impl.DNSRecord;
import javax.jmdns.impl.constants.DNSConstants;

/**
 * @author xifeiwu
 * @version 1.0
 */
@SuppressLint("NewApi")
public class NetworkDiscovery {
    private final String DEBUG_TAG = NetworkDiscovery.class.getName();
//    private Logger logger = Logger.getLogger(DEBUG_TAG);
    private LoggerView logger;

//    private StringBuffer strBuffer = new StringBuffer();
    private final String TYPE = "_http._tcp.local.";

    private DnssdActivity mContext;
    private JmDNS mJmDNS = null;
    private ServiceInfo mServiceInfo = null;
    private ServiceListener mServiceListener;
    private WifiManager.MulticastLock mMulticastLock;

    public NetworkDiscovery(DnssdActivity context) {
        mContext = context;
        logger = mContext.loggerView;
        try {
            WifiManager wifi = (WifiManager) mContext.getSystemService(android.content.Context.WIFI_SERVICE);
            WifiInfo wifiInfo = wifi.getConnectionInfo();
            int intaddr = wifiInfo.getIpAddress();
            byte[] byteaddr = new byte[] { (byte) (intaddr & 0xff), 
                    (byte) (intaddr >> 8 & 0xff),
                    (byte) (intaddr >> 16 & 0xff), 
                    (byte) (intaddr >> 24 & 0xff) };
            InetAddress addr = InetAddress.getByAddress(byteaddr);
            logger.info(addr.getHostName() + " - " + addr.getHostAddress());
            mJmDNS = JmDNS.create(addr);
        } catch (IOException e) {
            Log.d(DEBUG_TAG, "Error in JmDNS creation: " + e);
        }
    }
    public void startServer(String name, int port, String[] props) {
        try {
            mServiceInfo = ServiceInfo.create(TYPE, name, 8888, 0, 0, textFromStringArray(props));
            mJmDNS.registerService(mServiceInfo);
        } catch (IOException e) {
            Log.d(DEBUG_TAG, "Error in JmDNS initialization: " + e);
        }
    }

    public void stopServer() {
        if ((mJmDNS != null) && (mServiceInfo != null)) {
            mJmDNS.unregisterService(mServiceInfo);
        }
    }

    public void findServers() {
        wifiLock();
        mServiceListener = new ServiceListener() {
            @Override
            public void serviceAdded(ServiceEvent event) {
                String notify = "Service added: " + event.getName() + "." + event.getType();
                logger.info(notify);
                overWriteServiceInfo(mJmDNS.getServiceInfo(event.getType(), event.getName()));
            }

            @Override
            public void serviceRemoved(ServiceEvent event) {
                String notify = "Service removed: " + event.getName() + "." + event.getType();
                logger.info(notify);
                removeServiceInfo(event.getInfo());
            }

            @Override
            public void serviceResolved(ServiceEvent event) {
                String notify = "Service resolved: " + event.getName() + "." + event.getType();
                logger.info(notify);
            }
        };
        mJmDNS.addServiceListener(TYPE, mServiceListener);
    }

    public void close() {
        if (mJmDNS != null) {
            if (mServiceListener != null) {
                mJmDNS.removeServiceListener(TYPE, mServiceListener);
                mServiceListener = null;
            }
            mJmDNS.unregisterAllServices();
        }
        // mJmDNS.close();
        if (mMulticastLock != null && mMulticastLock.isHeld()) {
            mMulticastLock.release();
        }
    }

    private void wifiLock() {
        // 应该加一个对wifi状态的判断，否则程序会报错退出。
        WifiManager wifiManager = (WifiManager) mContext.getSystemService(android.content.Context.WIFI_SERVICE);
        mMulticastLock = wifiManager.createMulticastLock(DEBUG_TAG);
        mMulticastLock.setReferenceCounted(true);
        mMulticastLock.acquire();
    }

    public void showServiceCollector() {
        List<ServiceInfo> infolist = Arrays.asList(mJmDNS.list(TYPE, DNSConstants.SERVICE_INFO_TIMEOUT));
        int cnt = 1;
        Iterator<ServiceInfo> iter = infolist.iterator();
        ServiceInfo element = null;
        while (iter.hasNext()) {
            element = (ServiceInfo) iter.next();
            logger.info(cnt++ + ":");
            logger.info(this.getAbstractServiceInfo(element).toString());
        }
    }

    public void printServiceInfoList() {
        int cnt = 1;
        Iterator<AbsServiceInfo> iter = mServiceInfoList.iterator();
        AbsServiceInfo element = null;
        while (iter.hasNext()) {
            element = (AbsServiceInfo) iter.next();
            logger.info(cnt++ + "、" + element.toString());
        }
    }

    public AbsServiceInfo getAbstractServiceInfo(ServiceInfo info){
        AbsServiceInfo absInfo= new AbsServiceInfo();
        absInfo.name = info.getName();
        absInfo.type = info.getType();
        InetAddress[] addresses = info.getInet4Addresses();
        if(addresses.length > 0){
            absInfo.address = addresses[0].getHostAddress();
        }
        absInfo.port = info.getPort();
        if (info.getTextBytes() != null && info.getTextBytes().length > 0) {
            absInfo.txtList = new ArrayList<String>();
        }
        int off = 0;
        String txt;
        while (off < info.getTextBytes().length) {
            int len = info.getTextBytes()[off++] & 0xFF;
            if ((len == 0) || (off + len > info.getTextBytes().length)) {
                break;
            }
            txt = readUTF(info.getTextBytes(), off, len);
            off += len;
            absInfo.txtList.add(txt);
        }
        absInfo.txts = absInfo.txtList.toArray(new String[absInfo.txtList.size()]);
        if (info.hasData()) {
        }
        return absInfo;
    }
    private final List<AbsServiceInfo> mServiceInfoList = new ArrayList<AbsServiceInfo>();
    //rarely used.
    public void addServiceInfo(ServiceInfo info) {
        Iterator<AbsServiceInfo> iter = mServiceInfoList.iterator();
        AbsServiceInfo element;
        boolean isExist = false;
        while (iter.hasNext()) {
            element = (AbsServiceInfo) iter.next();
            if (element.getName().equals(info.getName())) {
                isExist = true;
                break;
            }
        }
        if (!isExist) {
            mServiceInfoList.add(this.getAbstractServiceInfo(info));
        }
        mContext.nofityStateChange(mServiceInfoList);
    }
    public void overWriteServiceInfo(ServiceInfo info) {
        Iterator<AbsServiceInfo> iter = mServiceInfoList.iterator();
        AbsServiceInfo element = null;
        boolean isExist = false;
        while (iter.hasNext()) {
            element = (AbsServiceInfo) iter.next();
            if (element.getName().equals(info.getName())) {
                isExist = true;
                break;
            }
        }
        if (isExist) {
            mServiceInfoList.remove(element);
        }
        AbsServiceInfo absInfo = this.getAbstractServiceInfo(info);
        mServiceInfoList.add(absInfo);
        mContext.nofityStateChange(mServiceInfoList);
    }
    public void removeServiceInfo(ServiceInfo info) {
        Iterator<AbsServiceInfo> iter = mServiceInfoList.iterator();
        AbsServiceInfo element = null;
        boolean isExist = false;
        while (iter.hasNext()) {
            element = (AbsServiceInfo) iter.next();
            if (element.getName().equals(info.getName())) {
                isExist = true;
                break;
            }
        }
        if (isExist) {
            mServiceInfoList.remove(element);
        }
        mContext.nofityStateChange(mServiceInfoList);
    }

    class AbsServiceInfo{
        private String name;
        private String type;
        private String address;
        private int port;
        private String[] txts;
        private List<String> txtList;
        public String getName(){
            return name;
        }
        public String getType(){
            return type;
        }
        public String getAddress(){
            return address;
        }
        public int getPort(){
            return port;
        }
        public String[] getTxts(){
            return txts;
        }
        public String toString(){
            StringBuffer sb = new StringBuffer();
            sb.append(name);
            sb.append(" - ");
            sb.append("{");
            sb.append(address + ":" + port);
            sb.append("} - ");
            sb.append("txts: {");
            for(String txt: txts){
                sb.append(txt);
                sb.append(", ");
            }
            sb.append("}");
            return sb.toString();
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
    private void writeUTF(OutputStream out, String str) throws IOException {
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
    }

    private byte[] textFromProperties(Map<String, ?> props) {
        byte[] text = null;
        if (props != null) {
            try {
                ByteArrayOutputStream out = new ByteArrayOutputStream(256);
                for (String key : props.keySet()) {
                    Object val = props.get(key);
                    ByteArrayOutputStream out2 = new ByteArrayOutputStream(100);
                    writeUTF(out2, key);
                    if (val == null) {// Skip
                    } else if (val instanceof String) {
                        out2.write('=');
                        writeUTF(out2, (String) val);
                    } else if (val instanceof byte[]) {
                        byte[] bval = (byte[]) val;
                        if (bval.length > 0) {
                            out2.write('=');
                            out2.write(bval, 0, bval.length);
                        } else {
                            val = null;
                        }
                    } else {
                        throw new IllegalArgumentException("invalid property value: " + val);
                    }
                    byte data[] = out2.toByteArray();
                    if (data.length > 255) {
                        throw new IOException("Cannot have individual values larger that 255 chars. Offending value: "
                                + key + (val != null ? "" : "=" + val));
                    }
                    out.write((byte) data.length);
                    out.write(data, 0, data.length);
                }
                text = out.toByteArray();
            } catch (IOException e) {
                throw new RuntimeException("unexpected exception: " + e);
            }
        }
        return (text != null && text.length > 0 ? text : DNSRecord.EMPTY_TXT);
    }

    private byte[] textFromStringArray(String[] props) {
        byte[] text = null;
        if (props != null) {
            try {
                ByteArrayOutputStream out = new ByteArrayOutputStream(256);
                for (String val : props) {
                    ByteArrayOutputStream out2 = new ByteArrayOutputStream(100);
                    if (val == null) {
                        // Skip
                    } else if (val instanceof String) {
                        writeUTF(out2, (String) val);
                    } else {
                        throw new IllegalArgumentException("invalid property value: " + val);
                    }
                    byte data[] = out2.toByteArray();
                    if (data.length > 255) {
                        throw new IOException("Cannot have individual values larger that 255 chars. Offending value: "
                                + val);
                    }
                    out.write((byte) data.length);
                    out.write(data, 0, data.length);
                }
                text = out.toByteArray();
            } catch (IOException e) {
                throw new RuntimeException("unexpected exception: " + e);
            }
        }
        return (text != null && text.length > 0 ? text : DNSRecord.EMPTY_TXT);
    }
}