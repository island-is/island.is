package is.island.app;

public class LicenseTypeRegistry {

    public static class LicenseType {
        public final String type;
        public final String displayName;
        public final int agencyIconResource;
        public final int[] backgroundColors;
        public final int backgroundDrawableResource;

        public LicenseType(String type, String displayName, int agencyIconResource, int[] backgroundColors, int backgroundDrawableResource) {
            this.type = type;
            this.displayName = displayName;
            this.agencyIconResource = agencyIconResource;
            this.backgroundColors = backgroundColors;
            this.backgroundDrawableResource = backgroundDrawableResource;
        }

        @Override
        public String toString() {
            return displayName;
        }
    }

    public static final LicenseType[] LICENSE_TYPES = {
        new LicenseType(
            "DriversLicense",
            "Ökuskírteini",
            R.drawable.ic_agency_coat_of_arms,
            new int[]{0xFFF5E4EC, 0xFFE2C4D1},
            R.drawable.widget_background_drivers_license
        ),
        new LicenseType(
            "FirearmLicense",
            "Skotvopnaleyfi",
            R.drawable.ic_agency_police,
            new int[]{0xFFF1EDE2, 0xFFF5F4D5},
            R.drawable.widget_background_firearm_license
        ),
        new LicenseType(
            "HuntingLicense",
            "Veiðikort",
            R.drawable.ic_agency_police,
            new int[]{0xFFDBEBF4, 0xFFB3D3E3},
            R.drawable.widget_background_hunting_license
        ),
        new LicenseType(
            "DisabilityLicense",
            "Örorkuskírteini",
            R.drawable.ic_agency_social_insurance,
            new int[]{0xFFDEE6D9, 0xFF8BAB8D},
            R.drawable.widget_background_disability_license
        ),
        new LicenseType(
            "MachineLicense",
            "Vinnuvélaskírteini",
            R.drawable.ic_agency_occupational_safety,
            new int[]{0xFFE8FADD, 0xFFB3DC97},
            R.drawable.widget_background_machine_license
        ),
        new LicenseType(
            "AdrLicense",
            "ADR skírteini",
            R.drawable.ic_agency_occupational_safety,
            new int[]{0xFFF8FAF7, 0xFFEEFAE6},
            R.drawable.widget_background_adr_license
        ),
        // @note Not in use.
        //
        // new LicenseType(
        //     "Passport",
        //     "Vegabréf",
        //     R.drawable.ic_agency_registers,
        //     new int[]{0xFFEAECF6, 0xFFABB2D1}
        // ),
        // new LicenseType(
        //     "Ehic",
        //     "Evrópska sjúkratryggingakortið",
        //     R.drawable.ic_agency_health,
        //     new int[]{0xFFEEF0F8, 0xFF95A0CF}
        // )
    };

    public static LicenseType findLicenseTypeByType(String type) {
        for (LicenseType licenseType : LICENSE_TYPES) {
            if (licenseType.type.equals(type)) {
                return licenseType;
            }
        }
        return LICENSE_TYPES[0]; // Default to first license type (DriversLicense)
    }

    public static String getDisplayName(String type) {
        if (type == null) {
            return LICENSE_TYPES[0].displayName;
        }
        LicenseType licenseType = findLicenseTypeByType(type);
        return licenseType.displayName;
    }

    public static int getAgencyIconResource(String type) {
        if (type == null) {
            return getDefaultAgencyIconResource();
        }
        LicenseType licenseType = findLicenseTypeByType(type);
        return licenseType.agencyIconResource;
    }

    public static int getDefaultAgencyIconResource() {
        // default to skjaldamerki
        return R.drawable.ic_agency_coat_of_arms;
    }

    public static int[] getBackgroundColors(String type) {
        LicenseType licenseType = findLicenseTypeByType(type);
        return licenseType.backgroundColors;
    }

    public static int getBackgroundDrawableResource(String type) {
        LicenseType licenseType = findLicenseTypeByType(type);
        return licenseType.backgroundDrawableResource;
    }

    public static int[] getDefaultBackgroundColors() {
        return new int[]{0xFFF5D8E7, 0xFFF5D8E7};
    }
}
