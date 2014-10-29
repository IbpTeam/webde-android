package org.ibp.dnssd;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.text.Layout.Alignment;
import android.text.StaticLayout;
import android.text.TextPaint;
import android.util.AttributeSet;
import android.view.MotionEvent;
import android.view.SurfaceHolder;
import android.view.SurfaceView;

import java.util.logging.Logger;

public class DnssdSurfaceView extends SurfaceView implements
        SurfaceHolder.Callback, Runnable {
    private Logger logger = Logger.getLogger(DnssdSurfaceView.class.getName());
    private DnssdActivity myDnssdActivity ;
    private SurfaceHolder sfh;
    private Canvas canvas;
    private TextPaint textpaint;
    private boolean flag=true;

    private float x = 0, y = 0;
    private float DownY=0,MoveY=0;

    public DnssdSurfaceView(Context context, AttributeSet attrs) {
        super(context, attrs);
        // TODO Auto-generated constructor stub
        myDnssdActivity = (DnssdActivity) context;
        this.setKeepScreenOn(true);
        this.setFocusable(true);
        sfh = this.getHolder();
        sfh.addCallback(this);
        textpaint = new TextPaint();
        textpaint.setAntiAlias(true);
        textpaint.setTextSize(40);
    }

    @Override
    public void run() {        
        while (flag) {
            logic();
            draw();
            try {
                Thread.sleep(100);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    
//控制逻辑方法，控制文本的显示位置，避免越界
//如果y轴的坐标大于零，则将其值重置为0.
    private void logic() {
        // TODO Auto-generated method stub
        if(y>0)                           
            y=0;
        
    }

//绘制文本信息的方法
    public void draw() {
        canvas = sfh.lockCanvas();
        canvas.drawColor(Color.WHITE);
        StaticLayout layout = new StaticLayout(myDnssdActivity.strBuffer.toString(),textpaint,canvas.getWidth(),Alignment.ALIGN_NORMAL,1.5F,0,false);
//        y += MoveY;
        canvas.translate(x,y+MoveY);
        layout.draw(canvas);
        sfh.unlockCanvasAndPost(canvas);
        
    }
    
//触摸事件处理方法，因onTouch()方法在当前版本中不可使用，改用onTouchEvent().  
@SuppressLint("ClickableViewAccessibility") 
@Override
    public boolean onTouchEvent(MotionEvent event) {
        // TODO Auto-generated method stub
        logger.info("in function onTouchEvent");
        int action = event.getAction();
        switch (action) {
        case MotionEvent.ACTION_DOWN:
            DownY = event.getY();//float DownY
            logger.info("DownY is" + DownY);
            break;
        case MotionEvent.ACTION_MOVE:
            MoveY = event.getY() - DownY;//y轴移动距离
            logger.info("MoveY is " + MoveY);
            
            break;
        case MotionEvent.ACTION_UP:
            y += MoveY;
            MoveY = 0;
            break;
        }
        return true;
//        return super.onTouchEvent(event);
    }


    @Override
    public void surfaceCreated(SurfaceHolder holder) {
        new Thread(this).start();
    }

    @Override
    public void surfaceChanged(SurfaceHolder holder, int format, int width,
            int height) {
    }

    @Override
    public void surfaceDestroyed(SurfaceHolder holder) {
        flag=false;
    }
    
}