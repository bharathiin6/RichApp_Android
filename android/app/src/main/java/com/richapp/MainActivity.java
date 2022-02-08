package com.richmarket.app;

import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen; // here 
import android.os.Bundle;
import android.content.Intent; // <--- import 
import android.content.res.Configuration;


public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */

  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this);  // here 
    super.onCreate(savedInstanceState);
}
@Override
      public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        Intent intent = new Intent("onConfigurationChanged");
        intent.putExtra("newConfig", newConfig);
        this.sendBroadcast(intent);
    }
  @Override
   
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
    }
    @Override
  protected String getMainComponentName() {
    return "RichApp";
  }
 
}
