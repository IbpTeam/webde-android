package com.ibp.controlppt;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Bundle;
import android.view.Display;
import android.view.WindowManager;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;


import com.ibp.controlppt.MainActivity;

import java.util.logging.Logger;

@SuppressLint("NewApi") public class ViewPPT extends Activity {
    WebView mWebView;
    private Logger logger = Logger.getLogger(ViewPPT.class.getName());
    
    
    @SuppressWarnings({ "static-access", "deprecation" })
    @SuppressLint("SetJavaScriptEnabled") @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.webview);
        
        WindowManager manage=getWindowManager();
        Display display=manage.getDefaultDisplay();
        int screenHeight=display.getHeight();
        int screenWidth=display.getWidth();
         logger.info("size of screen: " + screenWidth + " * " +screenHeight);
        
        mWebView = (WebView)findViewById(R.id.webview01);
        mWebView.setWebContentsDebuggingEnabled(true);
        mWebView.setVerticalScrollBarEnabled(true);
        
        WebSettings settings = mWebView.getSettings();
//        settings.setBuiltInZoomControls(true);
        settings.setJavaScriptEnabled(true);
        settings.setUseWideViewPort(true); 
        settings.setLoadWithOverviewMode(true); 

        //让WebView获得焦点
        mWebView.requestFocus();

        logger.info("HOSTIP: " + MainActivity.hostip);
         if(MainActivity.hostip.length() == 0){
               mWebView.loadUrl("http://www.baidu.com");
               logger.info("当输入框为空时，将加载百度首页：http://www.baidu.com");
           }
           else mWebView.loadUrl(MainActivity.url);
                       
        mWebView.setWebViewClient(new WebViewClient(){
            @Override
              public boolean shouldOverrideUrlLoading(WebView view, String url) {  //重写此方法表明点击网页里面的链接还是在当前的webview里跳转，不跳到浏览器那边
                 view.loadUrl(url);
                 return true;
            }
          });
       }

}
