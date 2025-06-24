import { NativeModules, Platform } from 'react-native'
import { reloadTimelines, setItem } from 'react-native-widgetkit'
import { config } from '../config'
import { ListLicensesQueryResult } from '../graphql/types/schema'

// Constants for shared preferences key and group in iOS
const SHARED_PREFS_KEY = 'widget_licenses'
const SHARED_PREFS_GROUP = 'group.is.island.app'
const WIDGET_KIND = 'is.island.app.LicenseWidget';

// sync license data to widgets
export async function syncLicenseWidgetData(
  licenses?: NonNullable<
    ListLicensesQueryResult['data']
  >['genericLicenseCollection']['licenses'],
) {
  const entries = licenses?.flatMap((license) => {
    if (license.isOwnerChildOfUser) return []
    return [
      {
        type: license.license.type,
        status: license.license.status,
        nationalId: license.nationalId,
        ...license.payload?.metadata,
        displayTag: license.payload?.metadata?.displayTag?.text,
        // @todo is this the correct way to deep link?
        uri: `${config.bundleId}://wallet/${license.license.type}/${license.payload?.metadata?.licenseId}`,
      },
    ]
  })

  const payload = JSON.stringify(entries || [])

  if (Platform.OS === 'ios') {
    await setItem(SHARED_PREFS_KEY, payload, SHARED_PREFS_GROUP)
    reloadTimelines(WIDGET_KIND)
  } else if (Platform.OS === 'android') {
    await NativeModules.LicenseWidgetModule.updateLicenses(payload)
    await NativeModules.LicenseWidgetModule.updateWidgets()
  }
}
