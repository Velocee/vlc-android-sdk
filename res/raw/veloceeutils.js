// Velocee Javascript utilities
// Version 1.32

//Globals
var veloceeUtilsVersion = 1.3;
var adPages=new Array();
adPages[0]='http://m.ynet.co.il/Maavaron.aspx'; adPages[1]='http://m.ynet.co.il/MaavaronP.aspx';
var vlcAddedHTML5Listeners = false;
var vlcAddedYTListeners = false;
var vlcPlayer;
//var vlcYtPlayers = new Array();
//var ytEmbedFrame;

/******************************************
 *** Page load/loaded functions/actions ***
 ******************************************/
function vlcOnPageStartLoad()
{
    //preventMaavaron();
    //skipMaavaron();
    //vlcVideoLinksToProxy();
}

function vlcOnPageLoad()
{
    //vlcVideoLinksToProxy();
    //vlcTestFunc();
    //Danny Disable 02/2014
    //skipMaavaron();
    //blockZuznowPopup();
    //End 02/2014
    //disable context menu
    //logObjC("vlcOnPageLoad");
    //document.body.style.webkitTouchCallout='none';
    //setTimeout(modifyYTLinks, 5000);
    //setTimeout(vlcHtml5VideoProxy(), 5000);
    addVlcPlayer();
}

function vlcTestFunc()
{
    alert('This is velocee test');
}

function runTest()
{
    //vlcTestFunc();
}


function vlcHtml5VideoProxy()
{
    h = window.location.host;
    if (h.indexOf('ynet')==-1) {
        return;
    }
    var videos = document.getElementsByTagName('video');
    for (var i=0; i<videos.length; i++) {
        video = videos[i];
        s1=video.getAttribute('src');
        if (s1.indexOf('127.0.0.1:8080')==-1) {
            s2='http://127.0.0.1:8080/v.mp4?url='+s1;
            video.setAttribute('src',s2);
            //video.load();
        }
    }
    //alert('Video Redirected');
}

function vlcVideoLinksToProxy()
{
    //alert('converting links');
    //var videos = document.getElementsByTagName('video');
    var videos = document.querySelectorAll('a[name]');
    for (var i=0; i<videos.length; i++) {
        var video = videos[i];
        if (video.name == 'video-link') {
            s1=video.getAttribute('href');
            if (s1.indexOf('127.0.0.1:8080')==-1) {
                s2='http://127.0.0.1:8080/v.mp4?url='+s1;
                video.setAttribute('href',s2);
                video.load();
            }
        }
    }
    //alert('Video Redirected');
}

/***************************************************
 *** utilities to get resources at point on page ***
 ***************************************************/
function MyAppGetHTMLElementsAtPoint(x,y) {
    var tags = ',';
    var e = document.elementFromPoint(x,y);
    while (e) {
        if (e.tagName) {
            tags += e.tagName + ',';
        }
        e = e.parentNode;
    }
    return tags;
}

function MyAppGetLinkSRCAtPoint(x,y) {
    var tags = '';
    var e = document.elementFromPoint(x,y);
    while (e) {
        if (e.src) {
            tags += e.src;
            break;
        }
        e = e.parentNode;
    }
    return tags;
}

function MyAppGetLinkHREFAtPoint(x,y) {
    var tags = '';
    var e = document.elementFromPoint(x,y);
    while (e) {
        if (e.href) {
            tags += e.href;
            break;
        }
        e = e.parentNode;
    }
    return tags;
}

function MyAppGetTitleAtPoint(x,y)
{
    var tags = '';
    var e = document.elementFromPoint(x,y);
    while (e) {
        if (e.innerText) {
            tags += e.innerText;
            break;
        }
        e = e.parentNode;
    }
    return tags;
}

function disable_bookmark_bubble()
{
    if (window.localStorage) {
        try {
            var key = 'BOOKMARK_DISMISSED_COUNT';
            var value = 2;
            window.localStorage[key] = String(value);
            /* alert('loca lstorage set'); */
        } catch (ex) {
            /* storage size limit reached probably */
        }
    }
}



function vlcSmartGoBack()
{
    var skipPages=new Array();
    skipPages[0]='http://m.ynet.co.il/Maavaron.aspx'; skipPages[1]='http://m.ynet.co.il/MaavaronP.aspx';
    if (skipPages.indexOf(document.referrer)>-1) {
        window.history.go(-2);
        return '-2'
    } else {
        window.history.go(-1);
        return '-1';
    }
}

//Video handling youtube
function modifyYTLinks()
{
    alert("modifyYTLinks");
    links = document.links;
    count = 0;
    for(var i = 0; i< links.length; i++){
        txt = links[i].href;
        var vid = txt.match(/((\?v=)(\w[\w|-]*))/g); // end up with ?v=oHg5SJYRHA0
        if ((vid!=null)&&(vid.length)) {
            //alert(links[i].href);
            //links[i].onClick=null;
            links[i].removeAttribute("onClick");
            count++;
        }
    }
    alert("modifyYTLinks changed:"+count.toString());
}

/**************************************
 *** Handle Videos on YT site pages ***
 **************************************/
function modifyYTLinksFromList(vidsArray)
{
    //alert("modifyYTLinksFromList:"+vidsArray[0]);
    //if (vlcAddedYTListeners) {
    //    console.log("modifyYTLinksFromList already done");
    //    return 0;
    //}
    player = getYT5VideoPlayer();
    if (player) {
        if (player.getAttribute('vlc')) {
        } else {
            setYTEndPlayListener(txt);
            player.setAttribute('vlc', 1);
        }
        if (! player.paused) {
            console.log('player playing. ignore');
            //return;
        }
    }
    links = document.links;
    count = 0;
    for(var i = 0; i< links.length; i++){
        if (links[i].getAttribute('vlc')) {
            console.log('vlc attribute exists.');
            continue;
        }
        txt = links[i].href;
        var vid = txt.match(/((\?v=)(\w[\w|-]*))/g); // end up with ?v=oHg5SJYRHA0
        if ((vid!=null)&&(vid.length)) {
            if (searchStringInArray (vid[0], vidsArray)!=-1) {
                //alert(links[i].href);
                //links[i].onClick=null;
                links[i].removeAttribute("onClick");
                link.setAttribute('vlc', '0');
                count++;
            } else {
                link = links[i];
                link.setAttribute('vlc', '1');
                console.log('set listener');
                links[i].addEventListener('click', function(){
                                          //setYTEndPlayListener(txt);
                                          callObjCEx('yt_video_started', getCleanYouTubeUrl(txt), 0);
                                          //setTimeout(setYTEndPlayListener(txt), 30000);
                                          });
            }
        }
    }
    //alert("modifyYTLinks changed:"+count.toString());
    vlcAddedYTListeners = true;
    console.log("done modifyYTLinksFromList");
    return count.toString();
}

// Get YT current video element
function getYT5VideoPlayer() {
    var lplayer = document.getElementById('player');
    if (! lplayer) {
        //console.log('No Player element');
        return null;
    }
    var childs = lplayer.childNodes;
    var currentVid = null;
    for (var i=0; i<childs.length; i++) {
        if (childs[i].tagName.indexOf('VIDEO')!=-1) {
            currentVid = childs[i];
            break;
        }
    }
    return currentVid;
}

function setYTEndPlayListener(watchUrl) {
    console.log('setYTEndPlayListener:'+watchUrl);
    var currentVid = getYT5VideoPlayer();
    if (currentVid){
        if (currentVid.paused) {
            console.log('player paused');
            //setTimeout(setYTEndPlayListener(watchUrl), 3000);
            //return false;
        } else {
            console.log('player playing');
        }
        console.log('Add yt_video_ended event');
        currentVid.addEventListener('webkitendfullscreen', function(){
                                        callObjCEx('yt_video_ended', watchUrl, 0);
                                        //alert(watchUrl);
                                    }, false);
        return true;
    }
    console.log('setYTEndPlayListener No current video');
    return false;
}

function getYTLinks()
{
    //alert("getYTLinks");
    links = document.links;
    ytl = new Array();
    count = 0;
    for(var i = 0; i< links.length; i++){
        txt = links[i].href;
        var vid = txt.match(/((\?v=)(\w[\w|-]*))/g); // end up with ?v=oHg5SJYRHA0
        if ((vid!=null)&&(vid.length)) {
            ytl.push(links[i].href);
            count++;
        }
    }
    //alert("modifyYTLinks changed:"+count.toString());
    return ytl.join();
}

function getYTLinks2()
{
    //alert("getYTLinks");
    links = document.links;
    ytl = new Array();
    count = 0;
    for(var i = 0; i< links.length; i++){
        txt = links[i].href;
        var vid = txt.match(/((\?v=)(\w[\w|-]*))/g); // end up with ?v=oHg5SJYRHA0
        if ((vid!=null)&&(vid.length)) {
            ytl.push(links[i]);
            count++;
        }
    }
    //alert("modifyYTLinks changed:"+count.toString());
    return ytl;
}

/****************************
 *** HTML5 Video handling ***
 ****************************/
function vlcHtml5VideoProxyFromList(vidsArray, markVids)
{
    //alert("vlcHtml5VideoProxyFromList");
    //h = window.location.host;
    //if (h.indexOf('ynet')==-1) {return;}
    //if (vlcAddedHTML5Listeners) {return;}
    var count = 0;
    var vidsCount = 0;
    var setListeners = 1;
    var videos = document.getElementsByTagName('video');
    for (var i=0; i<videos.length; i++) {
        var video = videos[i];
        if (video.id == "vlcPlayer") {
            continue;
        }
        if (video.getAttribute('vlc')) {
            //continue;
            setListeners = 0;
        }
        var s1=video.getAttribute('src');
        if (s1.indexOf('127.0.0.1:8080')==-1) {
            //Add event listener
            //video.addEventListener('webkitbeginfullscreen', onVideoBeginsFullScreen, false);
            if (setListeners) {
                video.addEventListener('webkitbeginfullscreen', onVideoBeginsFullScreen, false);
                video.addEventListener('webkitendfullscreen', onVideoEndsFullScreen, false);
                //video.setAttribute('style',"-webkit-filter: grayscale(100%)");
            }
            if (searchStringInArray (s1, vidsArray)!=-1) {
                var vext = "mp4";
                if (s1.indexOf('m3u8') != -1) {
                    vext="m3u8";
                }
                var s2='http://127.0.0.1:8080/v.'+vext+'?url='+s1;
                video.setAttribute('src',s2);
                video.setAttribute('vlc', 1);
                if (markVids) {
                    video.style.webkitFilter = 'drop-shadow(rgba(0,0,255,0.5) 0 5px 5px)';
                }
                //DB20140513
                //video.load();
                count++;
                vidsCount++;
            } else {
                if (markVids) {
                    video.style.webkitFilter = 'drop-shadow(rgba(255,0,55,0.5) 0 5px 5px)';
                }
                video.setAttribute('vlc', 0);
                
            }
        } else {
            vidsCount++;
            if ((!video.getAttribute('vlc')) && markVids) {
                video.style.webkitFilter = 'drop-shadow(rgba(255,0,55,0.5) 0 5px 5px)';
            }
        }
        // force update
        video.style.display='none';
        video.offsetHeight;
        video.style.display='';
        if (vidsCount > 5) {
            //Limit to 5 html5 videos per page to avoid memory issues
            break;
        }
    }
    vlcAddedHTML5Listeners = true;
    //alert('HTML5 Video Redirected'+count.toString());
    return count.toString();
}

/****************************
 *** Walla Video Handling ***
 ****************************/
function modifyWallaVidLinks(vidsArray, markVids) {
    console.log("modify Walla Links");
    var links = document.links;
    var count = 0;
    var cached = 0;
    var cachedCount = 0;
    for(var i = 0; i< links.length; i++){
        cached = 0;
        var video = links[i];
        var s1 = links[i].href;
        if ((s1.indexOf('.mp4')>-1)&&(s1.indexOf('mintmark')>-1)) {
            if (video.getAttribute('vlc')) {
                count++;
                continue;
            }
            if (s1.indexOf('127.0.0.1:8080')>-1) {
                count++;
                continue;
            }
            count++;
            console.log('found video link:'+s1);
            links[i].onClick=null;
            links[i].addEventListener('click', playVid, false);  //false
            if (searchStringInArray (s1, vidsArray)!=-1) {
                s2 = getProxyUrl(s1);
                links[i].href = s2;
                cached = 1;
                console.log("Found cached Walla Video");
                if (cachedCount > 5) {
                    console.log("Walla cached count>5");
                }
                else {
                    cachedCount++;
                    count++;
                    //continue;
                }
            }
            links[i].setAttribute('vlc', cached);
            if (cached == 1) {
                if  ((links[i].children[0].className == "icon play") ||
                    (links[i].children[0].src.indexOf("play.png")!=-1)) {
                    //console.log("set shadow");
                    if (markVids) {
                        links[i].children[0].setAttribute('style', "-webkit-filter: drop-shadow(rgba(0,0,255,0.8) 0 5px 5px)");
                    }
                } else {
                    if (markVids) {
                        links[i].children[0].setAttribute('style', "-webkit-filter: drop-shadow(rgba(255,0,0,0.8) 0 5px 5px)");
                    }
                    //console.log("no shadow set");
                }
            }
        }
    }
//    console.log("modify Walla Links changed:"+count.toString());
    return cachedCount.toString();
}




/*******************************
 *** Walla App Links Link Bg ***
 *******************************/
function markWallaVideoLinksJsonP(vidsArray, markVids) {
    if (!markVids) {
        return;
    }
    function jsonp(url, node, callback) {
        var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
        var n = node;
        window[callbackName] = function(data,node) {
            delete window[callbackName];
            document.body.removeChild(script);
            var args = Array.prototype.slice.call(arguments);
            args.unshift(n);
            callback.apply(this, args);
        };
        var script = document.createElement('script');
        script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
        document.body.appendChild(script);
    }
    var u = document.getElementsByTagName('a');
    for (var x=0;x<u.length;x++)
        if (u[x].href.indexOf("walla://playvideo")!=-1) {
            var z = "http://ws.walla.co.il/flvpl/?id="+u[x].href.split('=')[1]+"&type=jsonp";
            jsonp(z, u[x], function(node,data) {
              var s1 = data.video_src_iphone;
              window.vlc_walla_vid = s1;
              //console.log("Success, got "+ s1);
              //node.onClick=null;
              //node.addEventListener('click', playVid, false);  //false
              if (searchStringInArray (s1, vidsArray)!=-1) {
                  if (node.children[1].children[0].src.indexOf("play.png")!=-1) {
                    node.style.webkitFilter = 'drop-shadow(rgba(0,0,255,0.8) 0 5px 5px)';
                  } else {
                    node.style.webkitFilter = 'drop-shadow(rgba(255,0,0,0.8) 0 5px 5px)';
                  }
              }
              });
        }
}




/***********************************
 *** Israel Hayom Video handling ***
 ***********************************/
function vlcIsraelAppModifyVidLinks(vidsArray, markVids)
{
    if (!markVids) {
        return;
    }
    var vidsCount = 0;
    var v = document.getElementsByTagName('a');
    for (var i=0; i<v.length; i++) {
        var video = v[i];
        if (video.getAttribute('vlc')) {
            //continue;
            setListeners = 0;
        }
        var s1=video.href;
        if ((s1.indexOf('127.0.0.1:8080')==-1)&&
           (s1.indexOf("get_hls_direct.php?video_id=")!=-1)){
            if (searchStringInArray (s1, vidsArray)!=-1) {
                var vext = "mp4";
                if (s1.indexOf('m3u8') != -1) {
                    vext="m3u8";
                }
                var s2='http://127.0.0.1:8080/v.'+vext+'?url='+s1;
                video.setAttribute('src',s2);
                video.setAttribute('vlc', 1);
                video.parentElement.style.boxShadow = "10px 10px 10px blue";
            } else {
                video.setAttribute('vlc', 0);
                video.parentElement.style.boxShadow = "10px 10px 10px red";
            }
            vidsCount++;
        }
        if (vidsCount > 5) {
            //Limit to 5 html5 videos per page to avoid memory issues
            break;
        }
    }
    return vidsCount.toString();
}

/*******************************************************
 *** Israel Hayom Video handling - Brightcove Player ***
 *******************************************************/
function vlcIsraelAppModifyVidLinksBr(vidsArray, markVids)
{
    console.log('*** vlcIsraelAppModifyVidLinksBr ***'+' vids:'+vidsArray);
    var markVids = true;
    if (!markVids) {
        markVids = false;
    }
    var vidsCount = 0;
    var setListeners;
    var inCache = 0;
    var v = document.getElementsByClassName("BrightcoveExperience");
    console.log('starting BR loop');
    for (var i=0; i<v.length; i++) {
        var video = v[i];
        console.log('video:'+video.src);
        if (video.getAttribute('vlc_handlers')) {
            //continue;
            console.log('set listeners: 0');
            setListeners = 0;
        } else {
            setListeners = 1;
        }
        var s1=video.src;
        if ((s1.indexOf('127.0.0.1:8080')==-1)&&
            (s1.indexOf("htmlFederated")!=-1)&&(setListeners==1)){
            console.log('handle video');
            var qparams = getUrlQueryParams(s1);
            var videoPlayer = qparams['%40videoPlayer'];
            var playerID = qparams['playerID'];
            var vidParams = "videoId="+videoPlayer+"&playerId="+playerID;
            console.log('lookup vid params:'+vidParams);
            if (searchStringInArrayItems (vidParams, vidsArray)!=-1) {
                video.setAttribute('vlc', 1);
                inCache = 1;
                if (markVids) {
                    video.parentElement.style.webkitFilter = 'drop-shadow(rgba(0,0,255,0.8) 0 5px 5px)';
                }
            } else {
                video.setAttribute('vlc', 0);
                inCache = 0;
                if (markVids) {
                    video.parentElement.style.webkitFilter = 'drop-shadow(rgba(255,0,55,0.5) 0 5px 5px)';
                }
            }
            //Set listeners
            console.log("*** Register brightcove player listeners for id:"+video.id);
            var expId = video.id;
            vlcRegisterBRHandlersLoop(expId, video, playerID, inCache);
            vidsCount++;
        } else {
            console.log('will not handle video');
        }
        if (vidsCount > 5) {
            //Limit to 5 html5 videos per page to avoid memory issues
            break;
        }
    }
    return vidsCount.toString();
}

var vlcBRRetryes = 0;

function vlcRegisterBRHandlersLoop(expId, video, playerID, inCache) {
    if (brightcove.api==null) {
        return;
    }
    var res = vlcRegisterBRHandlers(expId, video, playerID, inCache);
    if ((!res)&&(vlcBRRetryes<6)) {
        console.log('null player schedule retry');
        setTimeout(vlcRegisterBRHandlers(expId, video, playerID, inCache), 300);
        vlcBRRetryes ++;
    }
}


function vlcRegisterBRHandlers(expId, video, playerID, inCache) {
    console.log('starting vlcRegisterBRHandlers video:'+video);
    if (video.getAttribute('vlc_handlers')) {
        return true;
    }
    var vbplayer = brightcove.api.getExperience(expId);
    if (vbplayer == null) {
        return false;
    }
    console.log("got player:"+vbplayer.id);
    var modVP = vbplayer.getModule(brightcove.api.modules.APIModules.VIDEO_PLAYER);
    console.log("got modVP:"+modVP.experience.id);
    modVP.addEventListener(brightcove.api.events.MediaEvent.BEGIN, function(event) {console.log('begin')});
    modVP.addEventListener(brightcove.api.events.MediaEvent.BUFFER_BEGIN, function(event) {console.log('BUFFER_BEGIN'); vlcHandleBREvent(event);});
    modVP.addEventListener(brightcove.api.events.MediaEvent.PLAY, function(event) {
                           console.log('PLAY');
                           vlcHandleBREvent(event, playerID, inCache);
                           });
    modVP.addEventListener(brightcove.api.events.MediaEvent.STOP, function(event) {
                           console.log('STOP');
                           vlcHandleBREvent(event, playerID, inCache);
                           });
    video.setAttribute('vlc_handlers', 1);
    return true;
}

function onTemplateReady(event) {
    console.log("on Template Ready");
}

//Temporary remove after testing
var brEvent;

function vlcHandleBREvent (event, playerID, inCache) {
    brEvent = event;
    console.log("Got BR Event:"+event.type);
    console.log("PlayerID:"+playerID);
    if (event.type == "mediaPlay") {
        console.log("Play started. report to app:"+event.media.defaultURL);
        var pubId = event.media.publisherID;
        var videoUrl = event.media.defaultURL+"&playerId="+playerID+"&lineupId=&affiliateId=&pubId="+pubId;
        console.log("Full Video URL:"+videoUrl);
        logObjC("BR Play started:"+videoUrl);
        callObjCEx('video_started', videoUrl, inCache);
    }
    else if (event.type == "mediaStop") {
        console.log("Play stopped. report to app:"+event.media.defaultURL);
        var pubId = event.media.publisherID;
        var videoUrl = event.media.defaultURL+"&playerId="+playerID+"&lineupId=&affiliateId=&pubId="+pubId;
        console.log("Full Video URL:"+videoUrl);
        logObjC("BR Play started:"+videoUrl);
        callObjCEx('video_ended', videoUrl, inCache);
    }
}

function getWallaAppVideoLinks() {
    var x=0,y=0,z;
    while (x != -1) {
        x = document.body.innerHTML.indexOf("walla://playvideo?itemID=",y);
        if (x != -1) {
            y = document.body.innerHTML.indexOf("\"",x+25);
            callObjCEx('walla_app_video_url', vids.push(document.body.innerHTML.slice(x+25,y)), 0);
        }
    }
}



function onVideoBeginsFullScreen() {
    //alert(vid_url);
    //document.location.href="http://vlc_event/?video-started="+vid_url;
    console.log('onVideoBeginsFullScreen:');
    this.play();
    
    var src = this.src;
    if (this.src.length == 0) {
        src = this.currentSrc;
    }
    var rurl = getUrlToReport(src);
    var cached = 0;
    if (src.indexOf('127.0.0.1')>-1){
        cached = 1;
    }
    callObjCEx('video_started', rurl, cached);
}

/* HTML5 Video ended full screen */
function onVideoEndsFullScreen() {
    //document.location.href="vlc_event://video-ended";
    var src = this.src;
    if (this.src.length == 0) {
        src = this.currentSrc;
    }
    var rurl = getUrlToReport(src);
    var cached = 0;
    if (src.indexOf('127.0.0.1')>-1){
        cached = 1;
    }
    callObjCEx('video_ended', rurl, cached);
}


/**************************************
 *** YouTube Embeded Video handling ***
 **************************************/

var vlcCountYtEmbedVids = 0;
var vlcYTApiLoaded = 0;
var player;
var currentYTPlayer = null;
var currentYTUrl = null;

function modifyYTEmbedLinksFromList(vidsArray, markVids) {
    //console.log('modifyYTEmbedLinksFromList');
    var count = 0;
    var modifyedCount = 0;
    setListeners = 0;
    var cachedCount = 0;
    loadYTApi();
    var iframes = document.getElementsByTagName('iframe');
    for (var i=0; i<iframes.length; i++) {
        isCached = 0;
        frame = iframes[i];
        if (frame.getAttribute('vlc')) {
            //continue;
            setListeners = 0;
            continue;
        }
        s1 = frame.src;
        if (s1.indexOf('youtube.com/embed/') > -1) {
            //ytEmbedFrame = frame;
            //frame.document.addEventListener('click', function(event) {yFrameClic(this.id);}, false);
            if (searchStringInArray (s1, vidsArray)!=-1) {
                //console.log("Found cached YT Embed");
                if (cachedCount >5) {
                    if (markVids) {
                        frame.style.webkitFilter = 'drop-shadow(rgba(255,0,0,0.8) 0 5px 5px)';
                    }
                    //console.log("YT cached count>5");
                }
                else {
                    cachedCount++;
                    isCached = 1;
                    //continue;
                    //blue shadow
                    //console.log("set yt shadow");
                    if (markVids) {
                        frame.style.webkitFilter = 'drop-shadow(rgba(0,0,255,0.8) 0 5px 5px)';
                    }
                }
            }
            else {
                if (markVids) {
                    frame.style.webkitFilter = 'drop-shadow(rgba(255,0,0,0.8) 0 5px 5px)';
                }
            }

            frame.setAttribute('id', 'vid'+vlcCountYtEmbedVids);
            if (s1.indexOf('enablejsapi=1')==-1){
                if (s1.indexOf('?')==-1) {
                    frame.src=s1+'?enablejsapi=1';
                } else {
                    frame.src = s1+'&enablejsapi=1'
                }
                
                vlcCountYtEmbedVids++;
            }
            count++;
            frame.setAttribute('vlc',isCached);
            modifyedCount++;
            continue;
        }
    }
    if (count > 0) {
        console.log('Modifyed YT Embed frames:'+count);
        logObjC('Modifyed YT Embed frames:'+count);
    }
    return count.toString();
}

function onYouTubeIframeAPIReady() {
    console.log('onYouTubeIframeAPIReady called  (IFRAME)');
    logObjC('onYouTubeIframeAPIReady called  (IFRAME)');
    for (var i=0; i<vlcCountYtEmbedVids;i++) {
        player = new YT.Player('vid'+i, {
                               events: {
                               'onReady': onPlayerReady,
                               'onStateChange': onPlayerStateChange
                               }
        });
    }
}


function onYouTubePlayerAPIReady() {
    console.log('onYouTubePlayerAPIReady called');
    logObjC('onYouTubePlayerAPIReady called');
    for (var i=0; i<vlcCountYtEmbedVids;i++) {
        player = new YT.Player('vid'+i, {
                           events: {
                           'onReady': onPlayerReady,
                           'onStateChange': onPlayerStateChange
                           }
                           });
    }
}

//Youtube api event handlers
function onPlayerReady(event) {
    
    console.log('onPlayerReady:'+event.data);
    //event.target.playVideo();
}


function getCleanYouTubeUrl(url) {
    var x = url.lastIndexOf('enablejsapi=');
    if (x == -1)
        return url;
    return url.substring(0, x-1);
}


function onPlayerStateChange(event) {
    var lplayer = event.target;
    //if (lplayer.url == currentYTPlayer.url){
    //    cachedVid = false;
    //}
    currentYTPlayer = lplayer;
    var url = getCleanYouTubeUrl(lplayer.getVideoUrl());
    var embedCode = lplayer.getVideoEmbedCode();
    var iframe = lplayer.getIframe();
    var cachedVid = iframe.getAttribute('vlc')=='1';
    var cachedFlag = 0;
    if (cachedVid) {
        cachedFlag  = 1;
    }
    currentYTUrl = iframe.src;
    logObjC('onPlayerStateChange:'+event.data+"url:"+url+"embed:"+embedCode);
    console.log('onPlayerStateChange:'+event.data);
    if (event.data == YT.PlayerState.PLAYING){
        console.log('PLAYING');
        logObjC('PLAYING');
        callObjCEx('yt_video_started', url, cachedFlag);
    }
    else if (event.data == YT.PlayerState.ENDED){
        console.log('ENDED');
        logObjC('ENDED');
        callObjCEx('yt_video_ended', url, cachedFlag);
    }
    else if (event.data == YT.PlayerState.PAUSED){
        console.log('PAUSED');
        logObjC('PAUSED');
        callObjCEx('yt_video_ended',url, cachedFlag);
    }
    else if (event.data == YT.PlayerState.BUFFERING) {
        console.log('BUFFERING');
        logObjC('BUFFERING');
        //playYTFromCache(lplayer);
    }
    else if (event.data == YT.PlayerState.CUED){
        console.log('CUED'); //Ready to play
        logObjC('CUED');
    }
    else if (event.data == YT.PlayerState.UNSTARTED){
        console.log('UNSTARTED'); //Ready to play
        logObjC('UNSTARTED');
        //Test
        if ((currentYTPlayer)&&(cachedVid)) {
            playYTFromCache(lplayer);
        }
    }
    //if (event.data == YT.PlayerState.PLAYING && !done) {
    //    setTimeout(stopVideo, 6000);
    //    done = true;
    //}
}

function playYTFromCache(lplayer) {
    //lplayer.clearVideo();
    //iframe.src="";
    //iframe.src=url;
    //currentYTUrl = lplayer.getVideoUrl();
    console.log("set currentYTUrl:"+currentYTUrl);
    lplayer.pauseVideo();
    //lplayer.stopVideo();
    //setTimeout(function(){lplayer.cueVideoByUrl(url,0,0)}, 1000);
    //newUrl = getProxyUrl("http://www.youtube.com/embed/98GpBkYidGw");
    var anewUrl = getProxyUrl(currentYTUrl);
    playVideoWitUrl(anewUrl);
}

function loadYTApi() {
    console.log('loadYTApi');
    if (vlcYTApiLoaded > 0){
        //console.log("Vlc YT Api already loaded");
        return;
    }
    //Load the YouTube api
    // Inject YouTube API script
    if (document.getElementById('player')==null) {
        console.log('Create YT player div');
        var pdiv = document.createElement('div');
        pdiv.id = 'player';
    } else {
        console.log('player dive already exist');
    }
    var tag = document.createElement('script');
    tag.src = "//www.youtube.com/player_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    vlcYTApiLoaded++;
}

function yFrameClic(fid) {
    console.log("detected iframe click");
    logObjC("detected iframe click");
}

function yFrameLoad(frame) {
    console.log("detected iframe load");
    logObjC("detected iframe load");
}

/*
function handleYTEmbedCachedVideo(frame) {
    return false;
    //frame.onLoad = yFrameLoad(frame);
    //return true;
    //logObjC("Found YT Cached Video");
    //frame.document.addEventListener('click', function(event) {yFrameClic(this.id);}, false);
    s1 = frame.src;
    if (s1.indexOf('127.0.0.1:8080')==-1) {
        s2='http://127.0.0.1:8080/?url='+s1;
        iframes[i].setAttribute('src',s2);
    }
}
*/

/*
 function onYouTubePlayerAPIReady() {
 console.log('onYouTubePlayerAPIReady called');
 logObjC('onYouTubePlayerAPIReady called');
 for (var i=0; i<vlcCountYtEmbedVids;i++) {
 player = new YT.Player('vid'+i, {
 events: {
 'onReady': function(event){console.log('onPlayerReady:'+event.data);},
 'onStateChange': function(event) {
 logObjC('onPlayerStateChange:'+event.data);
 console.log('onPlayerStateChange:'+event.data);
 
 if (event.data == YT.PlayerState.PLAYING && !done) {
 setTimeout(stopVideo, 6000);
 done = true;
 }
 }
 }
 });
 }
 }
 */

// Find all youtube embed frames
// src="//www.youtube.com/embed/kaJDyvLVj4Q

/*
 function modifyYTEmbedLinksFromList_Old(vidsArray) {
 count = 0;
 setListeners = 0;
 
 var iframes = document.getElementsByTagName('iframe');
 for (var i=0; i<iframes.length; i++) {
 frame = iframes[i];
 if (frame.getAttribute('vlc')) {
 //continue;
 setListeners = 0;
 }
 s1 = frame.src;
 if (s1.indexOf('youtube.com/embed/') > -1) {
 ytEmbedFrame = frame;
 continue;
 //Youtube frame
 if (s1.indexOf('127.0.0.1:8080')==-1) {
 s2='http://127.0.0.1:8080/?url='+s1;
 iframes[i].setAttribute('src',s2);
 //Alert('YT Embed:'+s2);
 count++;
 }
 if (setListeners) {
 //+frame.webkitIsFullScreen()
 frame.onwebkitfullscreenchange(console.log("webkit fullscreen change:"));
 frame.addEventListener('webkitbeginfullscreen', function(){onVideoBeginsFullScreen(s1);}, false);
 frame.addEventListener('webkitendfullscreen', function(){onVideoEndsFullScreen(s1);}, false);
 }
 }
 }
 return count.toString();
 }
 */

/******************************
 *** Velocee Player element ***
 ******************************/

function addVlcPlayer() {
    if ((document.getElementById('vlcPlayer') == null)&&(typeof(vlcPlayer)!='object')) {
        logObjC("Type returned:"+typeof(vlcPlayer));
        logObjC("Create vlc player");
        console.log('Get vlcPlayer returns:'+document.getElementById('vlcPlayer'));
        console.log('create vlc player');
        vlcPlayer = document.createElement("video");
        vlcPlayer.id = "vlcPlayer";
        vlcPlayer.setAttribute('controls','');
        vlcPlayer.setAttribute('autoplay','');
        vlcPlayer.addEventListener('ended', endVideo);
        vlcPlayer.addEventListener('pause', pauseVideo);
        vlcPlayer.hidden=true;
        document.body.appendChild(vlcPlayer);
        if (true) {//onVlcVideoBeginsFullScreen
            vlcPlayer.addEventListener('webkitbeginfullscreen', onVlcVideoBeginsFullScreen, false);
            vlcPlayer.addEventListener('webkitendfullscreen', onVlcVideoEndsFullScreen, false);
        }
        //vlcPlayer.hidden=false;
        console.log('vlc player created');
    }
}

//TODO: Send player events to app to collect stats
function playVid(){
    vlcPlayer.hidden=false;
    if (vlcPlayer.src == this.href) {
        console.log('resume video:'+this.href);
        vlcPlayer.play();
        return false;
    }
    console.log('play video:'+this.href);
    vlcPlayer.src=this.href;
    vlcPlayer.play();
    //event.preventDefault();
    return false;
}

function playVideoWitUrl(vurl){
    console.log('playVideoWitUrl:'+vurl);
    vlcPlayer.hidden=false;
    if (vlcPlayer.src == vurl) {
        console.log('resume video:'+vurl);
        vlcPlayer.play();
        return false;
    }
    console.log('play video:'+vurl);
    vlcPlayer.src=vurl;
    vlcPlayer.play();
    //event.preventDefault();
    return false;
}

function endVideo() {
    console.log("video ended:"+this.src);
    vlcPlayer.hidden=true;
}

function pauseVideo() {
    console.log('video paused:'+this.src);
    var video = vlcPlayer;
    if (!video.webkitDisplayingFullscreen) {
        console.log("Not in full screen. Ending video");
        endVideo();
    }
}

function onVlcVideoBeginsFullScreen() {
    //alert(vid_url);
    //document.location.href="http://vlc_event/?video-started="+vid_url;
    console.log('onVlcVideoBeginsFullScreen:');
    var rurl = getUrlToReport(this.src);
    //cached = this.getAttribute('vlc');
    var cached = 0;
    if (this.src.indexOf('127.0.0.1')>-1){
        cached = 1;
    }
    callObjCEx('video_started', getCleanYouTubeUrl(rurl), cached);
}

function onVlcVideoEndsFullScreen() {
    //document.location.href="vlc_event://video-ended";
    vlcPlayer.hidden=true;
    var rurl = getUrlToReport(this.src);
    //cached = this.getAttribute('vlc');
    var cached = 0;
    if (this.src.indexOf('127.0.0.1')>-1){
        cached = 1;
    }
    callObjCEx('video_ended', getCleanYouTubeUrl(rurl), cached);
    if (currentYTPlayer){
        console.log("onVlcVideoEndsFullScreen YT State:"+YT.PlayerState);
        if (currentYTPlayer.getPlayerState() != YT.PlayerState.CUED) {
            console.log("Cue Video:"+currentYTUrl);
            currentYTPlayer.cueVideoByUrl(currentYTUrl, 0, 0);
        }
    }
}

function getUrlToReport(url) {
    if (url.indexOf('127.0.0.1')>-1) {
        var params = getUrlQueryParams(url);
        return params['url'];
    }
    return url;
}

//


/*******************************
 *** Ynet App Links Link Bg ***
 *******************************/
function markYnetAppVideoLinks(vidsArray, markVids) {
    if (!markVids) {
        return;
    }
    console.log("modify Ynet App Links");
    var links = document.links;
    var count = 0;
    var cached = 0;
    var cachedCount = 0;
    for(var i = 0; i< links.length; i++){
        cached = 0;
        var video = links[i];
        var s1 = links[i].href;
        if (s1.indexOf('www.ynet.co.il/video?')>-1) {
            console.log("Ynet video:"+s1);
            if (video.getAttribute('vlc')) {
                console.log("Found vlc flag");
                count++;
                continue;
            }
            if (s1.indexOf('127.0.0.1:8080')>-1) {
                links[i].style.webkitFilter = 'drop-shadow(rgba(0,0,255,0.8) 0 5px 5px)';
                count++;
                continue;
            }
            count++;
            //console.log('found video link:'+s1);
            if (searchStringInArray (s1, vidsArray)!=-1) {
                console.log("Found cached Ynet App Video");
                cached = 1;
                cachedCount++;
                count++;
                links[i].style.webkitFilter = 'drop-shadow(rgba(0,0,255,0.8) 0 5px 5px)';
                continue;
            }
            else
                video.style.webkitFilter = 'drop-shadow(rgba(255,0,55,0.5) 0 5px 5px)';
        }
    }
    console.log("modify Ynet App Links changed:"+count.toString());
    return cachedCount.toString();
}



/*************************
 *** Utility functions ***
 *************************/

//Get url query parameters array
//getUrlQueryParams('http://www.test.com?url=http://www.velocee.com'&p1=1);
function getUrlQueryParams(aurl) {
    var vars = {};
    var parts = aurl.replace(/[?&]+([^=&]+)=([^&]*)/gi,
                                             function(m,key,value) {
                                             vars[key] = value;
                                             });
    return vars;
}

function getProxyUrl(aurl){
    if (aurl.indexOf('127.0.0.1:8080')==-1) {
        s2='http://127.0.0.1:8080/?url='+aurl;
        return s2;
    }
    return aurl;
}


function searchStringInArray (str, strArray) {
    console.log("searching:");
    console.log("==> "+JSON.stringify(str));
    console.log("<== "+strArray);
    for (var j=0; j<strArray.length; j++) {
        //if (strArray[j].match(str)) return j;
        if (str.indexOf(strArray[j])!=-1) {
            return j;
        }
    }
    return -1;
}


function searchStringInArrayItems (str, strArray) {
    for (var j=0; j<strArray.length; j++) {
        //if (strArray[j].match(str)) return j;
        var item = strArray[j];
        if (item.indexOf(str)!=-1) {
            return j;
        }
    }
    return -1;
}

function callObjC(eventName, qparam) {
    var iframe = document.createElement("IFRAME");
    iframe.setAttribute("src", "vlc-js-frame://"+eventName+"/?"+"p="+qparam);
    document.documentElement.appendChild(iframe);
    iframe.parentNode.removeChild(iframe);
    iframe = null;
}

function callObjCEx(eventName, qparam1,qparam2) {
    var iframe = document.createElement("IFRAME");
    iframe.setAttribute("src", "vlc-js-frame://"+eventName+"/?"+"p="+qparam1+"&c="+qparam2);
    document.documentElement.appendChild(iframe);
    iframe.parentNode.removeChild(iframe);
    iframe = null;
}

function logObjC(text) {
    var iframe = document.createElement("IFRAME");
    iframe.setAttribute("src", "vlc-js-frame://"+"log"+"/?"+"p="+text);
    document.documentElement.appendChild(iframe);
    iframe.parentNode.removeChild(iframe);
    iframe = null;
}

/******************************
 *** Add Blocking functions ***
 ******************************/

function skipMaavaron()
{
    //var adPages=new Array();
    //adPages[0]='http://m.ynet.co.il/Maavaron.aspx'; skipPages[1]='http://m.ynet.co.il/MaavaronP.aspx';
    if (adPages.indexOf(window.location.href)>-1) {
        //alert("Skipped Maavaron");
        setTimeout_Banner();
    }
}

function preventMaavaron()
{
    if (adPages.indexOf(window.location.href)>-1) {
        //alert("preventMaavaron");
        vlcSetTimeoutMaavaron();
    }
}

function disable_maavaron()
{
    if (window.localStorage) {
        try {
            localStorage.setItem("lastvisitMobile7", '15');
            /* alert('loca lstorage set'); */
        } catch (ex) {
            /* storage size limit reached probably */
        }
    }
}

function disable_article_maavaron()
{
    var jsonO = new Object();
    jsonO.mainflag = 1;
    //jsonO.redirectURL = window.location.href;
    jsonO.secondFlag = 0;
    jsonO.secondTime = '12/23/2012 10:40:28';
    sessionStorage["offportal_aspx_data"] = JSON.stringify(jsonO);
}

function vlcSetTimeoutMaavaron()
{
    //alert(3);
    lastvisit = sessionStorage["offportal_aspx_data"];
    var o = JSON.parse(sessionStorage["offportal_aspx_data"]);
    window.location = o.redirectURL;
}

function blockZuznowPopup()
{
    if (typeof(ZuznowHideSplashBanner)=='function') {
        ZuznowHideSplashBanner();
    }
}

function vlcModifyTestVideos(vidsArray, markVids) {
    var c = 0, setListeners = 1;
    if (!markVids) {
        return c;
    }
    var v = document.querySelectorAll(".test_website_video video");
    for (var q=0;q<v.length;q++) {
        var s = v[q].currentSrc;
        if (v[q].getAttribute('vlc')) {
            setListeners = 0;
        }
        if (s.indexOf('127.0.0.1:8080')==-1) {
            if (setListeners) {
                v[q].addEventListener('webkitbeginfullscreen', onVideoBeginsFullScreen, false);
                v[q].addEventListener('webkitendfullscreen', onVideoEndsFullScreen, false);
            }
            if (searchStringInArray (s, vidsArray)!=-1) {
                v[q].style.boxShadow="3px 3px 2px rgb(0,0,225)";
                v[q].style.border="1px solid blue";
            }
            else {
                v[q].style.boxShadow="3px 3px 2px rgb(225,0,0)";
                v[q].style.border="1px solid red";
            }
            v[q].setAttribute('vlc', 1);
            c++;
        }
        else {
            v[q].style.boxShadow="3px 3px 2px rgb(0,0,225)";
            v[q].style.border="1px solid blue";
        }
    }
    return c;
}


/*
 currentVid.addEventListener('webkitendfullscreen', function(){
 callObjC('yt_video_ended', watchUrl);
if (video.getAttribute('vlc')) {
    //continue;
    setListeners = 0;
}
s1=video.getAttribute('src');
if (s1.indexOf('127.0.0.1:8080')==-1) {
    //Add event listener
    //video.addEventListener('webkitbeginfullscreen', onVideoBeginsFullScreen, false);
    if (setListeners) {
        video.addEventListener('webkitbeginfullscreen', function(){onVideoBeginsFullScreen(s1);}, false);
        video.addEventListener('webkitendfullscreen', function(){onVideoEndsFullScreen(s1);}, false);
    }
    if (searchStringInArray (s1, vidsArray)!=-1) {
        s2='http://127.0.0.1:8080/v.mp4?url='+s1;
        video.setAttribute('src',s2);
        video.setAttribute('vlc', 1);
        video.load();
        count++;
        vidsCount++;
    } else {
        video.setAttribute('vlc', 0);
    }
} else {
    vidsCount++;
}
if (vidsCount > 5) {
    //Limit to 5 html5 videos per page to avoid memory issues
    break;
}
*/
