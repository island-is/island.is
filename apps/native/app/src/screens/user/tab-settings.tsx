import {
  Alert,
  TableViewAccessory,
  TableViewCell,
  TableViewGroup
} from '@island.is/island-ui-native'
import messaging from '@react-native-firebase/messaging'
import * as Sentry from '@sentry/react-native'
import {
  authenticateAsync
} from 'expo-local-authentication'
import React, { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  Alert as RNAlert, Linking,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  View
} from 'react-native'
import { Navigation } from 'react-native-navigation'
import { useTheme } from 'styled-components/native'
import CodePush, {
  LocalPackage
} from '../../../../node_modules/react-native-code-push'
import { PressableHighlight } from '../../components/pressable-highlight/pressable-highlight'
import { showPicker } from '../../lib/show-picker'
import { authStore } from '../../stores/auth-store'
import {
  PreferencesStore,
  preferencesStore,
  usePreferencesStore
} from '../../stores/preferences-store'
import { useUiStore } from '../../stores/ui-store'
import { ComponentRegistry } from '../../utils/component-registry'
import { config } from '../../utils/config'
import { getAppRoot } from '../../utils/lifecycle/get-app-root'
import { testIDs } from '../../utils/test-ids'
import { useBiometricType } from '../onboarding/onboarding-biometrics'

const PreferencesSwitch = React.memo(
  ({ name }: { name: keyof PreferencesStore }) => {
    const theme = useTheme()
    return (
      <Switch
        onValueChange={(value) =>
          preferencesStore.setState({ [name]: value } as any)
        }
        value={preferencesStore.getState()[name] as boolean}
        thumbColor={Platform.select({ android: theme.color.dark100 })}
        trackColor={{
          false: theme.color.dark200,
          true: theme.color.blue400,
        }}
      />
    )
  },
)

export function TabSettings() {
  const intl = useIntl()
  const theme = useTheme()
  const {
    dismiss,
    dismissed,
    locale,
    setLocale,
    hasAcceptedBiometrics,
    appearanceMode,
    setAppearanceMode,
    useBiometrics,
    setUseBiometrics,
    appLockTimeout,
  } = usePreferencesStore()
  const [loadingCP, setLoadingCP] = useState(false)
  const [localPackage, setLocalPackage] = useState<LocalPackage | null>(null)
  const [pushToken, setPushToken] = useState('loading...')
  const efficient = useRef<any>({}).current
  const isInfoDismissed = dismissed.includes('userSettingsInformational')
  const { authenticationTypes, isEnrolledBiometrics } = useUiStore()
  const biometricType = useBiometricType(authenticationTypes)

  const onLogoutPress = async () => {
    await authStore.getState().logout()
    await Navigation.dismissAllModals()
    await Navigation.setRoot({
      root: await getAppRoot(),
    })
  }

  const onLanguagePress = () => {
    showPicker({
      type: 'radio',
      title: intl.formatMessage({
        id: 'settings.accessibilityLayout.language',
      }),
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
    setTimeout(() => {
      // @todo move to ui store, persist somehow
      setLoadingCP(true)
      CodePush.getUpdateMetadata().then((p) => {
        setLoadingCP(false)
        setLocalPackage(p)
      })
      messaging()
        .getToken()
        .then((token) => setPushToken(token))
        .catch(() => setPushToken('no token in simulator'))
    }, 330)
  }, [])

  return (
    <ScrollView style={{ flex: 1 }} testID={testIDs.USER_SCREEN_SETTINGS}>
      <Alert
        type="info"
        visible={!isInfoDismissed}
        message={intl.formatMessage({ id: 'settings.infoBoxText' })}
        onClose={() => dismiss('userSettingsInformational')}
        hideIcon
      />
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
          accessory={<PreferencesSwitch name="notificationsNewDocuments" />}
        />
        <TableViewCell
          title={intl.formatMessage({
            id: 'settings.communication.appUpdatesNotifications',
          })}
          accessory={<PreferencesSwitch name="notificationsAppUpdates" />}
        />
        <TableViewCell
          title={intl.formatMessage({
            id: 'settings.communication.applicationsNotifications',
          })}
          accessory={
            <PreferencesSwitch name="notificationsApplicationStatusUpdates" />
          }
        />
      </TableViewGroup>
      <TableViewGroup
        header={intl.formatMessage({
          id: 'settings.accessibilityLayout.groupTitle',
        })}
      >
        <TableViewCell
          title={intl.formatMessage({
            id: 'settings.accessibilityLayout.sytemDarkMode',
          })}
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
        <Pressable
          onPress={() => {
            clearTimeout(efficient.ts)
            efficient.count = (efficient.count ?? 0) + 1
            if (efficient.count === 11) {
              setAppearanceMode('efficient')
            }
            efficient.ts = setTimeout(() => {
              efficient.count = 0
            }, 500)
          }}
        >
          <TableViewCell
            title={intl.formatMessage({
              id: 'settings.accessibilityLayout.darkMode',
            })}
            accessory={
              <Switch
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
        </Pressable>
        <PressableHighlight onPress={onLanguagePress}>
          <TableViewCell
            title={intl.formatMessage({
              id: 'settings.accessibilityLayout.language',
            })}
            accessory={
              <TableViewAccessory>
                {locale === 'is-IS' ? 'Íslenska' : 'English'}
              </TableViewAccessory>
            }
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
              biometricType: biometricType.text,
            },
          )}
          subtitle={
            isEnrolledBiometrics
              ? intl.formatMessage(
                  {
                    id: 'settings.security.useBiometricsDescription',
                  },
                  { biometricType: biometricType.text },
                )
              : intl.formatMessage(
                  {
                    id: 'onboarding.biometrics.notEnrolled',
                  },
                  { biometricType: biometricType.text },
                )
          }
          accessory={
            <Switch
              onValueChange={(value) => {
                if (value === true && !hasAcceptedBiometrics) {
                  authenticateAsync().then((authenticate) => {
                    if (authenticate.success) {
                      setUseBiometrics(true)
                      preferencesStore.setState({ hasAcceptedBiometrics: true })
                    }
                  })
                } else {
                  setUseBiometrics(value)
                }
              }}
              disabled={!isEnrolledBiometrics}
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
              title: intl.formatMessage({
                id: 'settings.security.appLockTimeoutLabel',
              }),
              items: [
                {
                  id: '5000',
                  label: intl.formatNumber(5, {
                    style: 'unit',
                    unitDisplay: 'long',
                    unit: 'second',
                  }),
                },
                {
                  id: '10000',
                  label: intl.formatNumber(10, {
                    style: 'unit',
                    unitDisplay: 'long',
                    unit: 'second',
                  }),
                },
                {
                  id: '15000',
                  label: intl.formatNumber(15, {
                    style: 'unit',
                    unitDisplay: 'long',
                    unit: 'second',
                  }),
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
            title={intl.formatMessage({
              id: 'settings.security.appLockTimeoutLabel',
            })}
            subtitle={intl.formatMessage({
              id: 'settings.security.appLockTimeoutDescription',
            })}
            accessory={
              <TableViewAccessory>
                {intl.formatNumber(Math.floor(appLockTimeout / 1000), {
                  style: 'unit',
                  unitDisplay: 'short',
                  unit: 'second',
                })}
              </TableViewAccessory>
            }
          />
        </PressableHighlight>

        <PressableHighlight
          onPress={() => {
            Linking.openURL(
              'https://island.is/personuverndarstefna-stafraent-islands',
            )
          }}
        >
          <TableViewCell
            title={intl.formatMessage({ id: 'settings.security.privacyTitle' })}
            subtitle={intl.formatMessage({
              id: 'settings.security.privacySubTitle',
            })}
          />
        </PressableHighlight>
      </TableViewGroup>
      <TableViewGroup
        header={intl.formatMessage({ id: 'settings.about.groupTitle' })}
      >
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
        <PressableHighlight
          onPress={() => {
            console.log(pushToken)
            RNAlert.prompt('token', 'yup', undefined, undefined, pushToken)
          }}
          onLongPress={() => {
            Sentry.nativeCrash()
          }}
        >
          <TableViewCell title="Push Token" subtitle={pushToken} />
        </PressableHighlight>
        <PressableHighlight
          onPress={onLogoutPress}
          testID={testIDs.USER_SETTINGS_LOGOUT_BUTTON}
        >
          <TableViewCell
            title={intl.formatMessage({ id: 'settings.about.logoutLabel' })}
            subtitle={intl.formatMessage({
              id: 'settings.about.logoutDescription',
            })}
          />
        </PressableHighlight>
      </TableViewGroup>
    </ScrollView>
  )
}
