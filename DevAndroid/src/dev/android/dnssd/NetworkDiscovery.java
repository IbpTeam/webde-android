package dev.android.dnssd;

import android.annotation.SuppressLint;
import android.content.Context;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.util.Log;

import java.io.IOException;
import java.net.InetAddress;
import java.util.logging.Logger;

import javax.jmdns.JmDNS;
import javax.jmdns.ServiceEvent;
import javax.jmdns.ServiceInfo;
import javax.jmdns.ServiceListener;

/**
 * @author alwx
 * @version 1.0
 */
@SuppressLint("NewApi") 
public class NetworkDiscovery {
  private final String DEBUG_TAG = NetworkDiscovery.class.getName();
  private final String TYPE = "_http._tcp.local.";
  private final String SERVICE_NAME = "LocalCommunication";

  private Context mContext;
  private JmDNS mJmDNS;
  private ServiceInfo mServiceInfo;
  private ServiceListener mServiceListener;
  private WifiManager.MulticastLock mMulticastLock;

  public NetworkDiscovery(Context context) {
    mContext = context;
    try {
      WifiManager wifi = (WifiManager) mContext.getSystemService(android.content.Context.WIFI_SERVICE);
      WifiInfo wifiInfo = wifi.getConnectionInfo();
      int intaddr = wifiInfo.getIpAddress();

      byte[] byteaddr = new byte[]{
          (byte) (intaddr & 0xff),
          (byte) (intaddr >> 8 & 0xff),
          (byte) (intaddr >> 16 & 0xff),
          (byte) (intaddr >> 24 & 0xff)
      };
      logger.info("ipaddress: "+intaddr + " - " + byteaddr.toString());
      InetAddress addr = InetAddress.getByAddress(byteaddr);
      mJmDNS = JmDNS.create(addr);
    } catch (IOException e) {
      Log.d(DEBUG_TAG, "Error in JmDNS creation: " + e);
    }
  }

  public void startServer(int port) {
    try {
      wifiLock();
      mServiceInfo = ServiceInfo.create(TYPE, SERVICE_NAME, port, SERVICE_NAME);
      mJmDNS.registerService(mServiceInfo);
    } catch (IOException e) {
      Log.d(DEBUG_TAG, "Error in JmDNS initialization: " + e);
    }
  }

  private Logger logger = Logger.getLogger(NetworkDiscovery.class.getName());
  public void findServers() {//final OnFoundListener listener
    mJmDNS.addServiceListener(TYPE, mServiceListener = new ServiceListener() {
      @Override
      public void serviceAdded(ServiceEvent serviceEvent) {
        String notify = "Service added: " + serviceEvent.getName() + "." + serviceEvent.getType();
        logger.info(notify);
        mJmDNS.requestServiceInfo(serviceEvent.getType(), serviceEvent.getName(), 10);
      }

      @Override
      public void serviceRemoved(ServiceEvent serviceEvent) {
          String notify = "Service removed: " + serviceEvent.getName() + "." + serviceEvent.getType();//
          logger.info(notify);
      }

      @Override
      public void serviceResolved(ServiceEvent serviceEvent) {
          ServiceInfo info = serviceEvent.getInfo();
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
              logger.info(addresses[i].getHostAddress() + ", ");
              
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
          String notify = "Service resolved: " + serviceEvent.getName() + "." + serviceEvent.getType();
          logger.info(notify);
      }
    });
  }

  public void reset() {
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
  }

  private void wifiLock() {
    WifiManager wifiManager = (WifiManager) mContext.getSystemService(android.content.Context.WIFI_SERVICE);
    mMulticastLock = wifiManager.createMulticastLock(SERVICE_NAME);
    mMulticastLock.setReferenceCounted(true);
    mMulticastLock.acquire();
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
}
