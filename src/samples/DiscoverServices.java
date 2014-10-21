// Licensed under Apache License version 2.0
// Original license LGPL

//
// This library is free software; you can redistribute it and/or
// modify it under the terms of the GNU Lesser General Public
// License as published by the Free Software Foundation; either
// version 2.1 of the License, or (at your option) any later version.
//
// This library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
// Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public
// License along with this library; if not, write to the Free Software
// Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA

package samples;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;
import java.util.logging.ConsoleHandler;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.jmdns.JmDNS;
import javax.jmdns.ServiceEvent;
import javax.jmdns.ServiceInfo;
import javax.jmdns.ServiceListener;

/**
 * Sample Code for Service Discovery using JmDNS and a ServiceListener.
 * <p>
 * Run the main method of this class. It listens for HTTP services and lists all changes on System.out.
 *
 * @author Werner Randelshofer
 */
public class DiscoverServices {
    /**
     * @param args
     *            the command line arguments
     */
    public static void main(String[] args) {
        try {

            // Activate these lines to see log messages of JmDNS
            boolean log = false;//true
            if (log) {
                Logger logger = Logger.getLogger(JmDNS.class.getName());
                ConsoleHandler handler = new ConsoleHandler();
                logger.addHandler(handler);
                logger.setLevel(Level.FINER);
                handler.setLevel(Level.FINER);
//                logger.finer("in main");
            }

            final JmDNS jmdns = JmDNS.create(getInetAddress());
            jmdns.addServiceListener("_http._tcp.local.", new ServiceListener() {
                @Override
                public void serviceAdded(ServiceEvent event) {
                    System.out.println("Service added   : " + event.getName() + "." + event.getType());
                    jmdns.getServiceInfo(event.getType(), event.getName());
//                    jmdns.requestServiceInfo(event.getType(), event.getName(), 0);
                }

                @Override
                public void serviceRemoved(ServiceEvent event) {
                    System.out.println("Service removed : " + event.getName() + "." + event.getType());
                }

                @Override
                public void serviceResolved(ServiceEvent event) {
                    ServiceInfo info = event.getInfo();
//                    System.out.println(info.toString());
                    String name = info.getName();
                    String type = info.getType();
//                    String[] address = info.getHostAddresses();
                    InetAddress[] addresses = info.getInet4Addresses();
                    int port = info.getPort();
                    byte[] txts = info.getTextBytes();
                    System.out.print("Service resolved: {");
                    System.out.print("name: " + name + "; ");
                    System.out.print("type: " + type + "; ");
                    System.out.print("address: ");
                    for(int i = 0; i < addresses.length; i++){
                        System.out.print(addresses[i].getHostAddress() + ", ");
                        
                    }
                    System.out.print("; ");
                    System.out.print("port: " + port + "; ");
                    System.out.print("txts: ");
                    int off = 0;
                    String txt;
                    while (off < info.getTextBytes().length) {
                        int len = info.getTextBytes()[off++] & 0xFF;
                        if ((len == 0) || (off + len > info.getTextBytes().length)) {
                            break;
                        }
                        txt = readUTF(info.getTextBytes(), off, len);
                        off += len;
                        System.out.print(txt + ", ");   
                    }
                    System.out.println("}");
                }
            });

//            System.out.println(writeUTF("name=android")[0]);
//            System.out.println(readUTF(writeUTF("12name=android"), 0, 15));
//            ServiceInfo serviceInfo = ServiceInfo.create("_http._tcp.local.",
//                    "AndroidTest", 8888, "12name=android");
            ServiceInfo serviceInfo = ServiceInfo.create("_http._tcp.local.",
                    "AndroidTest", 8888, 0, 0, writeUTF("12name=android"));
//            System.out.println("value of serviceInfo: " + serviceInfo.toString());
            
            jmdns.registerService(serviceInfo);
            
            System.out.println("Press q and Enter, to quit");
            int b;
            while ((b = System.in.read()) != -1 && (char) b != 'q') {
                /* Stub */
            }
            jmdns.unregisterAllServices();
            jmdns.close();
            System.out.println("Done");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * Read data bytes as a UTF stream.
     */
    static String readUTF(byte data[], int off, int len) {
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
    
    static byte[] writeUTF(String str) throws IOException {
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
    public static InetAddress getInetAddress(){
        /*
        try {
            InetAddress localhost;
            localhost = InetAddress.getLocalHost();
        } catch (UnknownHostException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        */
        // get a list of all network interfaces
        Enumeration<NetworkInterface> networkInterfaces;
        try {
            networkInterfaces = NetworkInterface.getNetworkInterfaces();
            while (networkInterfaces.hasMoreElements()) {
                NetworkInterface networkInterface = networkInterfaces.nextElement();
                int flags = 0;
                Enumeration<InetAddress> addressEnum = networkInterface.getInetAddresses();
                List<InetAddress> addresses = new ArrayList<InetAddress>();
                while (addressEnum.hasMoreElements()) {
                    InetAddress address = addressEnum.nextElement();
                    if(address instanceof java.net.Inet4Address && !address.isLoopbackAddress()){
//                        logger.info(address.getHostName() + ":" + address.getHostAddress());
                        return address;
                    }
//                    addresses.add(address);
                }
            }
        } catch (SocketException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return null;
    }
}
