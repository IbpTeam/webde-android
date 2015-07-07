/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package dev.hybridapp;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Menu;
import android.webkit.WebSettings;
import android.webkit.WebSettings.ZoomDensity;

import org.apache.cordova.*;

public class CordovaApp extends CordovaActivity
{
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        super.init();
        // Set by <content src="index.html" /> in config.xml
        String launchUrl;
        /**注意修改app.html中的远程脚本custom, afclass的加载方式*/
        launchUrl = "file:///android_asset/www/app.html?ios7";
//        launchUrl = "http://192.168.5.176:8000/www/app.html?ios7";
//        launchUrl = "http://192.168.5.243:8888/www/app.html?ios7";
        WebSettings settings = appView.getSettings();
        //不使用缓存
        settings.setCacheMode(WebSettings.LOAD_NO_CACHE);
        //不能与setWindowWidth共用
//        settings.setUseWideViewPort(true);
//        settings.setLoadWithOverviewMode(true);
//      this.appView.enableRemoteDebugging();
//        this.setWindowWidth(432);
//        this.startService(new Intent(this, ListenerServiceForMobile.class));
        loadUrl(launchUrl);
    }
    private void setWindowWidth(int width){
        DisplayMetrics metrics = new DisplayMetrics();
        getWindowManager().getDefaultDisplay().getMetrics(metrics);
        int screenWidth = metrics.widthPixels;
        appView.setInitialScale((screenWidth * 100 / width));
        Log.d(TAG, "scaledDensity of DisplayMetrics:" + metrics.scaledDensity);
    }
    private void debug(){
        WebSettings settings = appView.getSettings();
        DisplayMetrics metrics = new DisplayMetrics();
        getWindowManager().getDefaultDisplay().getMetrics(metrics);
        int mDensity = metrics.densityDpi;
        Log.d(TAG, "Size of Screen:" + metrics.widthPixels + " * " + metrics.heightPixels);
        Log.d(TAG, "Size of WebView:" + this.appView.getWidth() + " * " + this.appView.getHeight());
        Log.d(TAG, "Scale of WebView:" + this.appView.getScale());
        Log.d(TAG, "densityDpi = " + mDensity);
        if (mDensity == 240) { 
            settings.setDefaultZoom(ZoomDensity.FAR);
        } else if (mDensity == 160) {
            settings.setDefaultZoom(ZoomDensity.MEDIUM);
        } else if(mDensity == 120) {
            settings.setDefaultZoom(ZoomDensity.CLOSE);
        }else if(mDensity == DisplayMetrics.DENSITY_XHIGH){
            settings.setDefaultZoom(ZoomDensity.FAR); 
        }else if (mDensity == DisplayMetrics.DENSITY_TV){
            settings.setDefaultZoom(ZoomDensity.FAR); 
        }        
    }
    
    @Override
    public Activity getActivity() {
        // TODO Auto-generated method stub
        return this;
    }

    private final int START_DISCOVER = 0, STOP_DISCOVER = 1, LIST_SERVICE_INFO = 2, RESOLVE_SERVICE = 3,
            REGISTER_SERVICE = 4, UNREGISTER_SERVICE = 5, CLEAR_SCREEN = 6;
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // TODO Auto-generated method stub
        super.onCreateOptionsMenu(menu);
        menu.add(0, START_DISCOVER, 0, "开始监控");
        menu.add(0, STOP_DISCOVER, 0, "停止监控");
        menu.add(0, LIST_SERVICE_INFO, 0, "服务列表");
        menu.add(0, RESOLVE_SERVICE, 0, "解析服务");
        menu.add(0, REGISTER_SERVICE, 0, "发布服务");
        menu.add(0, UNREGISTER_SERVICE, 0, "注销服务");
        menu.add(0, CLEAR_SCREEN, 0, "清空屏幕");
        return true;
    }
}
