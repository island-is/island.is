import { NativeModules, Platform } from 'react-native'
import { reloadTimelines, setItem } from 'react-native-widgetkit'
import { config, isTestingApp } from '../config'
import { ListLicensesQueryResult } from '../graphql/types/schema'
import { authStore } from '../stores/auth-store'

// Constants for shared preferences key and group in iOS
const SHARED_PREFS_KEY = 'widget_licenses'
const SHARED_PREFS_GROUP = isTestingApp
  ? 'group.is.island.app.dev'
  : 'group.is.island.app'
const WIDGET_KIND = 'LicenseWidget'

// Function to set license data for widgets
export async function setLicenseWidgetData(payload: string) {
  if (Platform.OS === 'ios') {
    try {
      await setItem(SHARED_PREFS_KEY, payload, SHARED_PREFS_GROUP)
      reloadTimelines(WIDGET_KIND)
    } catch (error) {
      console.error('Failed to update iOS widgets:', error)
    }
  } else if (Platform.OS === 'android') {
    try {
      await NativeModules.LicenseWidgetModule.updateLicenses(payload)
      await NativeModules.LicenseWidgetModule.updateWidgets()
    } catch (error) {
      console.error('Failed to update Android widgets:', error)
    }
  }
}

export async function clearWidgetData() {
  try {
    setLicenseWidgetData('[]')
  } catch (error) {
    console.error('Failed to clear widget data:', error)
  }
}

// sync license data to widgets
export async function syncLicenseWidgetData(
  licenses?: NonNullable<
    ListLicensesQueryResult['data']
  >['genericLicenseCollection']['licenses'],
) {
  const entries = licenses?.flatMap((license) => {
    // Skip children licenses
    if (license.isOwnerChildOfUser) return []
    return [
      {
        type: license.license.type,
        status: license.license.status,
        nationalId: license.nationalId,
        ...license.payload?.metadata,
        displayTag: license.payload?.metadata?.displayTag?.text,
        // Use the users full name if available, otherwise use the license title
        title:
          authStore.getState().userInfo?.name ??
          license.payload?.metadata?.title,
        // @todo is this the correct way to deep link?
        uri: `${config.bundleId}://wallet/${license.license.type}/${license.payload?.metadata?.licenseId}`,
      },
    ]
  })

  const payload = JSON.stringify(entries || [])

  return setLicenseWidgetData(payload)
}
