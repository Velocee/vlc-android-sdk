SDK Integration
===============

Project Integration
-------------------
The descriptions below include details and elaboration from the Quick Start section above.
Download vlc-android-sdk as a zip file and extract it. Import the veloceeSDK_lib & veloceeSDK_UI_lib folder to the project (Import > Existing projects into workspace for Eclipse users or File > New > Import module for Android Studio)
Update library dependency for the project (Project properties > Android > Add library for eclipse users or Main module settings > Dependencies > Add library for Android Studio)


The SDK uses the following third party libraries 
GSON
https://sites.google.com/site/gson/gson-user-guide
JS
https://developer.mozilla.org/en-US/docs/Mozilla/Projects/Rhino
OkHTTP
http://square.github.io/okhttp/
Retrofit
http://square.github.io/retrofit/

Code Integration
----------------
Usage
Get the sdk instance by calling VlcSdk.getObj() which returns an IVlcSDK inteface
Initializing
The library requires a one time initialization upon application startup. You should call the method VlcSdk.getObj().start preferably in your application.onCreate() method
VlcSdk.getObj().start(getApplicationContext(),"sdk-key");

Using Within a WebView
----------------------
The Velocee SDK provides a WebView delegate for the application’s WebView to use. In order to use Velocee’s WebView delegate you should use the SDK’s setDelegate method instead of the web view one. In case the application has a webview delegate it will be chained.
WebViewClient vlcClient = VlcSdk.getObj().setDelegate(new MyWebViewClient());
myWebView.setWebViewClient(vlcClient);

Getting Cached Videos From Within a Different View
--------------------------------------------------
In order to use Velocee’s cache from non-webview view the application must change the relevant video urls to serve the content locally. The SDK provides several conversion methods for convenience:
 String getCachedResourceUrl(String originalUrl) receives the URL (as string) and returns the resource-from-cache URL.
URL getCachedResourceUrlUrl(URL originalUrl)
is similar to the above but receives and returns a URL instead of string. Both methods returns the input unchanged in case the input URL cannot be found in the cache.

Add Labels
----------
Your application data needs to be labeled in order to fine tune Velocee's recommendation algorithm. Any text can be used as a label. In order to set the current label use the setTag method – void setTag(String tag) tag. Once a label is set it affects all resources until a new label is set or the application is idle for a period of time.

Audio+ Integration
------------------
The Velocee Audio+ module plays user adapted audio content to the user.
In order to use the Audio+ module the application might include an audio player UI for the Audio+ module.

Get the Audio+ instance by calling VlcSDK.getMediaPlayerObj()
returning an IVlcMediaPlayerSDK interface
In order to be notified when a new playlist is dowloaded (so it may be played), call registerPlaybackEvents(IPlaybackEvents rcv)
supplying an instance implementing OnPlaylistLoaded(List<String> trackNames)

When the event fires, play() may be called in order for the playlist to start playing sequentially

inorder to allow control of the media player with external devices (like wireless headset / other bluetooth device)
add the following to the main manifest.xml within the <application> tag
<receiver android:name="com.velocee.sdk.VlcMediaController">
    <intent-filter>
        <action android:name="android.intent.action.MEDIA_BUTTON" />
    </intent-filter>
</receiver>

Interfaces
----------
IVlcPlaybackEvents interface definition of callback invoked when the player loads a new playlist or a new media file started playing. use audioRegisterPlaybackEvents/audioUnregisterPlaybackEvents methods to register for playback notifications

void OnTrackStart(String title, String author, int lengthInMillis)
A new media track has started playing
void OnPlaylistLoaded(List<String> trackNames)
A new playlist has downloaded listing its track titles

Public methods
----------
void startAudio()
Opens a sample Velocee branded audio player activity

void audioPlay()
Starts / resumes playback

void audioPrev()
Starts playback of the previous track in the playlist

void audioNext()
Starts playback of the next track in the playlist

void audioPause()
Pauses playback

void audioPlayAtIndex(int index)
Starts playback of a specific track 


boolean audioRegisterPlaybackEvents(IVlcPlaybackEvents rcv)
void     audioUnregisterPlaybackEvents(IVlcPlaybackEvents rcv)
methods for (un)registering for playback events

void audioReleasePlayer()
Releases resources associated with media player object

boolean      audioIsPlaying()
Checks whether the media player is playing

int     audioGetProgress()
Gets the current playback position in millisecods


VlcMediaInfo  audioGetMediaInfo()
returns track information. also see VlcMediaInfo definition

internal Classes
----------------
VlcMediaInfo basic track information
String mTitle track title
String mAuthor track author
int mLengthInMillis track duration in milliseconds
String mPlaylistUrl track’s played is part of the given playlist URL