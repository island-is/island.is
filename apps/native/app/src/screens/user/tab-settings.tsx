import SegmentedControl from '@react-native-segmented-control/segmented-control'
import {
  AuthenticationType,
  supportedAuthenticationTypesAsync,
} from 'expo-local-authentication'
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
import {
  preferencesStore,
  usePreferencesStore,
} from '../../stores/preferences-store'
import { ComponentRegistry } from '../../utils/component-registry'
import { config } from '../../utils/config'
import { useIntl } from '../../utils/intl'
import { getAppRoot } from '../../utils/lifecycle/get-app-root'
import { showPicker } from '../../utils/show-picker'
import { testIDs } from '../../utils/test-ids'
import { useBiometricType } from '../onboarding/onboarding-biometrics'

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
    appLockTimeout,
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

  const [
    supportedAuthenticationTypes,
    setSupportedAuthenticationTypes,
  ] = useState<AuthenticationType[]>([])

  const biometricType = useBiometricType(supportedAuthenticationTypes)

  const onLogoutPress = async () => {
    await authStore.logout()
    await Navigation.dismissAllModals()
    await Navigation.setRoot({
      root: await getAppRoot(),
    })
  }

  const onLanguagePress = () => {
    showPicker({
      type: 'radio',
      title: intl.formatMessage({ id: 'settings.accessibilityLayout.language' }),
      items: [
        { label: 'Íslenska', id: 'is-IS' },
        { label: 'English', id: 'en-US' },
      ],
      selectedId: locale,
      cancel: true,
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

  useEffect(() => {
    supportedAuthenticationTypesAsync().then(setSupportedAuthenticationTypes)
  }, [])

  return (
    <ScrollView style={{ flex: 1 }} testID={testIDs.USER_SCREEN_SETTINGS}>
      {!dismissed.includes('userSettingsInformational') && (
        <InfoMessage onClose={() => dismiss('userSettingsInformational')}>
          {intl.formatMessage({ id: 'settings.infoBoxText' })}
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
        <PressableHighlight onPress={onLanguagePress}>
          <TableViewCell
            title={intl.formatMessage({
              id: 'settings.accessibilityLayout.language',
            })}
            accessory={<Text>{locale === 'is-IS' ? 'Íslenska' : 'English'}</Text>}
          />
        </PressableHighlight>
      </TableViewGroup>
      <TableViewGroup
        header={intl.formatMessage({
          id: 'settings.security.groupTitle',
        })}
      >
        <PressableHighlight
          onPress={() => {
            Navigation.showModal({
              stack: {
                children: [
                  {
                    component: {
                      name: ComponentRegistry.OnboardingPinCodeScreen,
                      passProps: {
                        replacePin: true,
                      },
                    },
                  },
                ],
              },
            })
          }}
        >
          <TableViewCell
            title={intl.formatMessage({
              id: 'settings.security.changePinLabel',
            })}
            subtitle={intl.formatMessage({
              id: 'settings.security.changePinDescription',
            })}
          />
        </PressableHighlight>
        <TableViewCell
          title={intl.formatMessage(
            {
              id: 'settings.security.useBiometricsLabel',
            },
            {
              biometricType
            },
          )}
          subtitle={intl.formatMessage({
            id: 'settings.security.useBiometricsDescription',
          })}
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
        <PressableHighlight
          onPress={() => {
            showPicker({
              title: intl.formatMessage({ id: 'settings.security.appLockTimeoutLabel' }),
              items: [
                {
                  id: '5000',
                  label: intl.formatNumber(5, { style: 'unit', unitDisplay: 'long', unit: 'second' }),
                },
                {
                  id: '10000',
                  label: intl.formatNumber(10, { style: 'unit', unitDisplay: 'long', unit: 'second' }),
                },
                {
                  id: '15000',
                  label: intl.formatNumber(15, { style: 'unit', unitDisplay: 'long', unit: 'second' }),
                },
              ],
              cancel: true,
            }).then((res) => {
              if (res.selectedItem) {
                const appLockTimeout = Number(res.selectedItem.id)
                preferencesStore.setState({ appLockTimeout })
              }
            })
          }}
        >
          <TableViewCell
            title={intl.formatMessage({ id: 'settings.security.appLockTimeoutLabel' })}
            subtitle={intl.formatMessage({ id: 'settings.security.appLockTimeoutDescription' })}
            accessory={<Text>
              {intl.formatNumber(Math.floor(appLockTimeout / 1000), { style: 'unit', unitDisplay: 'short', unit: 'second' })}
            </Text>}
          />
        </PressableHighlight>
      </TableViewGroup>
      <TableViewGroup header={intl.formatMessage({ id: 'settings.about.groupTitle' })}>
        <TableViewCell
          title={intl.formatMessage({ id: 'settings.about.versionLabel' })}
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
        <PressableHighlight
          onPress={onLogoutPress}
          testID={testIDs.USER_SETTINGS_LOGOUT_BUTTON}
        >
          <TableViewCell
            title={intl.formatMessage({ id: 'settings.about.logoutLabel' })}
            subtitle={intl.formatMessage({ id: 'settings.about.logoutDescription' })}
          />
        </PressableHighlight>
      </TableViewGroup>
    </ScrollView>
  )
}
