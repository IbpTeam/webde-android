package samples;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Container;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.util.Calendar;

import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JComponent;
import javax.swing.JFrame;
import javax.swing.JMenu;
import javax.swing.JMenuBar;
import javax.swing.JMenuItem;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.JTextField;


public class ServerFrame extends JFrame implements ActionListener{

	private JMenuBar menuBar;
	private JMenu serverMenu;
	private JMenuItem socketServerMenuItem, httpServerMenuItem, stopServerMenuItem;
	
	private Container container;
	private JTextArea historyTextArea;
	private JScrollPane scorllTextArea;
	private JTextField  sendTextField;
	private JButton sendBtn;
	private JPanel buttomPanel;
	
	private Calendar calendar;
	
	private int serverType;
	private final int NONE = 0, SOCKETSERVER = 1, HTTPSERVER = 2;
	
	private ServerFrame instance;
	public ServerFrame(){
		this.setTitle("Java服务器");
		instance = this;
		menuBar = new JMenuBar();
		container = this.getContentPane();
		
		serverMenu = new JMenu("服务器");
		socketServerMenuItem = new JMenuItem("socket服务器");
		httpServerMenuItem = new JMenuItem("Http服务器");
		stopServerMenuItem = new JMenuItem("关闭服务器");
		socketServerMenuItem.addActionListener(this);
		httpServerMenuItem.addActionListener(this);
		stopServerMenuItem.addActionListener(this);
		serverMenu.add(socketServerMenuItem);
		serverMenu.add(httpServerMenuItem);
		serverMenu.add(stopServerMenuItem);
		menuBar.add(serverMenu);
		setJMenuBar(menuBar);
		
		historyTextArea = new JTextArea();
		historyTextArea.setEditable(false);
		historyTextArea.setBackground(Color.lightGray);
		scorllTextArea = new JScrollPane(historyTextArea);
		scorllTextArea.setBorder(BorderFactory.createEmptyBorder(3, 3, 5, 3));
		
		sendTextField = new JTextField();
		sendTextField.addActionListener(this);
		sendBtn = new JButton("发送");
//		sendBtn.setBorder(BorderFactory.createEmptyBorder(0, 3, 0, 0));
		sendBtn.addActionListener(this);
		buttomPanel = new JPanel();
		buttomPanel.setLayout(new BorderLayout());
		buttomPanel.add(sendTextField, BorderLayout.CENTER);
		buttomPanel.add(sendBtn, BorderLayout.EAST);
		buttomPanel.setBorder(BorderFactory.createEmptyBorder(1, 3, 3, 3));
		
		container.add(scorllTextArea, BorderLayout.CENTER);
		container.add(buttomPanel, BorderLayout.SOUTH);
		
		calendar = Calendar.getInstance();
		
		serverType = NONE;
		addWindowListener(new WindowAdapter() {
			public void windowClosing(WindowEvent e) {
				System.out.println("服务器退出。。。");
				closeServer();
				System.exit(0);
			}
		});

		//start auto
        serverType = SOCKETSERVER;
        serverThread = new Thread(serverRun);
        serverThread.start();
	}
	private long timeMillis;
	private int hour, minute, second;
	private String text, newline = "\n";
	
	private SocketServer socketServer;
//	private HttpServer httpServer;
	private Thread serverThread;
	Runnable serverRun = new Runnable(){
		@Override
		public void run() {
			// TODO Auto-generated method stub
			switch(serverType){
			case SOCKETSERVER:
				socketServer = new SocketServer(instance);
				break;
			case HTTPSERVER:
                socketServer = new SocketServer(instance);
				break;
			}
		}
	};
	
	private void closeServer(){
		switch(serverType){
		case SOCKETSERVER:
			if(socketServer != null){
				socketServer.close();
			}
			break;
		case HTTPSERVER:
            if(socketServer != null){
                socketServer.close();
            }
			break;
		}
	}
//	private SimpleHttpServer httpServer;
	@Override
	public void actionPerformed(ActionEvent e) {
		// TODO Auto-generated method stub
		JComponent item = (JComponent) e.getSource();
		if(item.equals(socketServerMenuItem)){
			System.out.println("socketServer");	
			serverType = SOCKETSERVER;
			serverThread = new Thread(serverRun);
			serverThread.start();
		}

		if(item.equals(httpServerMenuItem)){
			System.out.println("HttpServer");
			serverType = HTTPSERVER;
			serverThread = new Thread(serverRun);
			serverThread.start();
		}

		if(item.equals(stopServerMenuItem)){
			System.out.println("stopServer");
			closeServer();
		}
		
		if(item.equals(sendTextField) || item.equals(sendBtn)){
//			System.out.println("sendTextField");
			text = sendTextField.getText();
			if(!text.equals("")){
				sendTextField.setText("");

				switch(serverType){
				case SOCKETSERVER:
					if(socketServer != null){
						socketServer.sendMsg(text);
					}
					appendToHistoryTextArea("服务器", text);
					break;
				case HTTPSERVER:
                    if(socketServer != null){
                        socketServer.sendMsg(text);
                    }
                    appendToHistoryTextArea("服务器", text);
					break;
				case NONE:
					appendToHistoryTextArea("提示", "服务器还没有启动");
					break;
				}
			}
		}
	}
//	public void appendToHistoryTextArea(String name, String msg){
	public void appendToHistoryTextArea(String name, String msg){
		timeMillis = System.currentTimeMillis();
		calendar.setTimeInMillis(timeMillis);
		hour = calendar.get(Calendar.HOUR_OF_DAY);
		minute = calendar.get(Calendar.MINUTE);
		second = calendar.get(Calendar.SECOND);
		historyTextArea.append(name + "（" + hour + "：" + minute + "：" + second + "）：" + msg + newline);
	}
}
