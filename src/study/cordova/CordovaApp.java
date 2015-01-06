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

package study.cordova;

import android.os.Bundle;
import android.view.Menu;
import android.webkit.WebSettings;

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
//        launchUrl = "file:///android_asset/www/file.html";
//        launchUrl = "file:///android_asset/www/nsdchat.html";
        launchUrl = "http://192.168.5.176:8000/app.html?ios7";
//        launchUrl = "file:///android_asset/webui/study.html?ios7";
        appView.getSettings().setCacheMode(WebSettings.LOAD_NO_CACHE);//不使用缓存
//        this.appView.enableRemoteDebugging();
        loadUrl(launchUrl);
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
