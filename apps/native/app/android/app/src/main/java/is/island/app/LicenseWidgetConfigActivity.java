package is.island.app;

import android.app.Activity;
import android.appwidget.AppWidgetManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.CheckBox;
import android.widget.RemoteViews;
import android.widget.Spinner;

public class LicenseWidgetConfigActivity extends Activity {
    private static final String SHARED_PREFS_NAME = "is.island.app.preferences";

    private int mAppWidgetId = AppWidgetManager.INVALID_APPWIDGET_ID;
    private Spinner mLicenseTypeSpinner;
    private CheckBox mShowInfoCheckbox;

    private static final String[] LICENSE_TYPES = {
        "DriversLicense",
        "HuntingLicense",
        "AdrLicense",
        "MachineLicense",
        "FirearmLicense",
        "DisabilityLicense",
        "Passport",
        "Ehic"
    };

    private static final String[] LICENSE_DISPLAY_NAMES = {
        "Ökuskírteini",
        "Veiðikort",
        "ADR skírteini",
        "Vinnuvélaskírteini",
        "Skotvopnaleyfi",
        "Örorkuskírteini",
        "Vegabréf",
        "Evrópska sjúkratryggingakortið"
    };

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setResult(RESULT_CANCELED);
        setContentView(R.layout.license_widget_config);

        mLicenseTypeSpinner = findViewById(R.id.license_type_spinner);
        mShowInfoCheckbox = findViewById(R.id.show_info_checkbox);

        // Set up the spinner (jesus.. Android version of a dropdown menu)
        ArrayAdapter<String> adapter = new ArrayAdapter<>(this,
            android.R.layout.simple_spinner_item, LICENSE_DISPLAY_NAMES);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        mLicenseTypeSpinner.setAdapter(adapter);
        mLicenseTypeSpinner.setSelection(0); // DriversLicense
        mShowInfoCheckbox.setChecked(true); // Show info by default

        findViewById(R.id.add_button).setOnClickListener(mOnClickListener);

        Intent intent = getIntent();
        Bundle extras = intent.getExtras();
        if (extras != null) {
            mAppWidgetId = extras.getInt(
                AppWidgetManager.EXTRA_APPWIDGET_ID, AppWidgetManager.INVALID_APPWIDGET_ID);
        }

        if (mAppWidgetId == AppWidgetManager.INVALID_APPWIDGET_ID) {
            finish();
            return;
        }
    }

    View.OnClickListener mOnClickListener = new View.OnClickListener() {
        public void onClick(View v) {
            final Context context = LicenseWidgetConfigActivity.this;

            // Save the configuration
            int selectedPosition = mLicenseTypeSpinner.getSelectedItemPosition();
            String licenseType = LICENSE_TYPES[selectedPosition];
            boolean showInfo = mShowInfoCheckbox.isChecked();

            saveLicenseTypePref(context, mAppWidgetId, licenseType);
            saveShowInfoPref(context, mAppWidgetId, showInfo);

            AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
            LicenseWidgetProvider.updateAppWidget(context, appWidgetManager, mAppWidgetId);

            Intent resultValue = new Intent();
            resultValue.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, mAppWidgetId);
            setResult(RESULT_OK, resultValue);
            finish();
        }
    };

    static void saveLicenseTypePref(Context context, int appWidgetId, String licenseType) {
        SharedPreferences.Editor prefs = context.getSharedPreferences(SHARED_PREFS_NAME, 0).edit();
        prefs.putString("widget_license_type_" + appWidgetId, licenseType);
        prefs.apply();
    }

    static void saveShowInfoPref(Context context, int appWidgetId, boolean showInfo) {
        SharedPreferences.Editor prefs = context.getSharedPreferences(SHARED_PREFS_NAME, 0).edit();
        prefs.putBoolean("widget_show_info_" + appWidgetId, showInfo);
        prefs.apply();
    }

    static String loadLicenseTypePref(Context context, int appWidgetId) {
        SharedPreferences prefs = context.getSharedPreferences(SHARED_PREFS_NAME, 0);
        return prefs.getString("widget_license_type_" + appWidgetId, "DriversLicense");
    }

    static boolean loadShowInfoPref(Context context, int appWidgetId) {
        SharedPreferences prefs = context.getSharedPreferences(SHARED_PREFS_NAME, 0);
        return prefs.getBoolean("widget_show_info_" + appWidgetId, true);
    }
}
