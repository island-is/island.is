package is.island.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.util.Base64;
import android.util.Log;
import android.widget.RemoteViews;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class LicenseWidgetProvider extends AppWidgetProvider {
    private static final String TAG = "LicenseWidget";
    private static final String SHARED_PREFS_NAME = "is.island.app.preferences";
    private static final String LICENSES_KEY = "licenses";

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    @Override
    public void onAppWidgetOptionsChanged(Context context, AppWidgetManager appWidgetManager,
                                        int appWidgetId, Bundle newOptions) {
        super.onAppWidgetOptionsChanged(context, appWidgetManager, appWidgetId, newOptions);
        updateAppWidget(context, appWidgetManager, appWidgetId);
    }

    @Override
    public void onDeleted(Context context, int[] appWidgetIds) {
        // Clean up widget preferences when widgets are deleted
        SharedPreferences prefs = context.getSharedPreferences(SHARED_PREFS_NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();
        for (int appWidgetId : appWidgetIds) {
            editor.remove("widget_license_type_" + appWidgetId);
            editor.remove("widget_show_info_" + appWidgetId);
        }
        editor.apply();
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);

        String action = intent.getAction();
        if (AppWidgetManager.ACTION_APPWIDGET_CONFIGURE.equals(action)) {
            int appWidgetId = intent.getIntExtra(AppWidgetManager.EXTRA_APPWIDGET_ID,
                AppWidgetManager.INVALID_APPWIDGET_ID);

            if (appWidgetId != AppWidgetManager.INVALID_APPWIDGET_ID) {
                Intent configIntent = new Intent(context, LicenseWidgetConfigActivity.class);
                configIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId);
                configIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                context.startActivity(configIntent);
            }
        }
    }

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        try {
            SharedPreferences prefs = context.getSharedPreferences(SHARED_PREFS_NAME, Context.MODE_PRIVATE);
            String licenseType = prefs.getString("widget_license_type_" + appWidgetId, "DriversLicense");
            boolean showInfo = prefs.getBoolean("widget_show_info_" + appWidgetId, true);
            LicensePayload license = loadLicensePayload(context, licenseType);

            // Determine the appropriate layout based on widget size
            int layoutId = getLayoutForSize(context, appWidgetManager, appWidgetId, showInfo);
            RemoteViews views = new RemoteViews(context.getPackageName(), layoutId);

            if (license != null) {
                setupLicenseViews(context, views, license, licenseType, showInfo, appWidgetManager, appWidgetId);
            } else {
                setupNotFoundViews(context, views, licenseType);
            }

            Intent intent = createLaunchIntent(context, license, licenseType);
            PendingIntent pendingIntent = PendingIntent.getActivity(context, appWidgetId, intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            views.setOnClickPendingIntent(R.id.widget_container, pendingIntent);

            appWidgetManager.updateAppWidget(appWidgetId, views);
        } catch (Exception e) {
            Log.e(TAG, "Error updating license widget: " + e.getMessage(), e);
            // Create a simple fallback view
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.license_widget_medium);
            views.setTextViewText(R.id.license_title, "Error");
            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
    }

    private static int calculateWidgetCellWidth(int widthDp) {
        return Math.max(1, (widthDp + 30) / 70);
    }

    private static int calculateWidgetCellHeight(int heightDp) {
        return Math.max(1, (heightDp + 30) / 70);
    }

    private static void setupLicenseViews(Context context, RemoteViews views, LicensePayload license,
                                        String licenseType, boolean showInfo, AppWidgetManager appWidgetManager, int appWidgetId) {
        views.setTextViewText(R.id.license_title,
            license.title != null ? license.title : LicenseTypeRegistry.getDisplayName(licenseType));

        if (showInfo && license.subtitle != null && !license.subtitle.isEmpty()) {
            views.setTextViewText(R.id.license_subtitle, license.subtitle);
            views.setViewVisibility(R.id.license_subtitle, android.view.View.VISIBLE);
        } else {
            views.setViewVisibility(R.id.license_subtitle, android.view.View.GONE);
        }

        int iconRes = LicenseTypeRegistry.getAgencyIconResource(licenseType);
        views.setImageViewResource(R.id.agency_icon, iconRes);

        applyGradientBackground(context, views, licenseType);

        if (showInfo && license.photo != null) {
            Bitmap photoBitmap = decodeBase64Photo(license.photo);
            if (photoBitmap != null) {
                views.setImageViewBitmap(R.id.license_photo, photoBitmap);
                views.setViewVisibility(R.id.license_photo, android.view.View.VISIBLE);
            } else {
                views.setViewVisibility(R.id.license_photo, android.view.View.GONE);
            }
        } else {
            views.setViewVisibility(R.id.license_photo, android.view.View.GONE);
        }

        if (showInfo && license.name != null && !license.name.isEmpty()) {
            views.setTextViewText(R.id.license_name, license.name);
            views.setViewVisibility(R.id.license_name, android.view.View.VISIBLE);
        } else {
            views.setViewVisibility(R.id.license_name, android.view.View.GONE);
        }
    }

    private static void setupNotFoundViews(Context context, RemoteViews views, String licenseType) {
        views.setTextViewText(R.id.license_title, LicenseTypeRegistry.getDisplayName(licenseType) + " fannst ekki");
        views.setTextViewText(R.id.license_subtitle, "Opna Ísland.is appið");
        views.setTextViewText(R.id.license_name, "Ísland.is");
        views.setViewVisibility(R.id.license_subtitle, android.view.View.VISIBLE);
        views.setImageViewResource(R.id.agency_icon, R.drawable.ic_error);
        views.setViewVisibility(R.id.license_photo, android.view.View.GONE);
        views.setViewVisibility(R.id.license_name, android.view.View.GONE);
        applyGradientBackground(context, views, licenseType);
    }

    private static LicensePayload loadLicensePayload(Context context, String licenseType) {
        try {
            SharedPreferences prefs = context.getSharedPreferences(SHARED_PREFS_NAME, Context.MODE_PRIVATE);
            String rawJSON = prefs.getString(LICENSES_KEY, "[]");

            // System.out.println("License Widget Raw JSON size: " + rawJSON.length());

            JSONArray licenses = new JSONArray(rawJSON);

            for (int i = 0; i < licenses.length(); i++) {
                JSONObject license = licenses.getJSONObject(i);
                String type = license.optString("type", "");
                if (type.equalsIgnoreCase(licenseType)) {
                    return LicensePayload.fromJSON(license);
                }
            }
        } catch (JSONException e) {
            Log.e(TAG, "Error parsing licenses JSON: " + e.getMessage(), e);
        }
        return null;
    }

    private static Intent createLaunchIntent(Context context, LicensePayload license, String licenseType) {
        Intent intent = new Intent(Intent.ACTION_VIEW);

        if (license != null && license.uri != null && !license.uri.isEmpty()) {
            intent.setData(Uri.parse(license.uri));
        } else {
            String packageName = context.getPackageName();
            String scheme = packageName.replace(".dev", "");

            if (license != null && license.licenseId != null && !license.licenseId.isEmpty()) {
                String uri = scheme + "://wallet/" + licenseType + "/" + license.licenseId;
                intent.setData(Uri.parse(uri));
            } else {
                String uri = scheme + "://wallet/" + licenseType;
                intent.setData(Uri.parse(uri));
            }
        }

        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        return intent;
    }

    private static void applyGradientBackground(Context context, RemoteViews views, String licenseType) {
        try {
            int backgroundResId = LicenseTypeRegistry.getBackgroundDrawableResource(licenseType);
            views.setInt(R.id.widget_container, "setBackgroundResource", backgroundResId);
        } catch (Exception e) {
            Log.e(TAG, "Error applying gradient background: " + e.getMessage());
            // Fallback to solid color
            int[] colors = LicenseTypeRegistry.getBackgroundColors(licenseType);
            views.setInt(R.id.widget_container, "setBackgroundColor", colors[0]);
        }
    }

    private static Bitmap decodeBase64Photo(String photo) {
        try {
            Pattern pattern = Pattern.compile("data:image/[^;]+;base64,(.*)");
            Matcher matcher = pattern.matcher(photo);
            String base64Data;

            if (matcher.matches()) {
                base64Data = matcher.group(1);
            } else {
                base64Data = photo;
            }

            byte[] decodedBytes = Base64.decode(base64Data, Base64.DEFAULT);
            return BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.length);
        } catch (Exception e) {
            Log.e(TAG, "Error decoding base64: " + e.getMessage());
            return null;
        }
    }

    private static int getLayoutForSize(Context context, AppWidgetManager appWidgetManager,
                                       int appWidgetId, boolean showInfo) {
        Bundle options = appWidgetManager.getAppWidgetOptions(appWidgetId);
        int minWidth = options.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH, 110);
        int minHeight = options.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT, 110);
        int cellWidth = calculateWidgetCellWidth(minWidth);
        int cellHeight = calculateWidgetCellHeight(minHeight);
        if (cellWidth > 2 && cellHeight > 1) {
            return R.layout.license_widget_large;
        } else {
            return R.layout.license_widget_medium;
        }
    }

    static class LicensePayload {
        String type;
        String nationalId;
        String licenseNumber;
        String licenseId;
        String name;
        String title;
        String subtitle;
        String photo;
        String uri;

        static LicensePayload fromJSON(JSONObject json) throws JSONException {
            LicensePayload payload = new LicensePayload();
            payload.type = json.optString("type");
            payload.nationalId = json.optString("nationalId");
            payload.licenseNumber = json.optString("licenseNumber");
            payload.licenseId = json.optString("licenseId");
            payload.name = json.optString("name");
            payload.title = json.optString("title");
            payload.subtitle = json.optString("subtitle");
            payload.photo = json.optString("photo");
            payload.uri = json.optString("uri");
            return payload;
        }
    }
}
