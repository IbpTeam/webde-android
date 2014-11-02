package dev.android.dnssd;

import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;


import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.UnknownHostException;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

import org.ibp.webde.R;

public class NsdChatView {
    private DnssdActivity curActivity;
    private NsdChatConnection mConnection;
    private LoggerView chatView;
    private EditText editText;
    private Button submitBtn;

    //from NsdChatUserList
    public NsdChatView(NsdChatConnection connection){
        curActivity = DnssdActivity.instance;
        mConnection = connection;
        mConnection.setMsgHandler(mUpdateHandler);
        chatView = (LoggerView) curActivity.findViewById(R.id.LoggerView);
        editText = (EditText) curActivity.findViewById(R.id.edittext);
        submitBtn = (Button) curActivity.findViewById(R.id.submitbtn);
        submitBtn.setOnClickListener(onSubmitListener);
    }

    private Handler mUpdateHandler = new Handler() {
            @Override
        public void handleMessage(Message msg) {
            String chatLine = msg.getData().getString("msg");
            chatView.info(chatLine);
        }
    };

    private View.OnClickListener onSubmitListener = new View.OnClickListener() {       
        @Override
        public void onClick(View arg0) {
            // TODO Auto-generated method stub
            String inputString;
            if(editText != null){
                inputString = editText.getText().toString();
                if(chatView != null && (inputString.length() > 0)){
                    mConnection.sendMessage(inputString);
                    editText.setText("");
                }
            }
        }
    };
}

class NsdChatConnection {

    private Handler mUpdateHandler;
    private ChatServer mChatServer;
    private ChatClient mChatClient;

    private static final String TAG = "ChatConnection";

    private Socket mSocket;
    private int myPort = DnssdActivity.PORT;

    public NsdChatConnection() {
    }

    public void setMsgHandler(Handler handler){
        mUpdateHandler = handler;        
    }
    public void startServer(){
        myPort = DnssdActivity.PORT;
        mChatServer = new ChatServer();        
    }

    public void startClient(InetAddress address, int port) {
        mChatClient = new ChatClient(address, port);
    }
    public void startClient(String name, String address, int port) {
        if(mChatClient != null){
            mChatClient.tearDown();
            closeSocket();
        }
        mChatClient = new ChatClient(name, address, port);
    }
    
    public void tearDown() {
        if(mChatServer != null){
            mChatServer.tearDown();
        }
        if(mChatClient != null){
            mChatClient.tearDown();
        }
    }

    public void sendMessage(String msg) {
        if (mChatClient != null) {
            mChatClient.sendMessage(msg);
        }
    }    

    public synchronized void updateMessages(String prefix, String msg) {
        msg = prefix + " : " + msg;
        Bundle messageBundle = new Bundle();
        messageBundle.putString("msg", msg);
        Message message = new Message();
        message.setData(messageBundle);
        mUpdateHandler.sendMessage(message);
    }

    private synchronized void setSocket(Socket socket) {
        Log.d(TAG, "setSocket being called.");
        if (socket == null) {
            Log.d(TAG, "Setting a null socket.");
        }
        if (mSocket != null) {
            if (mSocket.isConnected()) {
                try {
                    mSocket.close();
                } catch (IOException e) {
                    // TODO(alexlucas): Auto-generated catch block
                    e.printStackTrace();
                }
            }
        }
        mSocket = socket;
    }
    private synchronized void closeSocket() {
        if (mSocket == null) {
            Log.d(TAG, "Setting a null socket.");
        }
        if (mSocket != null) {
            if (mSocket.isConnected()) {
                try {
                    mSocket.close();
                } catch (IOException e) {
                    // TODO(alexlucas): Auto-generated catch block
                    e.printStackTrace();
                }
            }
        }
        mSocket = null;
    }
    
    private Socket getSocket() {
        return mSocket;
    }

    private class ChatServer {
        ServerSocket mServerSocket = null;
        Thread mThread = null;

        public ChatServer() {
            mThread = new Thread(new ServerThread());
            mThread.start();
        }

        public void tearDown() {
            mThread.interrupt();
            try {
                mServerSocket.close();
            } catch (IOException ioe) {
                Log.e(TAG, "Error when closing server socket.");
            }
        }

        class ServerThread implements Runnable {
            @Override
            public void run() {
                try {
                    // Since discovery will happen via Nsd, we don't need to care which port is
                    // used.  Just grab an available one  and advertise it via Nsd.
                    mServerSocket = new ServerSocket(myPort);
                    mServerSocket.setReuseAddress(true);
                    while (!Thread.currentThread().isInterrupted()) {
                        Log.d(TAG, "ServerSocket Created, awaiting connection");
                        updateMessages("NOTICE", "ServerSocket Created, Port: " + myPort + ", awaiting connection");
                        setSocket(mServerSocket.accept());
                        Log.d(TAG, "Connected.");

                        String clientIP;
                        int clientPort;
                        clientIP = mSocket.getInetAddress().toString();
                        clientIP = clientIP.substring(1);
                        clientPort = mSocket.getPort();
                        updateMessages("NOTICE", "Connected, " + clientIP + ":" + clientPort);

                        mChatClient = new ChatClient("me", clientIP, clientPort);
                    }
                } catch (IOException e) {
                    Log.e(TAG, "Error creating ServerSocket: ", e);
                    e.printStackTrace();
                }
            }
        }
    }

    private class ChatClient {
        private InetAddress dstInetAddress;
        private String dstName;
        private String dstAddress;
        private int dstPort;

        private final String CLIENT_TAG = "ChatClient";

        private Thread mSendThread;
        private Thread mRecThread;

        public ChatClient(InetAddress address, int port) {
            Log.d(CLIENT_TAG, "Creating chatClient");
            this.dstInetAddress = address;
            this.dstPort = port;
            mSendThread = new Thread(new SendingThread());
            mSendThread.start();
        }


        public ChatClient(String name, String address, int port) {
            Log.d(CLIENT_TAG, "Creating chatClient");
            this.dstName = name;
            this.dstAddress = address;
            this.dstPort = port;
            mSendThread = new Thread(new SendingThread());
            mSendThread.start();
        }
        
        class SendingThread implements Runnable {
            BlockingQueue<String> mMessageQueue;
            private int QUEUE_CAPACITY = 10;

            public SendingThread() {
                mMessageQueue = new ArrayBlockingQueue<String>(QUEUE_CAPACITY);
            }

            @Override
            public void run() {
                try {
                    if (getSocket() == null) {
                        setSocket(new Socket(dstAddress, dstPort));
                        Log.d(CLIENT_TAG, "Client-side socket initialized.");
                        if(getSocket().isConnected()){
                            updateMessages("NOTICE", "success connected to " + dstAddress+":"+dstPort);
                        }else{
                            updateMessages("NOTICE", "fail connected to " + dstAddress+":"+dstPort);                            
                        }
                    } else {
                        Log.d(CLIENT_TAG, "Socket already initialized. skipping!");
                    }
                    mRecThread = new Thread(new ReceivingThread());
                    mRecThread.start();
                } catch (UnknownHostException e) {
                    Log.d(CLIENT_TAG, "Initializing socket failed, UHE", e);
                    updateMessages(CLIENT_TAG, "Initializing socket failed, UHE");
                } catch (IOException e) {
                    Log.d(CLIENT_TAG, "Initializing socket failed, IOE.", e);
                    updateMessages(CLIENT_TAG, "Initializing socket failed, IOE.");
                }
            }
        }

        class ReceivingThread implements Runnable {
            @Override
            public void run() {
                BufferedReader input;
                try {
                    input = new BufferedReader(new InputStreamReader(
                            mSocket.getInputStream()));
                    while (!Thread.currentThread().isInterrupted()) {

                        String messageStr = null;
                        messageStr = input.readLine();
                        if (messageStr != null) {
                            Log.d(CLIENT_TAG, "Read from the stream: " + messageStr);
                            updateMessages(dstName, messageStr);
                        } else {
                            Log.d(CLIENT_TAG, "The nulls! The nulls!");
                            break;
                        }
                    }
                    input.close();
                } catch (IOException e) {
                    Log.e(CLIENT_TAG, "Server loop error: ", e);
                }
            }
        }

        public void tearDown() {
            try {
                if(getSocket() != null){
                    getSocket().close();
                }
                mSendThread.interrupt();
            } catch (IOException ioe) {
                Log.e(CLIENT_TAG, "Error when closing server socket.");
            }
        }

        public void sendMessage(String msg) {
            try {
                Socket socket = getSocket();
                if (socket == null) {
                    Log.d(CLIENT_TAG, "Socket is null, wtf?");
                } else if (socket.getOutputStream() == null) {
                    Log.d(CLIENT_TAG, "Socket output stream is null, wtf?");
                }
                PrintWriter out = new PrintWriter(
                        new BufferedWriter(
                                new OutputStreamWriter(getSocket().getOutputStream())), true);
                out.println(msg);
                out.flush();
                updateMessages("I say", msg);
            } catch (UnknownHostException e) {
                Log.d(CLIENT_TAG, "Unknown Host", e);
            } catch (IOException e) {
                Log.d(CLIENT_TAG, "I/O Exception", e);
            } catch (Exception e) {
                Log.d(CLIENT_TAG, "Error3", e);
            }
            Log.d(CLIENT_TAG, "Client sent message: " + msg);
        }
    }
}
