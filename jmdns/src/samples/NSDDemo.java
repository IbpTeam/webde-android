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

import java.awt.Dimension;
import java.io.IOException;


/**
 * Sample Code for Service Discovery using JmDNS and a ServiceListener.
 * <p>
 * Run the main method of this class. It listens for HTTP services and lists all changes on System.out.
 *
 * @author Werner Randelshofer
 */
public class NSDDemo {
    /**
     * @param args
     *            the command line arguments
     */
    public static final int WIDTH = 500;
    public static final int HEIGHT = 650;
    public static final int PORT = 9090;
    public static void main(String[] args) {
        try {
            NetworkDiscovery nsd = new NetworkDiscovery();
            nsd.findServers();

            String[] props = new String[] { "Platform=PC", "string" };
            nsd.startServer("Java-NetworkDiscovery-Demo", PORT, props);

            ServerFrame serverFrame = new ServerFrame();
            serverFrame.setPreferredSize(new Dimension(WIDTH, HEIGHT));
            serverFrame.pack();
            serverFrame.setVisible(true);
            
            System.out.println("Press q and Enter, to quit");
            int b;
            while ((b = System.in.read()) != -1 && (char) b != 'q') {
                /* Stub */
            }
            nsd.stopServer();
            nsd.close();
            System.out.println("Done");
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

}
