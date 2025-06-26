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

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setResult(RESULT_CANCELED);
        setContentView(R.layout.license_widget_config);
        mLicenseTypeSpinner = findViewById(R.id.license_type_spinner);
        mShowInfoCheckbox = findViewById(R.id.show_info_checkbox);

        if (mLicenseTypeSpinner == null || mShowInfoCheckbox == null) {
            finish();
            return;
        }

        ArrayAdapter<LicenseTypeRegistry.LicenseType> adapter = new ArrayAdapter<>(this,
            android.R.layout.simple_spinner_item, LicenseTypeRegistry.LICENSE_TYPES);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        mLicenseTypeSpinner.setAdapter(adapter);

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

        loadExistingConfiguration();
    }

    View.OnClickListener mOnClickListener = new View.OnClickListener() {
        public void onClick(View v) {
            final Context context = LicenseWidgetConfigActivity.this;

            // Save the configuration
            int selectedPosition = mLicenseTypeSpinner.getSelectedItemPosition();
            LicenseTypeRegistry.LicenseType selectedLicenseType = LicenseTypeRegistry.LICENSE_TYPES[selectedPosition];
            String licenseType = selectedLicenseType.type;
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

    private void loadExistingConfiguration() {
        // Load existing preferences
        String existingLicenseType = loadLicenseTypePref(this, mAppWidgetId);
        boolean existingShowInfo = loadShowInfoPref(this, mAppWidgetId);

        // Find the position of the existing license type
        int position = 0;
        for (int i = 0; i < LicenseTypeRegistry.LICENSE_TYPES.length; i++) {
            if (LicenseTypeRegistry.LICENSE_TYPES[i].type.equals(existingLicenseType)) {
                position = i;
                break;
            }
        }
        mLicenseTypeSpinner.setSelection(position);
        mShowInfoCheckbox.setChecked(existingShowInfo);
    }

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
