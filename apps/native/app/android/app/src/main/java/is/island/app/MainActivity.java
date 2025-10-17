package is.island.app;
import expo.modules.ReactActivityDelegateWrapper;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

import com.reactnativenavigation.NavigationActivity;

import android.os.Bundle;
import android.view.View;
import androidx.core.view.WindowCompat;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.graphics.Insets;

public class MainActivity extends NavigationActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  // @Override
  // protected String getMainComponentName() {
  //   return "IslandApp";
  // }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
   * (aka React 18) with two boolean flags.
   */
//   @Override
//   protected ReactActivityDelegate createReactActivityDelegate() {
//     return new ReactActivityDelegateWrapper(this, BuildConfig.IS_NEW_ARCHITECTURE_ENABLED, new DefaultReactActivityDelegate(
//         this,
//         getMainComponentName(),
//         // If you opted-in for the New Architecture, we enable the Fabric Renderer.
//         DefaultNewArchitectureEntryPoint.getFabricEnabled(), // fabricEnabled
//         // If you opted-in for the New Architecture, we enable Concurrent React (i.e. React 18).
//         DefaultNewArchitectureEntryPoint.getConcurrentReactEnabled() // concurrentRootEnabled
//         ));
//   }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    // Enable edge-to-edge for older AndroidX versions using decorFits=false.
    // We'll handle overlaps via insets below.
    WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
    super.onCreate(savedInstanceState);

    // Apply bottom padding equal to system navigation bar size (covers 3-button nav).
    // Reference: Android edge-to-edge guidance
    // https://developer.android.com/develop/ui/views/layout/edge-to-edge#java
    final View content = findViewById(android.R.id.content);
    if (content != null) {
      ViewCompat.setOnApplyWindowInsetsListener(content, (v, insets) -> {
        Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
        v.setPadding(v.getPaddingLeft(), v.getPaddingTop(), v.getPaddingRight(), systemBars.bottom);
        return insets;
      });
      // Request initial insets dispatch so the listener runs immediately
      ViewCompat.requestApplyInsets(content);
    }
  }
}
