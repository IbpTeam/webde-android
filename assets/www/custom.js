function updateLogView(){
    // var panel_nsd_logview = $('#afui #content #panel_nsd_logview');
    // var panel_nsd_logview_form = $(panel_nsd_logview).find('#panel_nsd_logview_form');
    // var panel_nsd_logview_form_textarea = $(panel_nsd_logview_form).find('textarea');
    var panel_nsd_talk_history = $('#afui #content #panel_nsd_talk').find('ul');
    var panel_nsd_talk_footer = $('#afui #panel_nsd_talk_footer').find('textarea');
    var content = panel_nsd_talk_footer.val();
    if(content.length){
        panel_nsd_talk_history.append($('<li></li>').html(content));
        panel_nsd_talk_footer.val('');
    }else{
        alert("内容不能为空");
    }
    // console.log("content: " + content);
    // panel_nsd_logview_form_textarea
    // $('#afui #content #panel_nsd_logview #panel_nsd_logview_form textarea').val("hello");
    // $(panel_nsd_logview_form).children('textarea').val('hellofdasf.');
}
