package samples;
import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;

/**
 * 
 */

/**
 * @author Xifei Wu
 * 
 */
public class SocketServer implements Runnable {
	// 服务器连接
	public static ServerSocket serverSocket;
	// 端口
//	public static final int PORT = 8888;
	private String clientIP;
	private int clientPort;
	private ServerFrame window;
	
	private boolean flag = false;
	private Thread th;
	
	private Socket clientSocket;
	PrintWriter out;
	BufferedReader in;
	
	public SocketServer(ServerFrame frame){
		window = frame;
		flag = false;
		try {
		    serverSocket = new ServerSocket(NSDDemo.PORT);
		    window.appendToHistoryTextArea("提示", "正在等待客户端连接...");
		} 
		catch (IOException e) {
			window.appendToHistoryTextArea("提示", "Could not listen on port: " + NSDDemo.PORT);
//		    System.exit(-1);
		}
		clientSocket = null;
		try {
		    clientSocket = serverSocket.accept();
		    clientIP = clientSocket.getInetAddress().toString();
		    clientIP = clientIP.substring(1);
		    clientPort = clientSocket.getPort();
		} 
		catch (IOException e) {
			window.appendToHistoryTextArea("提示", "Accept failed: " + NSDDemo.PORT);
//		    System.exit(-1);
		}
		try {
			out = new PrintWriter(clientSocket.getOutputStream(), true);
			in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));

			flag = true;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			window.appendToHistoryTextArea("提示", "----服务器异常----");
			e.printStackTrace();
		}
		if(flag){
			th = new Thread(this);
			th.start();
		    window.appendToHistoryTextArea("提示", "----" + clientIP + ":" + clientPort + "已成功连接!----");
		}
	}
	
	public void sendMsg(String msg){
		if(flag){
			out.println(msg);
		}else{
			window.appendToHistoryTextArea("提示", "----没有客户端连接到服务器----");
		}
	}
	
	public void close(){
		if(flag){			
			flag = false;
			out.close();
			try {
				in.close();
				clientSocket.close();
				serverSocket.close();
				window.appendToHistoryTextArea("提示", "----服务器已断开!----");
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
	private long start, during;
	private final long MILLISPERTICK = 100;
	private String inputLine;
	@Override
	public void run() {
		// TODO Auto-generated method stub
		while(flag){
			start = System.currentTimeMillis();
			try {
				if(((inputLine = in.readLine()) != null)){
					window.appendToHistoryTextArea(clientIP, inputLine); 
				}
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			during = System.currentTimeMillis() - start;
			if(during < MILLISPERTICK){
				try {
					Thread.sleep(MILLISPERTICK - during);
				} catch (InterruptedException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			System.out.println("run in socketserver!!!");
		}
	}
	
//	public static void socketServer1(){
//		DataInputStream dis = null;
//		DataOutputStream dos = null;
//		try {
//			serverSocket = new ServerSocket(PORT);
//			System.out.println("正在等待客户端连接...");
//			// 这里处于等待状态，如果没有客户端连接，程序不会向下执行
//
//			// 连接
//			Socket socket = serverSocket.accept();
//			System.out.println("----客户端已成功连接!----");
//			dis = new DataInputStream(socket.getInputStream());
//			dos = new DataOutputStream(socket.getOutputStream());
//			// 读取数据
//			String clientStr = dis.readUTF();
//			// 写出数据
//			dos.writeUTF("来自服务器：" + clientStr);
//			// 得到客户端的IP
//			System.out.println("客户端的IP =" + socket.getInetAddress());
//			// 得到客户端的端口号
//			System.out.println("客户端的端口号 =" + socket.getPort());
//			// 得到本地端口号
//			System.out.println("本地服务器端口号=" + socket.getLocalPort());
//			System.out.println("-----------------------");
//			System.out.println("客户端：" + clientStr);
//		} catch (IOException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		} finally {// 我们把流的关闭写在finally里，即使读写出现问题，我们也能正常的关闭流！
//			try {
//				if (dis != null)
//					dis.close();
//				if (dos != null)
//					dos.close();
//			} catch (IOException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}
//		}
//	}
	public static void socketServer2(){
		try {
		    serverSocket = new ServerSocket(NSDDemo.PORT);
			System.out.println("正在等待客户端连接...");
		} 
		catch (IOException e) {
		    System.out.println("Could not listen on port: " + NSDDemo.PORT);
		    System.exit(-1);
		}
		Socket clientSocket = null;
		try {
		    clientSocket = serverSocket.accept();
			System.out.println("----客户端已成功连接!----");
			// 得到客户端的IP
			System.out.println("客户端的IP =" + clientSocket.getInetAddress());
			// 得到客户端的端口号
			System.out.println("客户端的端口号 =" + clientSocket.getPort());
			// 得到本地端口号
			System.out.println("本地服务器端口号=" + clientSocket.getLocalPort());
		} 
		catch (IOException e) {
		    System.out.println("Accept failed: " + NSDDemo.PORT);
		    System.exit(-1);
		}
		
		PrintWriter out;
		BufferedReader in;
		String inputLine, outputLine;
		try {
			out = new PrintWriter(clientSocket.getOutputStream(), true);
			in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
			while ((inputLine = in.readLine()) != null) {				
			    outputLine = inputLine;//"from server:" + 
				System.out.println(outputLine);
			    out.println(outputLine);
			    if (outputLine.equals("Bye."))
			    break;
			}
			out.close();
			in.close();
			clientSocket.close();
			serverSocket.close();
			System.out.println("----客户端已断开!----");
		} catch (IOException e) {
			// TODO Auto-generated catch block
			System.out.println("----服务器异常----");
			e.printStackTrace();
		}
	}
}
