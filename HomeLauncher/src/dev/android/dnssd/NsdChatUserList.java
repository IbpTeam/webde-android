package dev.android.dnssd;

import java.util.ArrayList;
import java.util.List;

import org.ibp.webde.R;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.TextView;

public class NsdChatUserList extends ListView{
    private UserListAdapter userListAdapter;
    private List<AbsServiceInfo> mServiceInfoList = new ArrayList<AbsServiceInfo>();
    private Context mContext;
    public NsdChatUserList(Context context) {
        // TODO Auto-generated constructor stub
        super(context);
        mContext = context;
        userListAdapter = new UserListAdapter(mContext, R.layout.nsdchat_userlist, mServiceInfoList);
        this.setAdapter(userListAdapter);
        this.setOnItemClickListener(clickListener);
    }
    private OnItemClickListener clickListener = new OnItemClickListener() {
        @Override
        public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
            AbsServiceInfo serviceInfo = mServiceInfoList.get(i);
            DnssdActivity.instance.showNsdChatViewFromUserList(serviceInfo);
        }
    };
    public void updateAdapter(List<AbsServiceInfo> infoList){
        mServiceInfoList.clear();
        for(AbsServiceInfo info: infoList){
            mServiceInfoList.add(info);
        }
        userListAdapter.resetData(mServiceInfoList);
        userListAdapter.notifyDataSetChanged();
        this.setSelection(0);
    }
}
class UserListAdapter extends ArrayAdapter<AbsServiceInfo>{
    private Context mContext;
    private int layoutResourceId;
    private List<AbsServiceInfo> serviceInfoList;

    public UserListAdapter(Context context, int resource, List<AbsServiceInfo> infoList) {
        super(context, resource, infoList);
        // TODO Auto-generated constructor stub
        mContext = context;
        layoutResourceId = resource;
        serviceInfoList = infoList;
    }
    
    public void resetData(List<AbsServiceInfo> infoList){
        this.serviceInfoList = infoList;
    }


    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        // TODO Auto-generated method stub
        if(convertView==null){
            // inflate the layout
            LayoutInflater inflater = (LayoutInflater) mContext.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            convertView = inflater.inflate(layoutResourceId, parent, false);
        }
        TextView name = (TextView) convertView.findViewById(R.id.name);
        TextView address_port = (TextView) convertView.findViewById(R.id.address_port);
        if(serviceInfoList != null){
            AbsServiceInfo absServiceInfo = serviceInfoList.get(position);
            // get the TextView and then set the text (item name) and tag (item ID) values
            name.setText(absServiceInfo.getName());
            address_port.setText(absServiceInfo.getAddress() + ":" + absServiceInfo.getPort());
        } 
        return convertView;
    }
    
}