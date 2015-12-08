Android SDK installation 

The SDK is bundles as an Android library project.

Depending on the development environment import the the project into the workspace;
Eclipse
use ‘Import > Existing projects into workspace’
Select the SDK project folder (it is recommended to use a ‘copy project’ option if available)
In the main project of the workspace add the SDK library dependency, go to the project properties tab > Android > Select ‘Add..’ in the libraries section and choose the imported library


Android studio
use ‘File > New > Import module’ & select the SDK project folder


Third party libraries
The SDK uses the following 3rd party libraries
GSON - https://sites.google.com/site/gson/gson-user-guide
JS - https://developer.mozilla.org/en-US/docs/Mozilla/Projects/Rhino
OkHTTP - http://square.github.io/okhttp/
Retrofit - http://square.github.io/retrofit/

They are bundled with the SDK itself

Post installation
Add the following permissions to the main manifest.xml of your application

<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

Within the <application> tag add the following <service> tag
<service android:name="com.velocee.sdk.VeloceeSDKService" />​



Usage

Get the SDK instance by calling VlcSDK.getObj() which returns a singleton, all API methods are called using this object and are declared in IVlcSDK interface;

public interface IVlcSDK {

	public void start(Context acontext, String key);
	public void start(Context acontext, String key, String locale);
	public WebViewClient setDelegate(WebViewClient client);
	public void setDelegateAd(Object adView);
	public String getCachedResourceUrl(String originalUrl);
	public URL getCachedResourceUrlUrl(URL originalUrl);
	public void setLocale(String locale);
	public void setTag(String tag);
}

Initializing

The SDK requires a one time initialization upon application startup.
Call the start method, preferably on your designated application object or on the startup activity of your application passing your application context and an SDK Key provided for your application by Velocee.

Labeling The Data

Your application data needs to be labeled in order to fine tune Velocee's recommendation algorithm. Any text can be used as a label. 
In order to set the current label use the setTag method. Once a label is set it affects all resources until a new label is set or the application is idle for a period of time.

Using Within a WebView

The Velocee SDK provides a WebViewClient for the application’s WebView to use. 
In order to use Velocee’s WebViewClient you should use the SDK’s setDelegate method instead of the web view one. In case the application has a webview delegate it will be chained.

WebViewClient sdkClient = VlcSDK.getObj().setDelegate(new MyApplicationWebViewClient());
webView.setWebViewClient(sdkClient);


Getting Cached Videos From Within a Different View

In order to use Velocee’s cache from non-webview Activity the application must change the relevant video urls to serve the content locally. The SDK provides several conversion methods for convenience:

public String getCachedResourceUrl(String originalUrl)
receives the URL (as String) and returns the resource-from-cache URL.

public URL getCachedResourceUrlUrl(URL originalUrl)
is similar to the above but receives and returns a NSURL instead of NSString. Both methods returns the input unchanged in case the input URL cannot be found in the cache.

