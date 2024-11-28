package is.island.app;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.JSApplicationCausedNativeException;
import android.content.pm.PackageManager;
import android.content.pm.PackageInfo;
import android.content.pm.ApplicationInfo;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.util.Base64;
import androidx.core.content.FileProvider;
import java.util.Map;
import java.util.HashMap;
import java.io.File;
import java.io.FileOutputStream;
import java.util.UUID;

public class IslandModule extends ReactContextBaseJavaModule {
	private final String PKPASS_TYPE = "application/vnd.apple.pkpass";
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

	private Intent intentWithContentUri(Uri uri, String type) {
		return new Intent(Intent.ACTION_VIEW)
			.setDataAndType(uri, type)
			.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
			.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
	}

	@ReactMethod
	public void canAddPasses(Promise promise) {
		try {
			Intent intent = this.intentWithContentUri(Uri.parse("content://"), PKPASS_TYPE);
			boolean canAddPass = intent.resolveActivity(getReactApplicationContext().getPackageManager()) != null;
			promise.resolve(canAddPass);
		} catch (Exception e) {
			promise.reject(new JSApplicationCausedNativeException(e.getMessage()));
		}
	}

	@ReactMethod
	public void addPass(String pkpassUri, String fileProvider, Promise promise) {
		try {
			Context context = getReactApplicationContext();
      Uri uri = Uri.parse(pkpassUri);
			Intent intent = this.intentWithContentUri(uri, PKPASS_TYPE);
			context.startActivity(intent);
			promise.resolve(null);
		} catch (Exception e) {
			promise.reject(new JSApplicationCausedNativeException(e.getMessage()));
		}
	}
}
