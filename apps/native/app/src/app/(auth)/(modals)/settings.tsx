import { useApolloClient } from '@apollo/client'
import * as Application from 'expo-application'
import { authenticateAsync } from 'expo-local-authentication'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  Image,
  Linking,
  Platform,
  Alert as RNAlert,
  ScrollView,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native'
import { useTheme } from 'styled-components/native'

import { useFeatureFlag } from '@/components/providers/feature-flag-provider'
import { PressableHighlight } from '@/components/pressable-highlight/pressable-highlight'
import {
  UpdateProfileDocument,
  UpdateProfileMutation,
  UpdateProfileMutationVariables,
  useDeletePasskeyMutation,
  useGetProfileQuery,
} from '@/graphql/types/schema'
import { authStore } from '@/stores/auth-store'
import {
  Locale,
  preferencesStore,
  usePreferencesStore,
} from '@/stores/preferences-store'
import { useUiStore } from '@/stores/ui-store'
import {
  Alert,
  NavigationBarSheet,
  TableViewAccessory,
  TableViewCell,
  TableViewGroup,
} from '@/ui'
import { useBiometricType } from '../../../hooks/use-biometric-type'
import { NotificationsPermissionAlert } from '@/components/notifications-permission-alert'
import { useNotificationsPermission } from '@/hooks/use-notifications-permission'
import { ensureNotificationsPermission } from '@/utils/permissions'
import { testIDs } from '@/utils/test-ids'

import chevronForward from '@/ui/assets/icons/chevron-forward.png'
import editIcon from '@/assets/icons/edit.png'
import { StackScreen } from '../../../components/stack-screen'
import { ToastHost } from '@/components/toast'
import { SelectionMenu } from 'react-native-platform-components'
import { openBrowserAsync } from 'expo-web-browser'

export default function SettingsScreen() {
  const router = useRouter()
  const client = useApolloClient()
  const intl = useIntl()
  const theme = useTheme()

  const {
    dismiss,
    dismissed,
    locale,
    setLocale,
    hasAcceptedBiometrics,
    useBiometrics,
    setUseBiometrics,
    appLockTimeout,
    hasCreatedPasskey,
  } = usePreferencesStore()
  const [localeDialogVisible, setLocaleDialogVisible] = useState(false)
  const [screenLockTimeDialogVisible, setScreenLockTimeDialogVisible] =
    useState(false)

  const isInfoDismissed = dismissed.includes('userSettingsInformational')
  const { authenticationTypes, isEnrolledBiometrics } = useUiStore()
  const biometricType = useBiometricType(authenticationTypes)
  const isPasskeyEnabled = useFeatureFlag('isPasskeyEnabled', false)

  const userProfile = useGetProfileQuery()
  const [deletePasskey] = useDeletePasskeyMutation()

  const [documentNotifications, setDocumentNotifications] = useState(
    userProfile.data?.getUserProfile?.documentNotifications,
  )
  const [emailNotifications, setEmailNotifications] = useState(
    !!userProfile.data?.getUserProfile?.canNudge,
  )
  const {
    status: osNotificationsStatus,
    refresh: refreshNotificationsPermission,
  } = useNotificationsPermission()

  // The toggle is only a preference, so warn when the OS disagrees: `denied` can
  // only be undone in system settings, `undetermined` can still be prompted for.
  const notificationsBlockedByOs =
    !!documentNotifications && osNotificationsStatus === 'denied'
  const notificationsNotEnabledYet =
    !!documentNotifications && osNotificationsStatus === 'undetermined'

  useEffect(() => {
    if (userProfile) {
      setDocumentNotifications(
        userProfile.data?.getUserProfile?.documentNotifications,
      )
      setEmailNotifications(!!userProfile.data?.getUserProfile?.canNudge)
    }
  }, [userProfile])

  const onLogoutPress = async () => {
    await authStore.getState().logout()
    router.replace('/login')
  }

  const onRemovePasskeyPress = () => {
    RNAlert.alert(
      intl.formatMessage({ id: 'settings.security.removePasskeyPromptTitle' }),
      intl.formatMessage({
        id: 'settings.security.removePasskeyPromptDescription',
      }),
      [
        {
          text: intl.formatMessage({
            id: 'settings.security.removePasskeyCancelButton',
          }),
          style: 'cancel',
        },
        {
          text: intl.formatMessage({
            id: 'settings.security.removePasskeyButton',
          }),
          style: 'destructive',
          onPress: async () => {
            preferencesStore.setState({
              hasCreatedPasskey: false,
              hasOnboardedPasskeys: false,
              lastUsedPasskey: 0,
            })
            await deletePasskey()
          },
        },
      ],
    )
  }

  const updateDocumentNotifications = (value: boolean) => {
    client
      .mutate<UpdateProfileMutation, UpdateProfileMutationVariables>({
        mutation: UpdateProfileDocument,
        update(cache, { data }) {
          cache.modify({
            fields: {
              getUserProfile: (existing) => ({
                ...existing,
                ...data?.updateProfile,
              }),
            },
          })
        },
        variables: { input: { documentNotifications: value } },
      })
      .catch(() => {
        RNAlert.alert(
          intl.formatMessage({
            id: 'settings.communication.newNotificationsErrorTitle',
          }),
          intl.formatMessage({
            id: 'settings.communication.newNotificationsErrorDescription',
          }),
        )
      })
  }

  const onNotificationsBlockedPress = () => {
    Linking.openSettings()
  }

  const onAllowNotificationsPress = async () => {
    try {
      await ensureNotificationsPermission()
    } catch {
      // Nothing to tell the user: the refresh below leaves the banner showing
      // whatever the OS actually reports.
    } finally {
      refreshNotificationsPermission()
    }
  }

  const onDocumentNotificationsChange = async (value: boolean) => {
    updateDocumentNotifications(value)
    setDocumentNotifications(value)

    // Turning it off cannot revoke the OS permission, so there is nothing to do.
    if (!value) {
      return
    }

    try {
      const outcome = await ensureNotificationsPermission()

      // No prompt is possible, so offer system settings instead.
      if (outcome === 'blocked') {
        RNAlert.alert(
          intl.formatMessage({
            id: 'settings.communication.notificationsBlockedAlertTitle',
          }),
          intl.formatMessage({
            id: 'settings.communication.notificationsBlockedAlertDescription',
          }),
          [
            {
              text: intl.formatMessage({
                id: 'settings.communication.notificationsBlockedAlertCancelButton',
              }),
              style: 'cancel',
            },
            {
              text: intl.formatMessage({
                id: 'settings.communication.notificationsBlockedAlertOpenSettingsButton',
              }),
              onPress: onNotificationsBlockedPress,
            },
          ],
        )
      }
    } catch {
      // Reading or requesting the permission failed; the banner stays in sync
      // with the OS through the refresh below.
    } finally {
      refreshNotificationsPermission()
    }
  }

  const updateEmailNotifications = (value: boolean) => {
    client
      .mutate<UpdateProfileMutation, UpdateProfileMutationVariables>({
        mutation: UpdateProfileDocument,
        update(cache, { data }) {
          cache.modify({
            fields: {
              getUserProfile: (existing) => ({
                ...existing,
                ...data?.updateProfile,
              }),
            },
          })
        },
        variables: { input: { canNudge: value } },
      })
      .catch(() => {
        RNAlert.alert(
          intl.formatMessage({
            id: 'settings.communication.newNotificationsErrorTitle',
          }),
          intl.formatMessage({
            id: 'settings.communication.newNotificationsErrorDescription',
          }),
        )
      })
  }

  const updateLocale = (value: string) => {
    client
      .mutate<UpdateProfileMutation, UpdateProfileMutationVariables>({
        mutation: UpdateProfileDocument,
        update(cache, { data }) {
          cache.modify({
            fields: {
              getUserProfile: (existing) => ({
                ...existing,
                ...data?.updateProfile,
              }),
            },
          })
        },
        variables: { input: { locale: value } },
      })
      .catch(() => {
        // noop
      })
  }

  return (
    <>
      <ScrollView
        style={{ flex: 1 }}
        testID={testIDs.USER_SCREEN_SETTINGS}
        stickyHeaderIndices={[0]}
        nestedScrollEnabled={true}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <StackScreen closeable networkStatus={[userProfile.networkStatus]} />
        <View>
          <Alert
            type="info"
            visible={!isInfoDismissed}
            message={intl.formatMessage({ id: 'settings.infoBoxText' })}
            onClose={() => dismiss('userSettingsInformational')}
            hideIcon
          />
          <View style={{ height: 32 }} />
        </View>

        {/* User settings */}
        <TableViewGroup
          header={intl.formatMessage({
            id: 'settings.usersettings.groupTitle',
          })}
        >
          <TableViewCell
            title={intl.formatMessage({
              id: 'settings.usersettings.telephone',
            })}
            subtitle={
              userProfile.data?.getUserProfile?.mobilePhoneNumber ?? '-'
            }
            accessory={
              <TouchableOpacity
                onPress={() => router.navigate('/edit-phone')}
                style={{
                  paddingLeft: 16,
                  paddingBottom: 10,
                  paddingTop: 10,
                  paddingRight: 16,
                  marginRight: -16,
                }}
              >
                <Image
                  source={editIcon as any}
                  style={{ width: 19, height: 19 }}
                />
              </TouchableOpacity>
            }
          />
          <TableViewCell
            title={intl.formatMessage({ id: 'settings.usersettings.email' })}
            subtitle={userProfile.data?.getUserProfile?.email ?? '-'}
            accessory={
              <TouchableOpacity
                onPress={() => router.navigate('/edit-email')}
                style={{
                  paddingLeft: 16,
                  paddingBottom: 10,
                  paddingTop: 10,
                  paddingRight: 16,
                  marginRight: -16,
                }}
              >
                <Image
                  source={editIcon as any}
                  style={{ width: 19, height: 19 }}
                />
              </TouchableOpacity>
            }
          />
          <TableViewCell
            title={intl.formatMessage({
              id: 'settings.usersettings.bankinfo',
            })}
            subtitle={userProfile.data?.getUserProfile?.bankInfo ?? '-'}
            accessory={
              <TouchableOpacity
                onPress={() => router.navigate('/edit-bank-info')}
                style={{
                  paddingLeft: 16,
                  paddingBottom: 10,
                  paddingTop: 10,
                  paddingRight: 16,
                  marginRight: -16,
                }}
              >
                <Image
                  source={editIcon as any}
                  style={{ width: 19, height: 19 }}
                />
              </TouchableOpacity>
            }
          />
        </TableViewGroup>

        {/* Communication */}
        <TableViewGroup
          header={intl.formatMessage({
            id: 'settings.communication.groupTitle',
          })}
        >
          {notificationsNotEnabledYet && (
            <NotificationsPermissionAlert
              titleId="settings.communication.notificationsNotEnabledTitle"
              messageId="settings.communication.notificationsNotEnabledDescription"
              linkTextId="settings.communication.notificationsNotEnabledLinkText"
              onPress={onAllowNotificationsPress}
            />
          )}
          {notificationsBlockedByOs && (
            <NotificationsPermissionAlert
              titleId="settings.communication.notificationsBlockedTitle"
              messageId="settings.communication.notificationsBlockedDescription"
              linkTextId="settings.communication.notificationsBlockedLinkText"
              onPress={onNotificationsBlockedPress}
            />
          )}
          <TableViewCell
            title={intl.formatMessage({
              id: 'settings.communication.newNotificationsEmailLabel',
            })}
            subtitle={intl.formatMessage({
              id: 'settings.communication.newNotificationsEmailDescription',
            })}
            accessory={
              <View>
                <Switch
                  onValueChange={(value) => {
                    updateEmailNotifications(value)
                    setEmailNotifications(value)
                  }}
                  disabled={userProfile.loading && !userProfile.data}
                  value={emailNotifications}
                  thumbColor={Platform.select({ android: theme.color.dark100 })}
                  trackColor={{
                    false: theme.color.dark200,
                    true: theme.color.blue400,
                  }}
                />
              </View>
            }
          />
          <TableViewCell
            title={intl.formatMessage({
              id: 'settings.communication.newNotificationsInAppLabel',
            })}
            subtitle={intl.formatMessage({
              id: 'settings.communication.newNotificationsInAppDescription',
            })}
            accessory={
              <View>
                <Switch
                  onValueChange={onDocumentNotificationsChange}
                  disabled={userProfile.loading && !userProfile.data}
                  value={documentNotifications}
                  thumbColor={Platform.select({ android: theme.color.dark100 })}
                  trackColor={{
                    false: theme.color.dark200,
                    true: theme.color.blue400,
                  }}
                />
              </View>
            }
          />
        </TableViewGroup>

        {/* Security */}
        <TableViewGroup
          header={intl.formatMessage({ id: 'settings.security.groupTitle' })}
        >
          <PressableHighlight
            onPress={() => router.navigate('/onboarding/pin?from=settings')}
          >
            <TableViewCell
              title={intl.formatMessage({
                id: 'settings.security.changePinLabel',
              })}
              subtitle={intl.formatMessage({
                id: 'settings.security.changePinDescription',
              })}
              accessory={
                <Image
                  source={chevronForward}
                  style={{ width: 24, height: 24 }}
                />
              }
            />
          </PressableHighlight>
          <TableViewCell
            title={intl.formatMessage(
              { id: 'settings.security.useBiometricsLabel' },
              { biometricType: biometricType.text },
            )}
            subtitle={
              authenticationTypes.length === 0
                ? intl.formatMessage({
                    id: 'onboarding.biometrics.noAuthenticationTypes',
                  })
                : isEnrolledBiometrics
                ? intl.formatMessage(
                    { id: 'settings.security.useBiometricsDescription' },
                    { biometricType: biometricType.text },
                  )
                : intl.formatMessage(
                    { id: 'onboarding.biometrics.notEnrolled' },
                    { biometricType: biometricType.text },
                  )
            }
            accessory={
              <View>
                <Switch
                  onValueChange={(value) => {
                    if (value && !hasAcceptedBiometrics) {
                      authenticateAsync({
                        disableDeviceFallback: true,
                        fallbackLabel: '',
                        cancelLabel: intl.formatMessage({
                          id: 'biometrics.cancel',
                        }),
                      }).then((result) => {
                        if (result.success) {
                          setUseBiometrics(true)
                          preferencesStore.setState({
                            hasAcceptedBiometrics: true,
                          })
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
              </View>
            }
          />
          {isPasskeyEnabled && (
            <PressableHighlight
              onPress={() => {
                hasCreatedPasskey
                  ? onRemovePasskeyPress()
                  : router.navigate('/passkey')
              }}
            >
              <TableViewCell
                title={intl.formatMessage({
                  id: hasCreatedPasskey
                    ? 'settings.security.removePasskeyLabel'
                    : 'settings.security.createPasskeyLabel',
                })}
                subtitle={intl.formatMessage({
                  id: hasCreatedPasskey
                    ? 'settings.security.removePasskeyDescription'
                    : 'settings.security.createPasskeyDescription',
                })}
                accessory={
                  <Image
                    source={chevronForward}
                    style={{ width: 24, height: 24 }}
                  />
                }
              />
            </PressableHighlight>
          )}
          <PressableHighlight
            onPress={() => setScreenLockTimeDialogVisible(true)}
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
                  {`${intl.formatNumber(Math.floor(appLockTimeout / 1000), {
                    style: 'decimal',
                    unitDisplay: 'short',
                    unit: 'second',
                  })} ${intl.formatMessage({
                    id: 'settings.security.appLockTimeoutSeconds',
                  })}`}
                  <SelectionMenu
                    placeholder={intl.formatMessage({
                      id: 'settings.security.appLockTimeoutLabel',
                    })}
                    options={[
                      {
                        data: '5000',
                        label: `${intl.formatNumber(5, {
                          style: 'decimal',
                          unitDisplay: 'long',
                          unit: 'second',
                        })} ${intl.formatMessage({
                          id: 'settings.security.appLockTimeoutSeconds',
                        })}`,
                      },
                      {
                        data: '10000',
                        label: `${intl.formatNumber(10, {
                          style: 'decimal',
                          unitDisplay: 'long',
                          unit: 'second',
                        })} ${intl.formatMessage({
                          id: 'settings.security.appLockTimeoutSeconds',
                        })}`,
                      },
                      {
                        data: '15000',
                        label: `${intl.formatNumber(15, {
                          style: 'decimal',
                          unitDisplay: 'long',
                          unit: 'second',
                        })} ${intl.formatMessage({
                          id: 'settings.security.appLockTimeoutSeconds',
                        })}`,
                      },
                    ]}
                    selected={String(appLockTimeout)}
                    visible={screenLockTimeDialogVisible}
                    onSelect={(data) => {
                      preferencesStore.setState({
                        appLockTimeout: Number(data),
                      })
                      setScreenLockTimeDialogVisible(false)
                    }}
                    presentation="modal"
                    onRequestClose={() => setScreenLockTimeDialogVisible(false)}
                  />
                </TableViewAccessory>
              }
            />
          </PressableHighlight>
          <PressableHighlight
            onPress={() =>
              openBrowserAsync(
                'https://island.is/personuverndarstefna-stafraent-islands',
              )
            }
          >
            <TableViewCell
              title={intl.formatMessage({
                id: 'settings.security.privacyTitle',
              })}
              subtitle={intl.formatMessage({
                id: 'settings.security.privacySubTitle',
              })}
              accessory={
                <Image
                  source={chevronForward}
                  style={{ width: 24, height: 24 }}
                />
              }
            />
          </PressableHighlight>
        </TableViewGroup>

        {/* About */}
        <TableViewGroup
          header={intl.formatMessage({ id: 'settings.about.groupTitle' })}
        >
          <PressableHighlight onPress={() => setLocaleDialogVisible(true)}>
            <TableViewCell
              title={intl.formatMessage({
                id: 'settings.accessibilityLayout.language',
              })}
              accessory={
                <TableViewAccessory>
                  {locale === 'is-IS' ? 'Íslenska' : 'English'}
                  <SelectionMenu
                    placeholder={intl.formatMessage({
                      id: 'settings.accessibilityLayout.language',
                    })}
                    options={[
                      { label: 'Íslenska', data: 'is-IS' },
                      { label: 'English', data: 'en-US' },
                    ]}
                    selected={locale}
                    visible={localeDialogVisible}
                    onSelect={(data) => {
                      setLocale(data as Locale)
                      updateLocale(data === 'is-IS' ? 'is' : 'en')
                      setLocaleDialogVisible(false)
                    }}
                    presentation="modal"
                    onRequestClose={() => setLocaleDialogVisible(false)}
                  />
                </TableViewAccessory>
              }
            />
          </PressableHighlight>

          <TableViewCell
            title={intl.formatMessage({ id: 'settings.about.versionLabel' })}
            subtitle={`${Application.nativeApplicationVersion} build ${Application.nativeBuildVersion}`}
          />
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
      <ToastHost />
    </>
  )
}
