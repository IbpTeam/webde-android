package dev.android.activity;

import java.util.List;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Intent;
import android.content.pm.ResolveInfo;
import android.os.Bundle;
import android.view.Menu;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.BaseAdapter;
import android.widget.GridView;
import android.widget.ImageView;

public class DesktopActivity extends Activity {  
    GridView appsGrid;  
    private List<ResolveInfo> apps;  
    @Override  
    protected void onCreate(Bundle savedInstanceState) {  
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.desktop);
        loadApps();  
        appsGrid = (GridView) findViewById(R.id.apps_list);  
        appsGrid.setAdapter(new AppsAdapter());  
        appsGrid.setOnItemClickListener(clickListener);  
    }    
    
    private OnItemClickListener clickListener = new OnItemClickListener() {
        @Override
        public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
            ResolveInfo info = apps.get(i);
            //该应用的包名
            String pkg = info.activityInfo.packageName;
            //应用的主activity类
            String cls = info.activityInfo.name;
            ComponentName componet = new ComponentName(pkg, cls);
            Intent intent = new Intent();
            intent.setComponent(componet);
            startActivity(intent);
        }  
    };
    
    private void loadApps() {  
        Intent mainIntent = new Intent(Intent.ACTION_MAIN, null);  
        mainIntent.addCategory(Intent.CATEGORY_LAUNCHER);  
        new ImageView(DesktopActivity.this);  
        apps = getPackageManager().queryIntentActivities(mainIntent, 0);  
    }  
  
    public class AppsAdapter extends BaseAdapter {  
  
        public AppsAdapter(){  
        }  
  
        @Override  
        public int getCount() {  
            return apps.size();  
        }  
  
        @Override  
        public Object getItem(int i) {  
            return apps.get(i);  
        }  
  
        @Override  
        public long getItemId(int i) {  
            return i;  
        }  
  
  
        @Override  
        public View getView(int i, View view, ViewGroup viewGroup) {  
            ImageView iv;  
  
            if(view == null){  
                iv = new ImageView(DesktopActivity.this);  
                iv.setScaleType(ImageView.ScaleType.FIT_CENTER);  
                iv.setLayoutParams(new GridView.LayoutParams(50, 50));  
            } else {  
                iv = (ImageView) view;  
            }  
            ResolveInfo info = apps.get(i);  
            iv.setImageDrawable(info.activityInfo.loadIcon(getPackageManager()));  
            return iv;  
        }

    }
    
    
  @Override  
  public boolean onCreateOptionsMenu(Menu menu) {  
      // Inflate the menu; this adds items to the action bar if it is present.
      return true;  
  }
}  