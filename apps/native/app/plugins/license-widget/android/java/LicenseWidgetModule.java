package is.island.app;

import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.SharedPreferences;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class LicenseWidgetModule extends ReactContextBaseJavaModule {
    private static final String MODULE_NAME = "LicenseWidgetModule";
    private static final String SHARED_PREFS_NAME = "is.island.app.preferences";
    private static final String LICENSES_KEY = "licenses";

    public LicenseWidgetModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void updateLicenses(String licensesJSON) {
        if (licensesJSON == null) {
            return;
        }

        Context context = getReactApplicationContext();
        if (context == null) {
            return;
        }

        SharedPreferences prefs = context.getSharedPreferences(SHARED_PREFS_NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();
        editor.putString(LICENSES_KEY, licensesJSON);
        editor.apply();
        updateAllWidgets(context);
    }

    @ReactMethod
    public void updateWidgets() {
        Context context = getReactApplicationContext();
        if (context == null) {
            return;
        }
        updateAllWidgets(context);
    }

    private void updateAllWidgets(Context context) {
        AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
        ComponentName componentName = new ComponentName(context, LicenseWidgetProvider.class);
        int[] appWidgetIds = appWidgetManager.getAppWidgetIds(componentName);

        if (appWidgetIds.length > 0) {
            for (int appWidgetId : appWidgetIds) {
                LicenseWidgetProvider.updateAppWidget(context, appWidgetManager, appWidgetId);
            }
        }
    }
}
