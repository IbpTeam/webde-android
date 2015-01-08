package com.ibp.controlppt;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import java.util.logging.Logger;

import android.text.TextUtils;
import android.content.pm.PackageManager;
import com.dm.zbar.android.scanner.ZBarConstants;
import com.dm.zbar.android.scanner.ZBarScannerActivity;


public class MainActivity extends Activity {
    
    private static final int ZBAR_SCANNER_REQUEST = 0;
    private static final int ZBAR_QR_SCANNER_REQUEST = 1;
    
    private Logger logger = Logger.getLogger(ViewPPT.class.getName());
    public static String url;
    public static String hostip = "";
    
    public void onCreate(Bundle savedInstaceState){
        super.onCreate(savedInstaceState);
        setContentView(R.layout.activity_main);
 
        Button bt = (Button)findViewById(R.id.Button01);
        final EditText et = (EditText)findViewById(R.id.EditText01);
//        Button btn = (Button)findViewById(R.id.qrscan_btn);
      
        bt.setOnClickListener(new View.OnClickListener() {          
            @Override
            public void onClick(View v) {
                // TODO Auto-generated method stub

                url =  "http://" + et.getText().toString() + ":8888/index.html#";
                hostip = et.getText().toString();
                logger.info(url);
                logger.info("et.getText().toString() 的长度是:" + et.getText().toString().length());
                
                Intent intent=new Intent();
                intent.setClass(MainActivity.this, ViewPPT.class);
                startActivity(intent);
            }
        });
                
    }
    
    //二维码扫描
    public void launchScanner(View v) {
        if (isCameraAvailable()) {
            Intent intent = new Intent(this, ZBarScannerActivity.class);
            startActivityForResult(intent, ZBAR_SCANNER_REQUEST);
        } else {
            Toast.makeText(this, "Rear Facing Camera Unavailable", Toast.LENGTH_SHORT).show();
        }
    }

    public boolean isCameraAvailable() {
        PackageManager pm = getPackageManager();
        return pm.hasSystemFeature(PackageManager.FEATURE_CAMERA);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        switch (requestCode) {
            case ZBAR_SCANNER_REQUEST:
            case ZBAR_QR_SCANNER_REQUEST:
                if (resultCode == RESULT_OK) {
                    Toast.makeText(this, "Scan Result = " + data.getStringExtra(ZBarConstants.SCAN_RESULT), Toast.LENGTH_SHORT).show();
                    
                    url = data.getStringExtra(ZBarConstants.SCAN_RESULT);
                    hostip = url.substring(7, url.length()-17);
                    Intent intent = new Intent();
                    intent.setClass(MainActivity.this, ViewPPT.class);
                    startActivity(intent);
                    
                } else if(resultCode == RESULT_CANCELED && data != null) {
                    String error = data.getStringExtra(ZBarConstants.ERROR_INFO);
                    if(!TextUtils.isEmpty(error)) {
                        Toast.makeText(this, error, Toast.LENGTH_SHORT).show();
                    }
                }
                break;
        }
    }
}
