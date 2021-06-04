import {
  Alert,
  TableViewAccessory,
  TableViewCell,
  TableViewGroup
} from '@island.is/island-ui-native'
import * as Sentry from '@sentry/react-native'
import { getDevicePushTokenAsync } from 'expo-notifications'
import React, { useEffect, useRef, useState } from 'react'
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  View,
  Alert as RNAlert,
  AppState,
} from 'react-native'
import { Navigation } from 'react-native-navigation'
import { useTheme } from 'styled-components/native'
import CodePush, {
  LocalPackage
} from '../../../../node_modules/react-native-code-push'
import { PressableHighlight } from '../../components/pressable-highlight/pressable-highlight'
import { useAuthStore } from '../../stores/auth-store'
import {
  PreferencesStore,
  preferencesStore,
  usePreferencesStore
} from '../../stores/preferences-store'
import { ComponentRegistry } from '../../utils/component-registry'
import { config } from '../../utils/config'
import { useIntl } from '../../utils/intl'
import { getAppRoot } from '../../utils/lifecycle/get-app-root'
import { showPicker } from '../../utils/show-picker'
import { testIDs } from '../../utils/test-ids'
import { useBiometricType } from '../onboarding/onboarding-biometrics'
import {
  authenticateAsync,
  AuthenticationType,
  supportedAuthenticationTypesAsync,
  isEnrolledAsync
} from 'expo-local-authentication'

const PreferencesSwitch = React.memo(
  ({ name }: { name: keyof PreferencesStore }) => {
    const theme = useTheme()
    const [value, setValue] = useState(
      preferencesStore.getState()[name] as boolean,
    )
    const onValueChange = (val: boolean) => {
      setValue(val)
    }
    useEffect(() => {
      requestAnimationFrame(() => {
        preferencesStore.setState(() => ({ [name]: value } as any))
      })
    }, [value])
    return (
      <Switch
        onValueChange={onValueChange}
        value={value}
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
  const authStore = useAuthStore()
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
  const offsetY = useRef(new Animated.Value(0)).current
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [loadingCP, setLoadingCP] = useState(false)
  const [localPackage, setLocalPackage] = useState<LocalPackage | null>(null)
  const [pushToken, setPushToken] = useState('loading...')
  const efficient = useRef<any>({}).current

  const isInfoDismissed = dismissed.includes('userSettingsInformational')

  const viewRef = useRef<View>()
  const [offset, setOffset] = useState(!isInfoDismissed)

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
    // @todo move to ui store, persist somehow
    setTimeout(() => {
      isEnrolledAsync().then(setIsEnrolled)
      supportedAuthenticationTypesAsync().then(setSupportedAuthenticationTypes)
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
    }, 330)
    AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        isEnrolledAsync().then(setIsEnrolled)
      }
    })
  }, [])

  return (
    <ScrollView style={{ flex: 1 }} testID={testIDs.USER_SCREEN_SETTINGS}>
      <Alert
        type="info"
        visible={!isInfoDismissed}
        message={intl.formatMessage({ id: 'settings.infoBoxText' })}
        onClose={() => {
          dismiss('userSettingsInformational')
        }}
        onClosed={() => {
          setOffset(false)
        }}
        hideIcon
        sharedAnimatedValue={offsetY}
      />

      <Animated.View
        ref={viewRef as any}
        style={{
          marginTop: offset ? 72 : 0,
          transform: [
            {
              translateY: offsetY,
            },
          ],
        }}
      >
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
                biometricType,
              },
            )}
            subtitle={isEnrolled ?
              intl.formatMessage({
              id: 'settings.security.useBiometricsDescription',
            }) : intl.formatMessage({
              id: 'onboarding.biometrics.notEnrolled',
            }, { biometricType })}
            accessory={
              <Switch
                onValueChange={(value) => {
                  if (value === true && !hasAcceptedBiometrics) {
                    authenticateAsync().then((authenticate) => {
                      if (authenticate.success) {
                        setUseBiometrics(true);
                        preferencesStore.setState({ hasAcceptedBiometrics: true });
                      }
                    });
                  } else {
                    setUseBiometrics(value);
                  }
                }}
                disabled={!isEnrolled}
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
              throw new Error('My first Sentry error!')
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
      </Animated.View>
    </ScrollView>
  )
}
