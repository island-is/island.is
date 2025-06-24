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

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        try {
            SharedPreferences prefs = context.getSharedPreferences(SHARED_PREFS_NAME, Context.MODE_PRIVATE);
            String licenseType = prefs.getString("widget_license_type_" + appWidgetId, "DriversLicense");
            boolean showInfo = prefs.getBoolean("widget_show_info_" + appWidgetId, true);
            LicensePayload license = loadLicensePayload(context, licenseType);
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.license_widget_medium);

            if (license != null) {
                setupLicenseViews(context, views, license, licenseType, showInfo);
            } else {
                setupNotFoundViews(context, views, licenseType);
            }

            Intent intent = createLaunchIntent(context, license, licenseType);
            PendingIntent pendingIntent = PendingIntent.getActivity(context, appWidgetId, intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            views.setOnClickPendingIntent(R.id.widget_container, pendingIntent);

            appWidgetManager.updateAppWidget(appWidgetId, views);
        } catch (Exception e) {
            System.err.println("Error updating license widget: " + e.getMessage());
            e.printStackTrace();
            // Create a simple fallback view
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.license_widget_medium);
            views.setTextViewText(R.id.license_title, "Error");
            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
    }

    // @todo responsive views (impl later)
    private static int getLayoutForSize(Context context, AppWidgetManager appWidgetManager,
                                       int appWidgetId, boolean showInfo) {
        return R.layout.license_widget_medium;
    }

    private static void setupLicenseViews(Context context, RemoteViews views, LicensePayload license,
                                        String licenseType, boolean showInfo) {
        views.setTextViewText(R.id.license_title,
            license.title != null ? license.title : getLicenseDisplayTitle(licenseType));

        if (showInfo && license.subtitle != null && !license.subtitle.isEmpty()) {
            views.setTextViewText(R.id.license_subtitle, license.subtitle);
            views.setViewVisibility(R.id.license_subtitle, android.view.View.VISIBLE);
        } else {
            views.setViewVisibility(R.id.license_subtitle, android.view.View.GONE);
        }

        int iconRes = getAgencyIconResource(licenseType);
        views.setImageViewResource(R.id.agency_icon, iconRes);

        int[] backgroundColors = getBackgroundColors(licenseType);
        views.setInt(R.id.widget_container, "setBackgroundColor", backgroundColors[0]);

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
        views.setTextViewText(R.id.license_title, getLicenseDisplayTitle(licenseType) + " fannst ekki");
        views.setTextViewText(R.id.license_subtitle, "Skoða öll skírteini");
        views.setViewVisibility(R.id.license_subtitle, android.view.View.VISIBLE);
        views.setImageViewResource(R.id.agency_icon, R.drawable.ic_error);
        views.setViewVisibility(R.id.license_photo, android.view.View.GONE);
        views.setViewVisibility(R.id.license_name, android.view.View.GONE);
        views.setInt(R.id.widget_container, "setBackgroundColor", 0xFFE0E0E0);
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
            System.err.println("Error parsing licenses JSON: " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }

    private static Intent createLaunchIntent(Context context, LicensePayload license, String licenseType) {
        Intent intent = new Intent(Intent.ACTION_VIEW);

        if (license != null && license.uri != null && !license.uri.isEmpty()) {
            System.out.println("Launching intent 1: " + license.uri);
            intent.setData(Uri.parse(license.uri));
        } else {
            String packageName = context.getPackageName();
            String scheme = packageName.replace(".dev", "");

            if (license != null && license.licenseId != null && !license.licenseId.isEmpty()) {
                String uri = scheme + "://wallet/" + licenseType + "/" + license.licenseId;
                System.out.println("Launching intent 2: " + uri);
                intent.setData(Uri.parse(uri));
            } else {
                String uri = scheme + "://wallet/" + licenseType;
                System.out.println("Launching intent 3: " + uri);
                intent.setData(Uri.parse(uri));
            }
        }

        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        return intent;
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
            System.err.println("Error decoding base64: " + e.getMessage());
            return null;
        }
    }

    private static String getLicenseDisplayTitle(String licenseType) {
        switch (licenseType) {
            case "DriversLicense": return "Ökuskírteini";
            case "HuntingLicense": return "Veiðikort";
            case "AdrLicense": return "ADR skírteini";
            case "MachineLicense": return "Vinnuvélaskírteini";
            case "FirearmLicense": return "Skotvopnaleyfi";
            case "DisabilityLicense": return "Örorkuskírteini";
            case "Passport": return "Vegabréf";
            case "Ehic": return "Evrópska sjúkratryggingakortið";
            default: return "Skírteini";
        }
    }

    private static int getAgencyIconResource(String licenseType) {
        switch (licenseType) {
            case "DriversLicense": return R.drawable.ic_agency_coat_of_arms;
            case "HuntingLicense":
            case "FirearmLicense": return R.drawable.ic_agency_police;
            case "AdrLicense":
            case "MachineLicense": return R.drawable.ic_agency_occupational_safety;
            case "DisabilityLicense": return R.drawable.ic_agency_social_insurance;
            case "Passport": return R.drawable.ic_agency_registers;
            case "Ehic": return R.drawable.ic_agency_health;
            default: return R.drawable.ic_wallet;
        }
    }

    private static int[] getBackgroundColors(String licenseType) {
        switch (licenseType) {
            case "DriversLicense": return new int[]{0xFFF5E4EC, 0xFFE2C4D1};
            case "HuntingLicense": return new int[]{0xFFDBEBF4, 0xFFB3D3E3};
            case "AdrLicense": return new int[]{0xFFF8FAF7, 0xFFEEFAE6};
            case "MachineLicense": return new int[]{0xFFE8FADD, 0xFFB3DC97};
            case "FirearmLicense": return new int[]{0xFFF1EDE2, 0xFFF5F4D5};
            case "DisabilityLicense": return new int[]{0xFFDEE6D9, 0xFF8BAB8D};
            case "Passport": return new int[]{0xFFEAECF6, 0xFFABB2D1};
            case "Ehic": return new int[]{0xFFEEF0F8, 0xFF95A0CF};
            default: return new int[]{0xFFE0E0E0, 0xFFC0C0C0};
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
