var appletContent="";
var selectedApToLocate=null;
var selectedApToLocateLat=null;
var selectedApToLocateLon=null;
var updateLocationAction=1;
var currentMapListener=null;
var currentMarkerListener=null;
var animDuration="0";
/**
 * Parametric timeouts
 */
function configure_changeNetwork(page,select){
    switch(page){
        case 'overview':
            showSecondaryMenu("2","0",false);
            loadPage("2-0","network="+select.value);
            break;
    }
}
function configure_changeNetwork_new(page,value){
    switch(page){
        case 'overview':
            showSecondaryMenu("2","0",false);
            loadPage("2-0","network="+value);
            break;
        case 'addap':
            showSecondaryMenu("2","4",false);
            loadPage("2-4","network="+value);
            break;
    }
}
function configure_addNetwork() {	
}
function updateFwNetwork(network){
    if(confirm('Do you want to upgrade all upgradable and online aps?')){
        loadPage("2-0","network="+network+"&updateFw=true");
    }
}
function configure_selectDevice(id){
    if(markers[id]==null){
        //show message no location
        $("#noLocationContainer").show(animDuration);
        if(infowindow!=null){
            infowindow.close();
        }
        selectedApToLocate=id;
    }
    else{
        $("#noLocationContainer").hide(animDuration);
        configure_displayDevice(id);
    }
    $('#changeSettingsVar').unbind('click');
    $("#changeSettingsVar").click(function() {
        configure_accessPoint_settings(id);
    });
    $('#locationMapper').hide(animDuration);
}
function configure_monitorNetwork(id){
    showSecondaryMenu("1","0",false);
    loadPage("1-0","network="+id);
}
function configure_configureNetwork(id){
    //showSecondaryMenu("2","0",false);
    //loadPage("2-0","network="+id);
}

/**
 * Add access point overlay functions
 */

function configure_updateAddPosition(toAlert){
    if(isFloatValue(document.getElementById("addNetworkLat").value) && isFloatValue(document.getElementById("addNetworkLon").value) &&
        parseFloat(document.getElementById("addNetworkLat").value)>=-90 &&  parseFloat(document.getElementById("addNetworkLat").value)<=90 &&
        parseFloat(document.getElementById("addNetworkLon").value)>=-180 &&  parseFloat(document.getElementById("addNetworkLon").value)<=180 ) {
        latlonMarkerAttuale=new google.maps.LatLng(document.getElementById("addNetworkLat").value,document.getElementById("addNetworkLon").value);
        markerAttualeExpose.setPosition(latlonMarkerAttuale);
        markerAttualeExpose.setMap(mapExpose);
        mapExpose.panTo(latlonMarkerAttuale);
    }
    else{
        if(toAlert==undefined || toAlert==true){
            alert("Coordinates are not valid!");
        }
    }
}

function configure_updateAddPositionAP(){
    latlonMarkerAttuale=new google.maps.LatLng(parseFloat(document.getElementById("addAccessPointLat").value)+"",parseFloat(document.getElementById("addAccessPointLon").value)+"");
    markerAttualeExpose.setPosition(latlonMarkerAttuale);
    markerAttualeExpose.setMap(mapExpose);
    mapExpose.panTo(latlonMarkerAttuale);
    $("#configureAddMapNext").removeAttr("disabled");
    
}
function configure_createDisplay(id){
    var contentString = "<div style='min-width:280px'><p class='googleMsg'> " + networks[id][3] + "</p>";
    contentString = contentString
    + "<table style=\"width:100%\"><tr><td><div id=\"location_bttn\" class=\"bttn bttn_red\" style=\"width:135px\"><a href=\"#\" onclick=\"configure_prepareDragAccessPoint('"
    + id
    + "')\"/>Change Location</a><span></span></div></td>"
    + "<td><div id=\"settings_bttn\" class=\"bttn bttn_red\" style=\"width:135px\"><a href=\"#\" onclick=\"configure_accessPoint_settings('"
    + id
    + "')\"/>Change Settings</a><span></span></div></td></tr></table></div>"
    return contentString;
} 
function configure_createDisplayDb(id){
    var contentString = networksDb[id][3]+" <br/>";
    return contentString;
}
function configure_displayDevice(id){
    var sede=networks[id];
    var latlng = new google.maps.LatLng(sede[1], sede[2]);
    infowindow.setContent(configure_createDisplay(id));
    infowindow.open(map,markers[id]);
    map.panTo(latlng);
}

function configure_cancelChangeLocation(){
    $('#locationMapper').hide(animDuration);
    if(markers[selectedApToLocate]==null){
        $('#noLocationContainer').show(animDuration);
    }
    configure_resetCurrentMarker();
    if(currentMapListener!=null){
        google.maps.event.removeListener(currentMapListener);
    }
    if(currentMarkerListener!=null){
        google.maps.event.removeListener(currentMarkerListener);
    }
}
function configure_prepareDragAccessPoint(id){
    if(infowindow!=null){
        infowindow.close();
    }
    if(id!=null){
        selectedApToLocate=id;
    }
    $('#locationMapper').show(animDuration);
    $('#noLocationContainer').hide(animDuration);
    var latlng=map.getCenter();
    configure_resetCurrentMarker();
    selectedApToLocateLat=latlng.lat();
    selectedApToLocateLon=latlng.lng();
    if(markers[selectedApToLocate]!=null){
        markerAttuale=markers[selectedApToLocate];
        markerAttuale.setIcon("static/images/accessPointLocate.png");
        markerAttuale.setDraggable(true);
        selectedApToLocateLat=markerAttuale.getPosition().lat();
        selectedApToLocateLon=markerAttuale.getPosition().lng();
    }
    else{
        markerAttuale= new MarkerWithLabel({
            draggable : true,
            animation : google.maps.Animation.DROP,
            position : latlng,
            map : map,
            icon : {
                url : "static/images/accessPointLocate.png"
            },
            labelContent : "Drag this AP",
            labelAnchor : new google.maps.Point(20, 0),
            labelClass : "mapMarker", // the CSS class for the label
            labelStyle : {
                opacity : 0.75
            }
        });
    }
	
    currentMapListener=google.maps.event.addListener(map, 'click', function(event) {
        var latlng=new google.maps.LatLng(event.latLng.lat(),event.latLng.lng());
        markerAttuale.setPosition(latlng);
        markerAttuale.setMap(map);
        selectedApToLocateLat=markerAttuale.getPosition().lat();
        selectedApToLocateLon=markerAttuale.getPosition().lng();
    });
    currentMarkerListener=google.maps.event.addListener(markerAttuale, 'dragend', function() {
        selectedApToLocateLat=markerAttuale.getPosition().lat();
        selectedApToLocateLon=markerAttuale.getPosition().lng();
    });
    if(infowindow!=null){
    //	infowindow.close();
    }
}
function configure_resetCurrentMarker(){
    if(markers[selectedApToLocate]==null){
        if(markerAttuale!=null){
            markerAttuale.setMap(null);
        }
    }
    else{
        markers[selectedApToLocate].setIcon("static/images/accessPoint.png");
        markers[selectedApToLocate].setDraggable(false);
        var lattmp=new google.maps.LatLng(networks[selectedApToLocate][1],networks[selectedApToLocate][2]);
        markers[selectedApToLocate].setPosition(lattmp);
    }
	
}
function configure_updateAPLocation(){
    $("#configureSaveUpdateAPLocation").attr("disabled","disabled");
    if(selectedApToLocateLat!=null && selectedApToLocateLon!=null){
        executeAjaxRequest("index.php?", "action=ajaxLoadConfigure_updateApLocation&id="+selectedApToLocate+"&lat="+selectedApToLocateLat+"&lon="+selectedApToLocateLon,
            // success
            function(data) {
                if (stopExecution(data)) {
                    return;
                }		
                if (data.postJavascript != null) {
                    eval(data.postJavascript);
                }
            }
            );
    }
}
function configure_accessPoint_settings(id,upgrade){
    var strid=null;
    try{
        strid=$(".subsection").filter(".tabclick").attr("id");
    }catch(err){
            
    }
    if(strid!=null){
        for(var k=0;k<strid.length;k++){
            if(!isNaN(strid.charAt(k))){
                strid=strid.substring(k);
                break;
            }
        }
    }
    else{
        strid="";
    }
    loadPage('configure-accessPoint-settings','id='+id+"&selection="+strid+"&upgrade="+(upgrade!=null?upgrade:""));
}
function configure_accessPoint_settings_byopid(id){
    loadPage('configure-accessPoint-settings','opid='+id);
}
function configure_accessPoint_saveLanSettings(){
    var params=$("#device_info_form").serialize()+"&command=save";
    loadPage('configure-accessPoint-settings',params);
}

function configure_accessPoint_submitApply(){
    if(dd_isTanazaDevice()){
        dd_generateInternetTable();
    }
    var error=false;
    var modified=false;
    var first=-1;
    for(var i=0;i<=8;i++){
        if(cur_section_status[i]==1){
            error=true;
            if(first==-1){
                first=i;
            }
        }
        if(cur_section_status[i]==2){
            modified=true;
        }
    }
    if(error==true){
        switch(first){
            case 0:
                showSubSection(first,'summary');
                break;
            case 1:
                showSubSection(first,'base_station');
                break;
            case 2:
                showSubSection(first,'radio');
                break;
            case 3:
                showSubSection(first,'control');
                break;
            case 4:
                showSubSection(first,'internet');
                break;
            case 5:
                showSubSection(first,'tcpip');
                break;
            case 6:
                showSubSection(first,'dhcpnat');
                break;
            case 7:
                showSubSection(first,'snmp');
                break;
            case 8:
                showSubSection(first,'advanced');
                break;
        }
        showValidationError();
        updateMainSize();
    }
    else{
        if(!modified){
            showNoChangesToApply();
            updateMainSize();
        }
        else{
            configure_accessPoint_saveAll();
        }
    }
}
function showValidationError(){    
     if($("#validationError")==null || $("#validationError").length==0){
         var htmlText=generateMessageHtml("validationError","alert","The configuration submitted is not valid. Please pay attention to the values you submit.");
         $("#messageContainer").append(htmlText);         
         $("#validationError").show(animDuration,function(){
            updateMainSize();
         });
     }
     $("#validationError").show(animDuration,function(){
        updateMainSize();
     });
     if($("#validationNoChanges")==null || $("#validationNoChanges").length==0){
         
     }
     else{
         $("#validationNoChanges").remove();
     }
     updateMainSize();
}
function showNoChangesToApply(){
    if($("#validationNoChanges")==null || $("#validationNoChanges").length==0){
         var htmlText=generateMessageHtml("validationNoChanges","message","The latest configuration submitted has no changes to be applied");
         $("#messageContainer").append(htmlText);         
         $("#validationNoChanges").show(animDuration,function(){
            updateMainSize();
         });
     }
     $("#validationNoChanges").show(animDuration,function(){
        updateMainSize();
     });
     if($("#validationError")==null || $("#validationError").length==0){
         
     }
     else{
         $("#validationError").remove();
     }
     updateMainSize();
}
function showApNotReachable(age,error){
    var result=templatemessage_apnotreachable;
    result=result.replace('{{ age }}', age);
    $("#apnotreachableText").html(result);   
    if(error){
        $("#apnotreachableImg").attr("src","static/images/status_ap_offline.png");   
    }
    else{
        $("#apnotreachableImg").attr("src","static/images/status_ap_problem.png"); 
    }
    
    $("#apnotreachable").show(animDuration,function(){
        updateMainSize();
    });
    updateMainSize();
    //$("#apnotreachableText");
}
function hideApNotReachable(){
    $("#apnotreachable").hide(animDuration);
    updateMainSize();
}
function showConfigurationMessage(type,text){
    $("#configurationStatusText").html(text);
    if(type=="message"){
        $("#configurationStatus").removeClass("alert");
        $("#configurationStatus").removeClass("info");
        $("#configurationStatus").addClass("message");
    }
    if(type=="info"){
        $("#configurationStatus").removeClass("alert");
        $("#configurationStatus").removeClass("message");
        $("#configurationStatus").addClass("info");
    }
    if(type=="alert"){
        $("#configurationStatus").removeClass("message");
        $("#configurationStatus").removeClass("info");
        $("#configurationStatus").addClass("alert");
    }
     $("#configurationStatus").show(animDuration,function(){
        updateMainSize();
     });
     updateMainSize();
}
function hideConfigurationMessage(){
    $("#configurationStatus").hide(animDuration);
    updateMainSize();
}
function configure_accessPoint_saveAll() {
    var params=$("#configure_form").serialize()+"&command=save_configure";
    if(dd_isTanazaDevice()){
        params=params+"&f_maintenance_group_configuration="+trim(escape(dd_getBridgeConfiguration()));
        params=params+"&f_maintenance_interface_configuration="+trim(escape(dd_getInterfaceConfiguration()));
    }
    //loadPage('configure-accessPoint-settings',params);
    postRevision(params);
}
function postRevision(params){
    params = params+"&action=ajaxLoadConfigure_accessPoint_settings";
    updateLayout(3);
    var timestampId=new Date().getTime();
    history_ajax[""+timestampId]=new Array(""+timestampId);
    params=params+"&timestampId="+timestampId;
    lastInterruptible=""+timestampId;
    params=params+"&tz="+tsDiff;
    showLoader("menuLevel3");
    showLoader("content");
    $.post(getServer()+"index.php?", params, function(data2) {
        //console.log("eseguita:"+data2.menu3);
        if (stopExecution(data2)) {
            return;
        }
        showSection("menuLevel3", data2.menu3);
        showSection("content", data2.content);
        jQuery("#titleText").html(data2.titleText);
        if (data2.postJavascript != null) {
            eval(data2.postJavascript);
        }
        updateMainSize();
        showSecondaryMenu(2,2,false);
    },'jsonp');
    
}
function configure_accessPoint_updateFirmware() {
    var params=$("#configure_form").serialize()+"&command=updateFirmware";
    postRevision(params);
}
function configure_accessPoint_reboot() {
    var params=$("#configure_form").serialize()+"&command=reboot";
    postRevision(params);
}
function configure_deleteAp() {
    var params=$("#configure_form").serialize()+"&command=delete";
    postRevision(params);
}
function switch_to_configure_accessPoint_settings(id){
    if($("#expose .close")!=null && $("#expose .close").length>0){
        try{
            $("#expose .close").click();
        }catch(err){
            console.log(err);
        }
    }
    configure_accessPoint_settings(id);
}

function edit_dhcpnat(row_index){
    $("#ip"+row_index).addClass("active_input");
    $("#ip"+row_index).css("width","90px");
    $("#ip"+row_index).attr("readonly",false);
    $("#mac"+row_index).addClass("active_input");
    $("#mac"+row_index).css("width","90px");
    $("#mac"+row_index).attr("readonly",false);
    $("#des"+row_index).addClass("active_input");
    $("#des"+row_index).css("width","90px");
    $("#des"+row_index).attr("readonly",false);
	
    $(".active_input").addClass("idleField");  
    $(".active_input").hover(function() {
        if(!$(this).hasClass("focusField"))
            $(this).removeClass("idleField").addClass("hoverField");  
    } , function() {
        if(!$(this).hasClass("focusField"))
            $(this).removeClass("hoverField").addClass("idleField");  
    }); 
    $(".active_input").focus(function() {
        $(this).removeClass("hoverField").addClass("focusField");  
    });
    $(".active_input").blur(function() {
        $(this).removeClass("focusField").addClass("idleField");   
    });
	
    $("#ip"+row_index).focus();
}

function checkDHCPTab() {
    var sharingValue = $("#internet_sharing").val();
    if ( sharingValue == 't' ) $("#subsection6").show('slow');
    else $("#subsection6").hide('slow');
	
	
}

function initCheckDHCPTab() {
    $("#internet_sharing").change(checkDHCPTab);
    checkDHCPTab();
}

function updateTcpIpSelection(select,disabled,dhcpClientEnabled){
    if($("#m_tcp_dhcp").attr("value")=="3"){
        $('#tcpipTable input').attr("disabled","disabled");
        $('#f_tcp_dns_0').attr("disabled","disabled");
        $('#f_tcp_dns_1').attr("disabled","disabled");
    }
    else{
        if(disabled){
            $('#tcpipTable input').attr("disabled","disabled");
            $('#f_tcp_dns_0').attr("disabled","disabled");
            $('#f_tcp_dns_1').attr("disabled","disabled");
        }
        else{
            if(select.value=="0"){
                $('#tcpipTable input').removeAttr("disabled");
            }
            if(select.value=="2"){
                $('#tcpipTable input').removeAttr("disabled");
                $('#f_tcp_dns_0').attr("disabled","disabled");
                $('#f_tcp_dns_1').attr("disabled","disabled");
            }
        }
    }
}
function updateSnmpEnable(disabled){
    if(!disabled){
        $('#snmp input').removeAttr("disabled"); 
    }
    snmpSectionValidation();
}
function updateSnmpDisable(disabled){
    if(!disabled){
        $('#snmp input').attr("disabled","disabled");
    }
    snmpSectionValidation();
}
function updateAutoRollbackEnable(disabled){
    autoRollbackSectionValidation();
}
function updateAutoRollbackDisable(disabled){
    autoRollbackSectionValidation();
}
function updateRemoteSyslogEnable(disabled){
    if(!disabled){
        $('#tableAdvanced .remotesyslogfield').removeAttr("disabled"); 
    }
    remoteSyslogSectionValidation();
}
function updateRemoteSyslogDisable(disabled){
    if(!disabled){
         $('#tableAdvanced .remotesyslogfield').attr("disabled","disabled");
    }
    remoteSyslogSectionValidation();
}
function updateAutoRebootEnable(disabled){
    if(!disabled){
        $('#tableAdvanced .autorebootfield').removeAttr("disabled"); 
    }
    autoRebootSectionValidation();
}
function updateAutoRebootDisable(disabled){
    if(!disabled){
         $('#tableAdvanced .autorebootfield').attr("disabled","disabled");
    }
    autoRebootSectionValidation();
}
function updateLocalWebserverEnable(disabled){
    localWebServerValidation();
}
function updateLocalWebserverDisable(disabled){
    localWebServerValidation();
}
function updateSshEnable(){
    baseStationValidation();
}
function updateSshDisable(){
    baseStationValidation();
}

function updateMonitoringEnable(disabled){
    if(!disabled){
        $('#snmp input').attr("disabled","disabled");
    }
    $('#snmpSwitch .cb-enable').unbind('click');
    $('#snmpSwitch .cb-disable').unbind('click');
    $('#snmpSwitch').addClass('switchDown');
    snmpSectionValidation();
    $('#f_maintenance_monitoring_enabled').removeAttr("disabled"); 
}
function updateMonitoringDisable(disabled){
    $('#snmpSwitch').removeClass('switchDown');
    if(!disabled){
        if($("#f_maintenance_snmp_enabled").attr("checked")!=null && $("#f_maintenance_snmp_enabled").attr("checked")=="checked"){
            $('#snmp input').removeAttr("disabled"); 
        }
        else{
            $('#snmp input').attr("disabled","disabled");
        }
    }
    $("#snmpSwitch .cb-enable").click(function(){
        var parent = $(this).parents('.switch');
        $('.cb-disable',parent).removeClass('selected');
        $(this).addClass('selected');
        $('.checkbox',parent).attr('checked', true);
        updateSnmpEnable(false);
    });
    $("#snmpSwitch .cb-disable").click(function(){
        var parent = $(this).parents('.switch');
        $('.cb-enable',parent).removeClass('selected');
        $(this).addClass('selected');
        $('.checkbox',parent).attr('checked', false);
        updateSnmpDisable(false);
    });
    $('#f_maintenance_monitoring_enabled').removeAttr("disabled"); 
    snmpSectionValidation();
}
function edit_reservation(row_index,div,focus_input){
    var reset_row = true;

    if(div == "mac") {
        $auto_size = "120px";
        if($("#mac"+row_index).hasClass("active_input"))
            reset_row = false;
    } else {
        if(div == 'dhcpnat') {
            $auto_size = "90px";
            if($("#ip"+row_index).hasClass("active_input"))
                reset_row = false;
        } else {
            if(div == 'vlan') {
                $auto_size = "132px";
                if($("#name"+row_index).hasClass("active_input"))
                    reset_row = false;
            } else {
                var div_name = div.split("_");
                if(div_name[0] == 'radius' && typeof(focus_input) == "undefined") {
                    $auto_size = "140px";
                    if($("#host"+div_name[1]+"_"+row_index).hasClass("active_input"))
                        reset_row = false;
                }
                div = div_name[0];
            }
        }
    }
	
    $("#"+div+" .active_input").unbind('focus blur mouseenter mouseleave');
    $("#"+div+" #table_alternate .active_input").each(
        function(){ 
            $(this).removeClass("idleField");
            $(this).removeClass("focusField");
            $(this).removeClass("hoverField");
            $(this).removeClass("active_input");
            $(this).attr("readonly", "readonly");
        }
        ); 
	
    if(reset_row) {
        if(div == 'dhcpnat' || div == 'mac') {
            if(div == 'dhcpnat') {
                $size = "86px";
                $("#ip"+row_index).addClass("active_input");
                $("#ip"+row_index).css("width",$size);
                $("#ip"+row_index).css("height","15px");
                $("#ip"+row_index).attr("readonly",false);
            } else 
                $size = "116px";
			
            $("#mac"+row_index).addClass("active_input");
            $("#mac"+row_index).css("width",$size);
            $("#mac"+row_index).css("height","15px");
            $("#mac"+row_index).attr("readonly",false);
            $("#des"+row_index).addClass("active_input");
            $("#des"+row_index).css("width",$size);
            $("#des"+row_index).css("height","15px");
            $("#des"+row_index).attr("readonly",false);
        } else {
            if(div == 'vlan') {
                $size = "128px";
                $("#name"+row_index).addClass("active_input");
                $("#name"+row_index).css("width",$size);
                $("#name"+row_index).css("height","15px");
                $("#name"+row_index).attr("readonly",false);
                $("#id"+row_index).addClass("active_input");
                $("#id"+row_index).css("width",$size);
                $("#id"+row_index).css("height","15px");
                $("#id"+row_index).attr("readonly",false);
            } else {
                $size = "136px";
                if(typeof(focus_input) == "undefined") {
                    $("#host"+div_name[1]+"_"+row_index).addClass("active_input");
                    $("#host"+div_name[1]+"_"+row_index).css("width",$size);
                    $("#host"+div_name[1]+"_"+row_index).css("height","15px");
                    $("#host"+div_name[1]+"_"+row_index).attr("readonly",false);
                    $("#port"+div_name[1]+"_"+row_index).addClass("active_input");
                    $("#port"+div_name[1]+"_"+row_index).css("width",$size);
                    $("#port"+div_name[1]+"_"+row_index).css("height","15px");
                    $("#port"+div_name[1]+"_"+row_index).attr("readonly",false);
                    if($("#secret"+div_name[1]+"_"+row_index).css("display") == 'inline') {
                        $("#secret"+div_name[1]+"_"+row_index).addClass("active_input");
                        $("#secret"+div_name[1]+"_"+row_index).css("width",$size);
                        $("#secret"+div_name[1]+"_"+row_index).css("height","15px");
                        $("#secret"+div_name[1]+"_"+row_index).attr("readonly",false);
                    } else {
                        $("#secrettext"+div_name[1]+"_"+row_index).addClass("active_input");
                        $("#secrettext"+div_name[1]+"_"+row_index).css("width",$size);
                        $("#secrettext"+div_name[1]+"_"+row_index).css("height","15px");
                        $("#secrettext"+div_name[1]+"_"+row_index).attr("readonly",false);
                    }
                } else {
                    $("#secrettext"+div_name[1]+"_"+row_index).addClass("active_input");
                    $("#secrettext"+div_name[1]+"_"+row_index).css("width",$size);
                    $("#secrettext"+div_name[1]+"_"+row_index).css("height","15px");
                    $("#secrettext"+div_name[1]+"_"+row_index).attr("readonly",false);
                }
            }
        }
		
        $(".active_input").addClass("idleField");   
        $(".active_input").hover(function() {					  
            if(!$(this).hasClass("focusField"))
                $(this).removeClass("idleField").addClass("hoverField");  
        } , function() {
            if(!$(this).hasClass("focusField"))
                $(this).removeClass("hoverField").addClass("idleField");  
        }); 
        $(".active_input").focus(function() {
            $(this).removeClass("hoverField").addClass("focusField");  
        });
        $(".active_input").blur(function() {
            $(this).removeClass("focusField").addClass("idleField");   
        });
	
        if(div == 'dhcpnat')
            $("#ip"+row_index).focus();
        else {
            if(div == 'mac')
                $("#mac"+row_index).focus();
            else {
                if(div == 'vlan')
                    $("#name"+row_index).focus();
                else
                if(typeof(focus_input) == "undefined")
                    $("#host"+div_name[1]+"_"+row_index).focus();
                else {
                    $("#"+focus_input+""+div_name[1]+"_"+row_index).focus();
                }
            }
        }
    } else {
        $("#"+div+" .table_input").css("width",$auto_size);
    }
		
}

function remove_reservation(row,table) {
    if(typeof(table) == "undefined")
        $("#row"+row).remove();
    else 
        $("#row"+table+"_"+row).remove();
}

function add_reservation(div)  {
	
    var row = $('#'+div+' #table_alternate >tbody >tr').length + 1;

    if(div == 'dhcpnat') {
        $('#table_alternate > tbody:last').append('<tr id="row'+row+'"><td><input type="text" name="ip'+row+'"  id="ip'+row+'" value="" class="table_input" style="width:90px"></td><td><input type="text" name="mac'+row+'" id="mac'+row+'" value="" class="table_input" style="width:90px"></td><td><input type="text" name="des'+row+'" id="des'+row+'" value="" class="table_input" style="width:90px"></td><td><input type="image" src="static/images/edit.png" alt="Edit" Title="Edit" onClick="edit_reservation('+row+',\''+div+'\')"></td><td><input type="image" src="static/images/remove.png" alt="Remove" Title="Remove" onClick="remove_reservation('+row+')"></td></tr>');
    } else {
        if(div == 'mac') {  
            $('#'+div+' #table_alternate > tbody:last').append('<tr id="row'+row+'"><td><input type="text" name="mac'+row+'" id="mac'+row+'" value="" class="table_input" style="width:120px"></td><td><input type="text" name="des'+row+'" id="des'+row+'" value="" class="table_input" style="width:120px"></td><td><input type="image" src="static/images/edit.png" alt="Edit" Title="Edit" onClick="edit_reservation('+row+',\''+div+'\')"></td><td><input type="image" src="static/images/remove.png" alt="Remove" Title="Remove" onClick="remove_reservation('+row+')"></td></tr>');
        } else {
            if(div == 'vlan') {
                $('#'+div+' #table_alternate > tbody:last').append('<tr id="row'+row+'"><td><input type="text" name="name'+row+'" id="name'+row+'" value="" class="table_input" style="width:132px"></td><td><input type="text" name="id'+row+'" id="id'+row+'" value="" class="table_input" style="width:132px"></td><td><input type="image" src="static/images/edit.png" alt="Edit" Title="Edit" onClick="edit_reservation('+row+',\''+div+'\')"></td><td><input type="image" src="static/images/remove.png" alt="Remove" Title="Remove" onClick="remove_reservation('+row+')"></td></tr>');
            } else {
                var div_table = "";
                var div_name = div.split("_");
                if(div_name[1] == 1)
                    div_table = "t_first";
                else
                if(div_name[1] == 2)
                    div_table = "t_second";
                else
                    div_table = "t_third";
						
                row = $('#'+div_table+' #table_alternate >tbody >tr').length + 1;

                $('#'+div_table+' #table_alternate > tbody:last').append('<tr id="row'+div_name[1]+'_'+row+'"><td><input type="text" name="host'+div_name[1]+'_'+row+'" id="host'+div_name[1]+'_'+row+'" value="" class="table_input" style="width:140px"></td><td><input type="text" name="port'+div_name[1]+'_'+row+'" id="port'+div_name[1]+'_'+row+'" value="" class="table_input" style="width:140px"></td><td id="key'+div_name[1]+'_'+row+'""><input type="password" name="secret'+div_name[1]+'_'+row+'" id="secret'+div_name[1]+'_'+row+'" value="" class="table_input" style="width:140px"></td><td><input type="image" src="static/images/button/key.png" alt="Show Key" Title="Show Key" onClick="show_pwd('+row+',\''+div+'\')"><td><input type="image" src="static/images/edit.png" alt="Edit" Title="Edit" onClick="edit_reservation('+row+',\''+div+'\')"></td><td><input type="image" src="static/images/remove.png" alt="Remove" Title="Remove" onClick="remove_reservation('+row+',\''+div_name[1]+'\')"></td></tr>');
            }
        }
    }
	
    edit_reservation(row,div);
}	

function togglePwd(div) {
    var type = $("#"+div+"Type").attr("value");
    if(type=="password"){
        $("#"+div+"Text").attr("value",$("#"+div).attr("value"));
        $("#"+div).hide();
        $("#"+div+"Text").show();
        $("#"+div+"Type").attr("value","text");
    }
    else{
        $("#"+div).attr("value",$("#"+div+"Text").attr("value"));
        $("#"+div).show();
        $("#"+div+"Text").hide();
        $("#"+div+"Type").attr("value","password");
    }
}
function show_pwd(row,div) {
    if(div.indexOf("_") != -1) {
        var div_name = div.split("_");
        var value = $("#secret"+div_name[1]+"_"+row).attr("value");
        if(value != "") {
            if($("#secret"+div_name[1]+"_"+row).css("display") == 'inline') {
                $("#secret"+div_name[1]+"_"+row).hide();
                if($("#secrettext"+div_name[1]+"_"+row).length) 
                    $("#secrettext"+div_name[1]+"_"+row).fadeIn();
                else
                    $("#key"+div_name[1]+"_"+row).append('<input type="text" name="secrettext'+div_name[1]+'_'+row+'" id="secrettext'+div_name[1]+'_'+row+'" value="'+value+'" class="table_input" style="width:140px">');
                edit_reservation(row,div,'secrettext');
            } else {
                $("#secrettext"+div_name[1]+"_"+row).hide();
                $("#secret"+div_name[1]+"_"+row).fadeIn();
                if($("#host"+div_name[1]+"_"+row).hasClass("active_input"))
                    edit_reservation(row,div,'secret');
            }
        }
    } else {
        var value = $("#"+div).attr("value");
        if(value != "") {
            if($("#"+div).css("display") == 'inline') {
                $("#"+div).hide();
                if($("#"+div+"text").length) 
                    $("#"+div+"text").fadeIn();
                else
                    $("#key_"+div).append('<input type="text" name="'+div+'text" id="'+div+'text" value="'+value+'" class="active_input">');
				
                $(".active_input").addClass("idleField");   
                $(".active_input").hover(function() {					  
                    if(!$(this).hasClass("focusField"))
                        $(this).removeClass("idleField").addClass("hoverField");  
                } , function() {
                    if(!$(this).hasClass("focusField"))
                        $(this).removeClass("hoverField").addClass("idleField");  
                }); 
                $(".active_input").focus(function() {
                    $(this).removeClass("hoverField").addClass("focusField");  
                });
                $(".active_input").blur(function() {
                    $(this).removeClass("focusField").addClass("idleField");   
                });
					
                $("#"+div+"text").focus();
            } else {
                $("#"+div+"text").hide();
                $("#"+div).fadeIn();
            }
        }
    }
}

function show_table(table) {
    if($("#"+table).css("display") == 'none'){
        $("#"+table).fadeIn('slow');
    }
    else{
        $("#"+table).fadeOut('slow');
        if(typeof($("#"+table+" #table_alternate >thead tr").css("background-color")) != "undefined"){
            $("#"+table+" #table_alternate").tableScroll({
                height:92
            });	
        }
    }
    $(".multitable").each(
        function(){ 
            var id = $(this).attr("id");
            if(id != table) 
                $(this).css("display","none");
        }
        ); 
}
function checkPendingRevision(id,random){
    requestUri = "action=ajaxLoadConfigure_accessPoint_checkPendingRev&id="+id;
    executeAjaxRequest("index.php?", requestUri,
        // success
        function(data) {
            if (stopExecution(data)) {
                return;
            }
            if(data.status=="ok"){
                configure_accessPoint_settings(id);
            }
            else{
                if(data.step!=null){
                    switch(data.step){
                        case "0":
                            $(".loadingConfigurationDivProgress").html("First try to configure device in progress ...");
                            break;
                        case "1":
                            $(".loadingConfigurationDivProgress").html("Second try to configure device in progress ...");
                            break;
                        case "2":
                            $(".loadingConfigurationDivProgress").html("Third try to configure device in progress ...");
                            break;
                        case "3":
                            $(".loadingConfigurationDivProgress").html("Fourth try to configure device in progress ...");
                            break;
                    }
                }
                if($('#ajaxLoadConfigureOverview'+random).attr("value")=="true"){
                    timer=setTimeout("checkPendingRevision("+id+","+random+")",2000);
                }
            }
            if(data.aps!=null){
                updateLeftMenuApStatus(data.aps);
            }
        },
        // beforeSend
        function(xhr) {
            cleanTimers();
        },null,false);
}
/**
 *  The following array holds value representing the current validation/modification status of the configuration sections
 *  
 *  0 = not modified
 *  1 = modified
 *  2 = validation error    
 *  
 */

/**
* Update layout based on error and modified values
*/
function updateLayoutForValidation(values,index){
    var error=false;
    var modified=false;
    while(true){
        var element=values.pop();
        if(element==null){
            break;
        }
        cleanField('#'+element['identifier']);
        if(element['error']==true){
            error=true;
            showError('#'+element['identifier']);
        }
        else{
            if(element['modified']==true){
                showModified('#'+element['identifier']);
                modified=true;
            }
        }
    }
    if(error){
        showErrorSection(index);
        $("#dhcpGuide").show();
    }
    else{
        $("#dhcpGuide").hide();
        if(modified){
            showModifiedSection(index);
        }
        else{
            showUnModifiedSection(index);
        }
    }
    error=false;
    modified=false
    for(var i=0;i<=8;i++){
        if(cur_section_status[i]==1){
            error=true;
        }
        if(cur_section_status[i]==2){
            modified=true;
        }
    }
    if(error){
        console.log("Error Mode");
    }
    else{
        if(modified){
            console.log("Modified Mode");
        }
        else{
            console.log("Normal Mode");
        }
    }
}
var cur_values=new Array();
/**
 * Status:
 * 0 - Normal
 * 1 - Error
 * 2 - Modified
 */
var cur_section_status=new Array();
/**
 *  Client side validation:
 *  TODO add Dhcp Server validation
 */ 
function enableModificationChecker(){
    
    $("#base_station .active_input").keyup(function() {
        baseStationValidation();
    });
    $("#base_station select").change(function() {
        baseStationValidation();
    });
    $("#radio select").change(function() {
        var values=new Array();
        var status=new Array();
      
        /**
       * Radio Country
       */
        var radio_country=$("#m_radio_country").attr("value");
        status=new Array();
        status['identifier']="m_radio_country";
        status['error']=false;
        status['modified']=false;
        if(isBlankOrNull(radio_country) || parseInt(radio_country)!=""+parseInt(radio_country) || parseInt(radio_country)<0 || parseInt(radio_country)>104){
            status['error']=true;
        }
        if(cur_values['m_radio_country']!=radio_country){
            status['modified']=true;
        }
        values.push(status);
      
      
       /**
       * Radio Mode
       */
        var radio_mode=$("#m_radio_mode").attr("value");
        status=new Array();
        status['identifier']="m_radio_mode";
        status['error']=false;
        status['modified']=false;
        if(isBlankOrNull(radio_mode) || parseInt(radio_mode)!=""+parseInt(radio_mode) || parseInt(radio_mode)<0 || parseInt(radio_mode)>10){
            status['error']=true;
        }
        if(cur_values['m_radio_mode']!=radio_mode){
            status['modified']=true;
        }
        values.push(status);
      
        /**
       * Radio Channel
       */
        var radio_channel=$("#m_radio_channel").attr("value");
        status=new Array();
        status['identifier']="m_radio_channel";
        status['error']=false;
        status['modified']=false;
        if(isBlankOrNull(radio_channel) || parseInt(radio_channel)!=""+parseInt(radio_channel) || parseInt(radio_channel)<0 || parseInt(radio_channel)>13){
            status['error']=true;
        }
        if(cur_values['m_radio_channel']!=radio_channel){
            status['modified']=true;
        }
        values.push(status);
      
        updateLayoutForValidation(values,2);
    });
    $("#internet select").change(function() {
        var values=new Array();
        var status=new Array();
      
    /**
       * Connection sharing
       */
    /*
      var connection_sharing=$("#internet_sharing").attr("value");
      status=new Array();
      status['identifier']="internet_sharing";
      status['error']=false;
      status['modified']=false;
      if(isBlankOrNull(connection_sharing)){
          status['error']=true;
      }
      if(cur_values['internet_sharing']!=connection_sharing){
          status['modified']=true;
      }
      values.push(status);
      
      updateLayoutForValidation(values,4);*/
    });
    $("#tcpip select").change(function() {
        tcpSectionValidation();
    });
    $("#tcpip .active_input").keyup(function() {
        tcpSectionValidation();
    });
    $("#snmp .active_input").keyup(function() {
        snmpSectionValidation();
    });
    $(".remotesyslogfield").keyup(function() {
        remoteSyslogSectionValidation();
    });
    $(".autorebootfield").keyup(function() {
        autoRebootSectionValidation();
    });
    
}
function baseStationValidation(){
       
    var values=new Array();
    var status=new Array();
    /**
       * AP NAME
       */
    var ap_name=$("#f_base_ap_name_mod").attr("value");
    status=new Array();
    status['identifier']="f_base_ap_name_mod";
    status['error']=false;
    status['modified']=false;
    if(!isValidDeviceName(ap_name)){
        status['error']=true;
    }
    if(cur_values['f_base_ap_name_mod']!=ap_name){
        status['modified']=true;
    }
    values.push(status);
    
    
    /**
    * TimeZone 
    */
     var radio_country=$("#f_timezone").attr("value");
     status=new Array();
     status['identifier']="f_timezone";
     status['error']=false;
     status['modified']=false;
     if(cur_values['f_timezone']!=radio_country){
         status['modified']=true;
     }
     values.push(status);
        
        
    if($("#f_base_ap_domain_mod")!=null && $("#f_base_ap_domain_mod").length>0){
        var ap_domain=$("#f_base_ap_domain_mod").attr("value");
        status=new Array();
        status['identifier']="f_base_ap_domain_mod";
        status['error']=false;
        status['modified']=false;
        if(!isValidDomainName(ap_domain)){
            status['error']=true;
        }
        if(cur_values['f_base_ap_domain_mod']!=ap_domain){
            status['modified']=true;
        }
        values.push(status);
    }
    if($("#f_base_password")!=null && $("#f_base_password").length>0){
        /**
        * AP PASSWORD
        */
        var ap_password=$("#f_base_password").attr("value");
        status=new Array();
        status['identifier']="f_base_password";
        status['error']=false;
        status['modified']=false;
        if(!isValidPasswordName(ap_password)){
            status['error']=true;
        }
        if(cur_values['f_base_password']!=ap_password){
            status['modified']=true;
        }
        values.push(status);
    }
    if($("#f_base_new_password")!=null && $("#f_base_new_password").length>0){
        /**
        * New password
        */
        var ap_new_password=$("#f_base_new_password").attr("value");
        status=new Array();
        status['identifier']="f_base_new_password";
        status['error']=false;
        status['modified']=false;
        if(ap_new_password.length>0 && ap_new_password.length>validationMaxPasswordLength){
            status['error']=true;
        }
        else{
            if(ap_new_password.length>0){
               status['modified']=true; 
            }
        }
        values.push(status);
    }
    
    if($("#f_maintenance_ssh_enabled")!=null){
        /**
            * Ssh Enabled
            */
        var ssh_enabled=$("#f_maintenance_ssh_enabled").attr("checked");
        status=new Array();
        status['identifier']="f_maintenance_ssh_enabled";
        status['error']=false;
        status['modified']=false;
        if( (ssh_enabled!=null && ssh_enabled=="checked" && cur_values['f_maintenance_ssh_enabled']=="t" ) || 
            (ssh_enabled==null && cur_values['f_maintenance_ssh_enabled']=="f" ) 
            ){
        }
        else{
            status['modified']=true;
        }
        values.push(status);
    }
    updateLayoutForValidation(values,1);
}
function snmpSectionValidation(){
      
    var values=new Array();
    var status=new Array();
      
    /** Snmp depends on Tanaza Monitoring **/
      
    /**
       * Tanaza Monitoring Enabled
       */
    var tanaza_monitoring_enabled=$("#f_maintenance_monitoring_enabled").attr("checked");
    status=new Array();
    status['identifier']="f_maintenance_monitoring_enabled";
    status['error']=false;
    status['modified']=false;
    if( (tanaza_monitoring_enabled!=null && tanaza_monitoring_enabled=="checked" && cur_values['f_maintenance_monitoring_enabled']=="t" ) || 
        (tanaza_monitoring_enabled==null && cur_values['f_maintenance_monitoring_enabled']=="f" ) 
        ){
                
    }
    else{
        status['modified']=true;
    }
    values.push(status);
      
    if(!(tanaza_monitoring_enabled!=null && tanaza_monitoring_enabled=="checked") ){
        /**
        * Snmp Enabled
        */
        var snmp_enabled=$("#f_maintenance_snmp_enabled").attr("checked");
        status=new Array();
        status['identifier']="f_maintenance_snmp_enabled";
        status['error']=false;
        status['modified']=false;
        if( (snmp_enabled!=null && snmp_enabled=="checked" && cur_values['f_maintenance_snmp_enabled']=="t" ) || 
            (snmp_enabled==null && cur_values['f_maintenance_snmp_enabled']=="f" ) 
            ){
        }
        else{
            status['modified']=true;
        }
        values.push(status);

        if(snmp_enabled!=null && snmp_enabled=="checked"){
            /**
            * Snmp sysname
            */
            var sysname=$("#f_maintenance_snmp_sysname").attr("value");
            status=new Array();
            status['identifier']="f_maintenance_snmp_sysname";
            status['error']=false;
            status['modified']=false;
            if(!isValidSnmpSysnameName(sysname)){
                status['error']=true;
            }
            if(cur_values['f_maintenance_snmp_sysname']!=sysname){
                status['modified']=true;
            }
            values.push(status);
            /**
            * Snmp syscontact
            */
            var syscontact=$("#f_maintenance_snmp_syscontact").attr("value");
            status=new Array();
            status['identifier']="f_maintenance_snmp_syscontact";
            status['error']=false;
            status['modified']=false;
            if(!isValidSnmpSyscontactName(syscontact)){
                status['error']=true;
            }
            if(cur_values['f_maintenance_snmp_syscontact']!=syscontact){
                status['modified']=true;
            }
            values.push(status);
            /**
            * Snmp syslocation
            */
            var syslocation=$("#f_maintenance_snmp_syslocation").attr("value");
            status=new Array();
            status['identifier']="f_maintenance_snmp_syslocation";
            status['error']=false;
            status['modified']=false;
            if(!isValidSnmpSyslocationName(syslocation)){
                status['error']=true;
            }
            if(cur_values['f_maintenance_snmp_syslocation']!=syslocation){
                status['modified']=true;
            }
            values.push(status);
            /**
            * Snmp Read
            */
            var snmp_read=$("#f_maintenance_snmp_read").attr("value");
            status=new Array();
            status['identifier']="f_maintenance_snmp_read";
            status['error']=false;
            status['modified']=false;
            if(!isValidSnmpReadName(snmp_read)){
                status['error']=true;
            }
            if(cur_values['f_maintenance_snmp_read']!=snmp_read){
                status['modified']=true;
            }
            values.push(status);

            /**
            * Snmp Write
            */
            var snmp_write=$("#f_maintenance_snmp_write").attr("value");
            status=new Array();
            status['identifier']="f_maintenance_snmp_write";
            status['error']=false;
            status['modified']=false;
            if(!isValidSnmpWriteName(snmp_write)){
                status['error']=true;
            }
            if(cur_values['f_maintenance_snmp_write']!=snmp_write){
                status['modified']=true;
            }
            values.push(status);

            /**
            * Snmp Source
            */
            var readsource=$("#f_maintenance_snmp_readsource").attr("value");
            status=new Array();
            status['identifier']="f_maintenance_snmp_readsource";
            status['error']=false;
            status['modified']=false;
            if(!isValidSnmpSourceName(readsource)){
                status['error']=true;
            }
            if(cur_values['f_maintenance_snmp_readsource']!=readsource){
                status['modified']=true;
            }
            values.push(status);

            /**
            * Snmp Source
            */
            var writesource=$("#f_maintenance_snmp_writesource").attr("value");
            status=new Array();
            status['identifier']="f_maintenance_snmp_writesource";
            status['error']=false;
            status['modified']=false;
            if(!isValidSnmpWriteSourceName(writesource)){
                status['error']=true;
            }
            if(cur_values['f_maintenance_snmp_writesource']!=writesource){
                status['modified']=true;
            }
            values.push(status);

            /**
            * Trap community
            */
            var trapCommunity=$("#f_maintenance_snmp_trap_community").attr("value");
            status=new Array();
            status['identifier']="f_maintenance_snmp_trap_community";
            status['error']=false;
            status['modified']=false;
            if(!isValidSnmpTrapCommunityName(trapCommunity)){
                status['error']=true;
            }
            if(cur_values['f_maintenance_snmp_trap_community']!=trapCommunity){
                status['modified']=true;
            }
            values.push(status);

            /**
            * Trap Source
            */
            var trapSource=$("#f_maintenance_snmp_trap_source").attr("value");
            status=new Array();
            status['identifier']="f_maintenance_snmp_trap_source";
            status['error']=false;
            status['modified']=false;
            if(!isValidSnmpTrapSourceName(trapSource)){
                status['error']=true;
            }
            if(cur_values['f_maintenance_snmp_trap_source']!=trapSource){
                status['modified']=true;
            }
            values.push(status);

            /**
            * Trap Port
            */
            var trapPort=$("#f_maintenance_snmp_trap_port").attr("value");
            status=new Array();
            status['identifier']="f_maintenance_snmp_trap_port";
            status['error']=false;
            status['modified']=false;
            if(!isValidSnmpTrapPortName(trapPort)){
                status['error']=true;
            }
            if(cur_values['f_maintenance_snmp_trap_port']!=trapPort){
                status['modified']=true;
            }
            values.push(status);

            /**
            * Snmp Manager Source
            */
            var snmpmanager=$("#f_maintenance_snmp_manager_source").attr("value");
            status=new Array();
            status['identifier']="f_maintenance_snmp_manager_source";
            status['error']=false;
            status['modified']=false;
            if(!isValidSnmpManagerSourceName(snmpmanager)){
                status['error']=true;
            }
            if(cur_values['f_maintenance_snmp_manager_source']!=snmpmanager){
                status['modified']=true;
            }
            values.push(status);
        }
        else{
            cleanField("#f_maintenance_snmp_sysname");
            cleanField("#f_maintenance_snmp_syscontact");
            cleanField("#f_maintenance_snmp_syslocation");
            cleanField("#f_maintenance_snmp_read");
            cleanField("#f_maintenance_snmp_write");

            cleanField("#f_maintenance_snmp_readsource");
            cleanField("#f_maintenance_snmp_writesource");

            cleanField("#f_maintenance_snmp_trap_community");
            cleanField("#f_maintenance_snmp_trap_source");
            cleanField("#f_maintenance_snmp_trap_port");

            cleanField("#f_maintenance_snmp_manager_source");
        }
    }
    updateLayoutForValidation(values,7);
}
function autoRollbackSectionValidation(){
      
    var values=new Array();
    var status=new Array();      
      
    /**
    * Snmp Enabled
    */
    var autorollback_enabled=$("#f_autorollback_enabled").attr("checked");
    status=new Array();
    status['identifier']="f_autorollback_enabled";
    status['error']=false;
    status['modified']=false;
    if( (autorollback_enabled!=null && autorollback_enabled=="checked" && cur_values['f_autorollback_enabled']=="t" ) || 
        (autorollback_enabled==null && cur_values['f_autorollback_enabled']=="f" ) 
        ){
        cleanField("#f_autorollback_enabled");
    }
    else{
        status['modified']=true;
    }
    values.push(status);
    updateLayoutForValidation(values,8);
}
function remoteSyslogSectionValidation(){
      
    var values=new Array();
    var status=new Array();      
      
    /**
    * Snmp Enabled
    */
    var remotesyslog_enabled=$("#f_remote_syslog_enabled").attr("checked");
    status=new Array();
    status['identifier']="f_remote_syslog_enabled";
    status['error']=false;
    status['modified']=false;
    if( (remotesyslog_enabled!=null && remotesyslog_enabled=="checked" && cur_values['f_remote_syslog_enabled']=="t" ) || 
        (remotesyslog_enabled==null && cur_values['f_remote_syslog_enabled']=="f" ) 
        ){
    }
    else{
        status['modified']=true;
    }
    values.push(status);

    if(remotesyslog_enabled!=null && remotesyslog_enabled=="checked"){
        /**
        * Remote Syslog ip
        */
        var ip=$("#f_remote_syslog_ip").attr("value");
        status=new Array();
        status['identifier']="f_remote_syslog_ip";
        status['error']=false;
        status['modified']=false;
        if(!isValidSnmpSourceName(ip)){
            status['error']=true;
        }
        if(cur_values['f_remote_syslog_ip']!=ip){
            status['modified']=true;
        }
        values.push(status);        
    }
    else{
        cleanField("#f_remote_syslog_ip");
    }
    updateLayoutForValidation(values,8);
}
function autoRebootSectionValidation(){
      
    var values=new Array();
    var status=new Array();      
      
    /**
    * Auto reboot Enabled
    */
    var auto_reboot_enabled=$("#f_auto_reboot_enabled").attr("checked");
    status=new Array();
    status['identifier']="f_auto_reboot_enabled";
    status['error']=false;
    status['modified']=false;
    if( (auto_reboot_enabled!=null && auto_reboot_enabled=="checked" && cur_values['f_auto_reboot_enabled']=="t" ) || 
        (auto_reboot_enabled==null && cur_values['f_auto_reboot_enabled']=="f" ) 
        ){
    }
    else{
        status['modified']=true;
    }
    values.push(status);

    if(auto_reboot_enabled!=null && auto_reboot_enabled=="checked"){
        /**
        * Auto Reboot time
        */
        var ip=$("#f_auto_reboot_time").attr("value");
        status=new Array();
        status['identifier']="f_auto_reboot_time";
        status['error']=false;
        status['modified']=false;
        if(!isValid24HTime(ip)){
            status['error']=true;
        }
        if(cur_values['f_auto_reboot_time']!=ip){
            status['modified']=true;
        }
        values.push(status);        
    }
    else{
        cleanField("#f_auto_reboot_time");
    }
    updateLayoutForValidation(values,8);
}
function localWebServerValidation(){
    var values=new Array();
    var status=new Array();      
      
    /**
    * Snmp Enabled
    */
    var remotesyslog_enabled=$("#f_local_webserver_enabled").attr("checked");
    status=new Array();
    status['identifier']="f_local_webserver_enabled";
    status['error']=false;
    status['modified']=false;
    if( (remotesyslog_enabled!=null && remotesyslog_enabled=="checked" && cur_values['f_local_webserver_enabled']=="t" ) || 
        (remotesyslog_enabled==null && cur_values['f_local_webserver_enabled']=="f" ) 
        ){
    }
    else{
        status['modified']=true;
    }
    values.push(status);
    updateLayoutForValidation(values,8);
}
function tcpSectionValidation(iterate){
    var values=new Array();
    var status=new Array();
    /**
       * Configure_ip
       */
    var configure_ip=$("#m_tcp_dhcp").attr("value");
    status=new Array();
    status['identifier']="m_tcp_dhcp";
    status['error']=false;
    status['modified']=false;
    if(isBlankOrNull(configure_ip)){
        status['error']=true;
    }
    if(cur_values['m_tcp_dhcp']!=configure_ip){
        status['modified']=true;
    }
    values.push(status);
      
    //DhcpMode
    if(configure_ip=="3"){
        cleanField("#f_tcp_ip");
        cleanField("#f_tcp_subnet");
        cleanField("#f_tcp_gate");
        cleanField("#f_tcp_dns_0");
        cleanField("#f_tcp_dns_1");
        updateLayoutForValidation(values,5);
        return;
    }
    /**
       * Ip Address
       */
    var ip_address=$("#f_tcp_ip").attr("value");
    status=new Array();
    status['identifier']="f_tcp_ip";
    status['error']=false;
    status['modified']=false;
    if(isBlankOrNull(ip_address)|| !isValidIp(ip_address) || ip_address.length<2 || ip_address.lenght>30){
        status['error']=true;
    }
    if(cur_values['f_tcp_ip']!=ip_address){
        status['modified']=true;
    }
    values.push(status);
      
    /**
       * SubnetMask
       */
    var subnet_mask=$("#f_tcp_subnet").attr("value");
    status=new Array();
    status['identifier']="f_tcp_subnet";
    status['error']=false;
    status['modified']=false;
    if(isBlankOrNull(subnet_mask)|| !isValidNetmask(subnet_mask) || subnet_mask.length<2 || subnet_mask.lenght>30){
        status['error']=true;
    }
    if(!isBlankOrNull(subnet_mask) && isValidNetmask(subnet_mask)){
        try{
            var d_subip=new Subnet(subnet_mask);
        }catch(err){
            status['error']=true;
        }
    }
    if(cur_values['f_tcp_subnet']!=subnet_mask){
        status['modified']=true;
    }
    values.push(status);
      
    /**
       * Gateway
       */
    var gateway=$("#f_tcp_gate").attr("value");
    status=new Array();
    status['identifier']="f_tcp_gate";
    status['error']=false;
    status['modified']=false;
    if(isBlankOrNull(gateway)){
              
    }    
    else{
        if(!isValidIp(gateway) || gateway.length<2 || gateway.lenght>30){
            status['error']=true;
        }
    }
    if(cur_values['f_tcp_gate']!=gateway){
        status['modified']=true;
    }
    values.push(status);
      
    if(configure_ip=="0"){
        /**
           * Dns 1
           */
        var dns1=$("#f_tcp_dns_0").attr("value");
        status=new Array();
        status['identifier']="f_tcp_dns_0";
        status['error']=false;
        status['modified']=false;
        if(isBlankOrNull(dns1) || !isValidIp(dns1) || dns1.length<2 || dns1.lenght>30){
            status['error']=true;
        }
        if(cur_values['f_tcp_dns_0']!=dns1){
            status['modified']=true;
        }
        values.push(status);

        /**
           * Dns 2
           */
        var dns2=$("#f_tcp_dns_1").attr("value");
        status=new Array();
        status['identifier']="f_tcp_dns_1";
        status['error']=false;
        status['modified']=false;
        if(isBlankOrNull(dns2) || !isValidIp(dns2) || dns2.length<2 || dns2.lenght>30){
            status['error']=true;
        }
        if(cur_values['f_tcp_dns_1']!=dns2){
            status['modified']=true;
        }
        values.push(status);
    }
    else{
        cleanField("#f_tcp_dns_0");
        cleanField("#f_tcp_dns_1");
    }
    if(iterate!=null && iterate==false){
        
    }
    else{
        internetConnectionSectionValidation(values);
    }
    
}
function showErrorApSummary(){
    showErrorSection(1);
}
function showModifiedApSummary(){
    showModifiedSection(1);
}
function showUnModifiedApSummary(){
    showUnModifiedSection(1);
}
function showErrorApRadio(){
    showErrorSection(2);
}
function showModifiedApRadio(){
    showModifiedSection(2);
}
function showUnModifiedApRadio(){
    showUnModifiedSection(2);
}
function showErrorApInternet(){
    showErrorSection(4);
}
function showModifiedApInternet(){
    showModifiedSection(4);
}
function showUnModifiedApInternet(){
    showUnModifiedSection(4);
}
function showErrorApTcp(){
    showErrorSection(5);
}
function showModifiedApTcp(){
    showModifiedSection(5);
}
function showUnModifiedApTcp(){
    showUnModifiedSection(5);
}
function showModifiedApSnmp(){
    showModifiedSection(7);
}
function showUnModifiedApSnmp(){
    showUnModifiedSection(7);
}
function showModifiedSection(index){
    //$('#subsection'+index+' .modImg').attr("src","static/images/button/apply2_img.png");
    $('#subsection'+index+' .modImg').attr("src","static/images/config_status_2.png");
    $('#subsection'+index+' .modImg').attr("height","10px");
    $('#subsection'+index+' .modImg').attr("title","Click on apply to submit the changes");
    cur_section_status[index]=2;
}
function showUnModifiedSection(index){
    $('#subsection'+index+' .modImg').attr("src","static/images/blank.png");
    $('#subsection'+index+' .modImg').attr("height","10px");
    $('#subsection'+index+' .modImg').attr("title","Click on apply to submit the changes");
    cur_section_status[index]=0;
}
function showErrorSection(index){
    $('#subsection'+index+' .modImg').attr("src","static/images/config_status_1.png");
    $('#subsection'+index+' .modImg').attr("height","10px");
    $('#subsection'+index+' .modImg').attr("title","Click on apply to submit the changes");
    cur_section_status[index]=1;
}

function updateName(select){
    var name="";
    switch(select.value){
        case "random":
            return;
        case "planets":
            planets = new Array(); //viene creato l'array
            planets [0]="Mercury";
            planets [1]="Venus";
            planets [2]="Earth";
            planets [3]="Mars";
            planets [4]="Jupiter";
            planets [5]="Saturn";
            planets [6]="Uranus";
            planets [7]="Neptune";
            var randomnumber=Math.floor(Math.random()*planets.length);
            name=planets[randomnumber];
            break;
        case "simpson":
            simpson = new Array(); //viene creato l'array
            simpson [0]="Homer";
            simpson [1]="Marge";
            simpson [2]="Bart";
            simpson [3]="Maggie";
            simpson [4]="Lisa";
            simpson [5]="Nelson";
            simpson [6]="Krusty";
            simpson [7]="Ned Flanders";
            simpson [8]="Milhouse";
            var randomnumber=Math.floor(Math.random()*simpson.length);
            name=simpson[randomnumber];
            break;
        case "starwars":
            star = new Array(); //viene creato l'array
            star [0]="Luke Skywalker";
            star [1]="Princess Leia";
            star [2]="Han Solo";
            star [3]="Chewbacca";
            star [4]="C3PO";
            star [5]="R2D2";
            star [6]="Obi-Wan";
            star [7]="Darth Vader";
            star [8]="Emperor";
            star [9]="Jaba The Hutt";
            var randomnumber=Math.floor(Math.random()*star.length);
            name=star[randomnumber];
            break;
    }
    selectWrapperSetValue('select#selectTanazaName',"random");
    $("#addAccessPoint_customname").attr("value",name);
}
function configureGetErrorCodeText(code){
    switch(code){
        case "1":
            return "An Error occured during this procedure, please try again.";
        case "0.1.1":
            return "Agent is not allowed to connect to the specified address. Review your privacy policy on the agent";
        case "0.1.2":
            return "No Agent connected";
        case "0.1.3":
            return "Agent connection failed";
        case "0.1.4":
            return "Device Unreachable: Please assure that you specified the correct address and that the device is reachable";
        case "0.1.5":
            return "Invalid Hostname specified";
        case "0.1.6":
            return "A Connection error occured while attempting to comumunicate with the Device: Please assure that you specified the correct address and that the device is reachable";
        case "0.1.7":
            return "Generic Tanaza Error";
        case "0.1.8":
            return "Authentication failed";
        case "0.1.9":
            return "Your Device is not yet supported.<br/> <a target=\"_blank\" href=\"http://www.tanaza.com/request-to-support-your-device/\">Please click here and suggest your device and we will support it soon.</a>";
        case "0.1.10":
            return "The Model of your device is supported, but the specific firmware version that you are using is not yet supported.<br/> <a target=\"_blank\" href=\"http://www.tanaza.com/request-to-support-your-firmware/\">Please click here and use the form to let us know the firmware version and how urgent it is to support it.</a>";
        default:
            return "An Error occured during this procedure, please try again.";
    }
}

function configure_updateConfigureAccessPointList(random){
    requestUri = "action=ajaxLoadApStatus";
    executeAjaxRequest("index.php?", requestUri,
        // success
        function(data) {
            if (stopExecution(data)) {
                return;
            }
            if($("#ajaxLoadConfigureOverview"+random).attr("value")!="true"){
                //alert("stopping");
                return;
            }
            if(data.aps!=null){
                updateLeftMenuApStatus(data.aps);
                updateMapApStatus(data.aps);
            }
            timer=setTimeout("configure_updateConfigureAccessPointList('"+random+"')",2000);            
            updateMainSize();
        },
        // beforeSend
        function(xhr) {
            cleanTimers();
        },null,false);
}

function configure_updateConfigureAccessPointStatus(random,id){
    requestUri = "action=ajaxLoadApConfigureStatus&id="+id;
    executeAjaxRequest("index.php?", requestUri,
        // success
        function(data) {
            if (stopExecution(data)) {
                return;
            }
            if($("#ajaxLoadConfigureOverview"+random).attr("value")!="true"){
                //handle errors
                var prevStatus=$("#ajaxLoadConfigureStatus"+random).attr("value");
                
                return;
            }
            /*
            * 
            Available data
            $array["alerts"]=$alert_message;
            $array["isTanaza"]=$isTanaza;
            $array["agentOnline"]=$agentOnline;
            $array["apNotReachable"]=$apNotReachable;
            $array["lastMonitoringInfo"]=$lastMonitoringInfo;
            $array["lastMonitoringInfoLabel"]=$lastMonitoringInfoLabel;

            $array["revisionActivating"]=$revisionActivating;
            $array["revisionReboot"]=$revisionReboot;
            $array["revisionUpgrade"]=$revisionUpgrade;
            $array["errorCommandOfCurrentRevision"]=$errorCommandOfCurrentRevision;
            $array["agentLastRegistration"]=$agentLastRegistration;
            $array["lastExecutedCommandTime"]=$lastExecutedCommandTime;
            */
            var reachability=false;
            var otherStatus=false;
            var waitstatus=false;
            var waitstatusError=false;
            
            if(data.revisionActivating!=null && data.revisionActivating==false){
                //configuration not in progess                
                /*
                 * Check online/offline status
                 */                
                if(data.errorCommandOfCurrentRevision!=null && !isBlankOrNull(data.errorCommandOfCurrentRevision)){
                    //show errror of revision
                    showConfigurationMessage("alert", data.alerts);
                    otherStatus=true;
                }
                else{
                    /**
                     * Configuration ok ... should check post completition status
                     */
                    //tanaza device
                    if(data.isTanaza!=null && data.isTanaza){                        
                        if(data.agentOnline){
                            //ignore 2 step, check only last configuration time and show ok message for at max 30 seconds
                            if(data.lastExecutedCommandTime.secs!=null){                                
                                if(parseInt(data.serverTimestamp)-parseInt(data.lastExecutedCommandTime.secs)>50){
                                     hideConfigurationMessage();
                                     otherStatus=true;
                                }
                                else{
                                    showConfigurationMessage("info", "The latest configuration was applied successfully at "+data.lastExecutedCommandTimeLabel+", and the access point is up and running again.");
                                    otherStatus=true;
                                }
                            }
                        }
                        else{                        
                            if(parseInt(data.lastExecutedCommandTime.secs)-parseInt(data.agentLastRegistration/1000)>0){
                                //handle tanaza 2 step status
                                //console.log("Server:"+data.serverTimestamp);
                                //console.log(data.lastExecutedCommandTime.secs);
                                if((parseInt(data.serverTimestamp)-parseInt(data.lastExecutedCommandTime.secs))<5*60){
                                    showConfigurationMessage("message", "The configuration was submitted correctly, please wait until the access point reconnects.");
                                    otherStatus=true;
                                    waitstatus=true;
                                }
                                else{
                                    showConfigurationMessage("alert", "The configuration was submitted correctly, but the access point never reconnected after the change.<br/>Any configuration you submit may arise errors.");
                                    otherStatus=true;
                                    waitstatus=true;
                                    waitstatusError=true;
                                }
                            }
                            else{
                                //normal state
                                if(data.lastExecutedCommandTime.secs!=null){                                
                                    if(parseInt(data.serverTimestamp)-parseInt(data.lastExecutedCommandTime.secs)>60){
                                        hideConfigurationMessage();
                                        otherStatus=true;
                                    }
                                    else{
                                        showConfigurationMessage("info", "The latest configuration was applied successfully at "+data.lastExecutedCommandTimeLabel+", and the access point is up and running again.");
                                        otherStatus=true;
                                    }
                                }
                        
                            }
                        }
                    }
                    //compatible device
                    else{
                        //simple ok status
                        if(data.lastExecutedCommandTime.secs!=null){                                
                            if(parseInt(data.serverTimestamp)-parseInt(data.lastExecutedCommandTime.secs)>60){
                                hideConfigurationMessage();
                                otherStatus=true;
                            }
                            else{
                                showConfigurationMessage("info", "The latest configuration was applied successfully at "+data.lastExecutedCommandTimeLabel+", please consider it might take up to 1-2 minutes before the device is reachable again");
                                otherStatus=true;
                            }
                        }
                    }
                }
                
                /**
                 * Should show only if not in configuration and if not in wait status
                 */
                
                if(data.isTanaza!=null && data.isTanaza){
                    //is tanaza device
                    if(!data.agentOnline){
                        if(!waitstatus){
                            //console.log(data.lastMonitoringInfoLabel);s
                            var time=parseInt(data.serverTimestamp)-parseInt(data.lastMonitoringInfo)/1000;
                            showApNotReachable(data.lastMonitoringInfoLabel,time>5*60);
                            reachability=true;
                        }
                    }
                    else{
                        hideApNotReachable();
                        reachability=true;
                    }
                }
                else{
                    //compatible device
                    if(data.apNotReachable){
                        if(data.lastMonitoringInfo!=-1){
                            var time=parseInt(data.serverTimestamp)-parseInt(data.lastMonitoringInfo)/1000;
                            showApNotReachable(data.lastMonitoringInfoLabel,time>5*60);
                            reachability=true;
                        }
                        else{
                            showApNotReachable("<b style=\"color:#B44949\">No updates received until now</b>",true);
                            reachability=true;
                        }
                    }
                    else{
                        hideApNotReachable();
                        reachability=true;
                    }
                    
                }
                
            }
            /**
             * Waiting status only if tanaza
             */
            if(data.isTanaza!=null && data.isTanaza && waitstatus==true && !waitstatusError){
                $(".waitingConfigurationDiv").show();
                $("#submitButtons").css("visibility", "hidden");
            }
            else{
                $(".waitingConfigurationDiv").hide();
                $("#submitButtons").css("visibility", "visible");
            }
            if(reachability==false){
                hideApNotReachable();
            }
            if(otherStatus==false){
                hideConfigurationMessage();
            }
            if(data.aps!=null){
                updateLeftMenuApStatus(data.aps);
                updateMapApStatus(data.aps);
            }
            timer=setTimeout("configure_updateConfigureAccessPointStatus('"+random+"','"+id+"')",2000);            
            updateMainSize();
        },
        // beforeSend
        function(xhr) {
            cleanTimers();
        },null,false);
}
function generateMessageHtml(id,type,body){
    var result=templatemessage;
    result=result.replace('{{ id }}', id);
    result=result.replace('{{ type }}', type);
    result=result.replace('{{ body }}', body);
    return result;
}
 var templatemessage= [
'<div class="{{ type }}" style="margin-left:0px;display: none" id="{{ id }}">',
    '<div class="notification">',
        '{{ body }}',
    '</div>',
'</div>',
].join('');

var templatemessage_apnotreachable=[
    "The Access Point might be not reachable, no monitoring data received recently. </br>Last update: {{ age }}"
].join('');