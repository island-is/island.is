package is.island.app;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import android.content.pm.PackageManager;
import android.content.pm.PackageInfo;
import android.content.pm.ApplicationInfo;
import java.util.Map;
import java.util.HashMap;

public class IslandModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;

  IslandModule(ReactApplicationContext context) {
    super(context);
    this.reactContext = context;
  }

  @Override
  public String getName() {
    return "IslandModule";
  }

  @ReactMethod
  public void getAppVersion(String packageName, Callback cb) {
    try {
      PackageInfo pInfo = this.reactContext.getPackageManager().getPackageInfo(packageName, 0);
      cb.invoke(pInfo.versionName);
    } catch (PackageManager.NameNotFoundException e) {
      cb.invoke(false);
    }
  }

}
