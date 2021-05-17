import SegmentedControl from '@react-native-segmented-control/segmented-control'
import { getDevicePushTokenAsync } from 'expo-notifications'
import React, { useEffect, useState } from 'react'
import { Platform, ScrollView, Switch, Text, View } from 'react-native'
import DialogAndroid from 'react-native-dialogs'
import { Navigation } from 'react-native-navigation'
import { useTheme } from 'styled-components/native'
import CodePush, {
  LocalPackage,
} from '../../../../node_modules/react-native-code-push'
import { InfoMessage } from '../../components/info-message/info-message'
import { PressableHighlight } from '../../components/pressable-highlight/pressable-highlight'
import { TableViewCell } from '../../components/tableview/tableview-cell'
import { TableViewGroup } from '../../components/tableview/tableview-group'
import { useAuthStore } from '../../stores/auth-store'
import { usePreferencesStore } from '../../stores/preferences-store'
import { config } from '../../utils/config'
import { useIntl } from '../../utils/intl'
import { getAppRoot } from '../../utils/lifecycle/get-app-root'
import { testIDs } from '../../utils/test-ids'

export function TabSettings() {
  const authStore = useAuthStore()
  const intl = useIntl()
  const theme = useTheme()
  const {
    dismiss,
    dismissed,
    locale,
    setLocale,
    appearanceMode,
    setAppearanceMode,
    useBiometrics,
    setUseBiometrics,
  } = usePreferencesStore()
  const [loadingCP, setLoadingCP] = useState(false)
  const [localPackage, setLocalPackage] = useState<LocalPackage | null>(null)
  const [pushToken, setPushToken] = useState('loading...')
  const [notificationsNewDocuments, setNotificationsNewDocuments] = useState(
    false,
  )
  const [appUpdatesNotifications, setAppUpdatesNotifications] = useState(false)
  const [applicationsNotifications, setApplicationsNotifications] = useState(
    false,
  )

  const onLogoutPress = async () => {
    await authStore.logout()
    await Navigation.dismissAllModals()
    Navigation.setRoot({
      root: await getAppRoot(),
    })
  }

  const onLanguagePress = () => {
    DialogAndroid.showPicker('Select language', null, {
      negativeText: 'Cancel',
      type: DialogAndroid.listRadio,
      selectedId: locale,
      items: [
        { label: 'Íslenska', id: 'is-IS' },
        { label: 'English', id: 'en-US' },
      ],
      negativeColor: theme.color.dark400,
      positiveColor: theme.color.blue400,
      widgetColor: theme.color.blue400,
    }).then(({ selectedItem }: any) => {
      if (selectedItem) {
        setLocale(selectedItem.id)
      }
    })
  }

  useEffect(() => {
    setLoadingCP(true)
    CodePush.getUpdateMetadata().then((p) => {
      setLoadingCP(false)
      setLocalPackage(p)
    })
    getDevicePushTokenAsync()
      .then(({ data }) => {
        setPushToken(data)
      })
      .catch((err) => {
        setPushToken('no token in simulator')
      })
  }, [])

  return (
    <ScrollView style={{ flex: 1 }}>
      {!dismissed.includes('userSettingsInformational') && (
        <InfoMessage onClose={() => dismiss('userSettingsInformational')}>
          Stillingar á virkni og útliti appsins
        </InfoMessage>
      )}
      <View style={{ height: 32 }} />
      <TableViewGroup
        header={intl.formatMessage({
          id: 'settings.communication.groupTitle',
        })}
      >
        <TableViewCell
          title={intl.formatMessage({
            id: 'settings.communication.newDocumentsNotifications',
          })}
          accessory={
            <Switch
              onValueChange={setNotificationsNewDocuments}
              value={notificationsNewDocuments}
              thumbColor={Platform.select({ android: theme.color.dark100 })}
              trackColor={{
                false: theme.color.dark200,
                true: theme.color.blue400,
              }}
            />
          }
        />
        <TableViewCell
          title={intl.formatMessage({
            id: 'settings.communication.appUpdatesNotifications',
          })}
          accessory={
            <Switch
              onValueChange={setAppUpdatesNotifications}
              value={appUpdatesNotifications}
              thumbColor={Platform.select({ android: theme.color.dark100 })}
              trackColor={{
                false: theme.color.dark200,
                true: theme.color.blue400,
              }}
            />
          }
        />
        <TableViewCell
          title={intl.formatMessage({
            id: 'settings.communication.applicationsNotifications',
          })}
          accessory={
            <Switch
              onValueChange={setApplicationsNotifications}
              value={applicationsNotifications}
              thumbColor={Platform.select({ android: theme.color.dark100 })}
              trackColor={{
                false: theme.color.dark200,
                true: theme.color.blue400,
              }}
            />
          }
        />
      </TableViewGroup>
      <TableViewGroup
        header={intl.formatMessage({
          id: 'settings.accessibilityLayout.groupTitle',
        })}
      >
        <TableViewCell
          title="Use system appearance"
          accessory={
            <Switch
              onValueChange={(value) => {
                setAppearanceMode(value ? 'automatic' : 'light')
              }}
              value={appearanceMode === 'automatic'}
              thumbColor={Platform.select({ android: theme.color.dark100 })}
              trackColor={{
                false: theme.color.dark200,
                true: theme.color.blue400,
              }}
            />
          }
        />
        <TableViewCell
          title={intl.formatMessage({
            id: 'settings.accessibilityLayout.darkMode',
          })}
          accessory={
            <Switch
              disabled={appearanceMode === 'automatic'}
              onValueChange={(value) =>
                setAppearanceMode(value ? 'dark' : 'light')
              }
              value={appearanceMode === 'dark'}
              thumbColor={Platform.select({ android: theme.color.dark100 })}
              trackColor={{
                false: theme.color.dark200,
                true: theme.color.blue400,
              }}
            />
          }
        />
        <PressableHighlight
          disabled={Platform.OS !== 'android'}
          onPress={Platform.OS === 'android' ? onLanguagePress : undefined}
        >
          <TableViewCell
            title={intl.formatMessage({
              id: 'settings.accessibilityLayout.language',
            })}
            accessory={
              Platform.OS === 'android' ? (
                <Text>{locale === 'is-IS' ? 'Íslenska' : 'English'}</Text>
              ) : undefined
            }
            bottom={Platform.select({
              ios: (
                <SegmentedControl
                  values={['Íslenska', 'English']}
                  selectedIndex={locale === 'is-IS' ? 0 : 1}
                  style={{ marginTop: 16 }}
                  appearance={theme.isDark ? 'dark' : 'light'}
                  onChange={(event) => {
                    const { selectedSegmentIndex } = event.nativeEvent
                    setLocale(selectedSegmentIndex === 0 ? 'is-IS' : 'en-US')
                  }}
                  activeFontStyle={{
                    fontFamily: 'IBMPlexSans-SemiBold',
                  }}
                  fontStyle={{
                    fontFamily: 'IBMPlexSans',
                  }}
                />
              ),
            })}
          />
        </PressableHighlight>
      </TableViewGroup>
      <TableViewGroup header="Öryggi og persónuvernd">
        <PressableHighlight onPress={() => {}}>
          <TableViewCell
            title="Breyta leyninúmeri"
            subtitle="Skiptu út 4 stafa leyninúmeri þínu fyrir nýtt"
          />
        </PressableHighlight>
        <TableViewCell
          title="Nota Face ID"
          subtitle="Möguleiki á að komast fyrr inn í appið"
          accessory={
            <Switch
              onValueChange={setUseBiometrics}
              value={useBiometrics}
              thumbColor={Platform.select({ android: theme.color.dark100 })}
              trackColor={{
                false: theme.color.dark200,
                true: theme.color.blue400,
              }}
            />
          }
        />
        <PressableHighlight onPress={() => {}}>
          <TableViewCell
            title="Biðtími skjálæsingar"
            subtitle="Hversu langur tími líður þar til skjálæsing fer á"
            accessory={<Text>5 sekúndur</Text>}
          />
        </PressableHighlight>
      </TableViewGroup>
      <TableViewGroup header="About">
        <TableViewCell
          title="Version"
          subtitle={`${config.constants.nativeAppVersion} build ${
            config.constants.nativeBuildVersion
          } ${config.constants.debugMode ? '(debug)' : ''}`}
        />
        <TableViewCell
          title="Codepush"
          subtitle={
            loadingCP
              ? 'Loading...'
              : !localPackage
              ? 'N/A: Using native bundle'
              : `${localPackage?.label}: ${localPackage.packageHash}`
          }
        />
        <TableViewCell title="Push Token" subtitle={pushToken} />
        <PressableHighlight onPress={onLogoutPress} testID={testIDs.USER_SETTINGS_LOGOUT_BUTTON}>
          <TableViewCell
            title="Logout"
            subtitle="You will be signed out of the app."
          />
        </PressableHighlight>
      </TableViewGroup>
    </ScrollView>
  )
}
