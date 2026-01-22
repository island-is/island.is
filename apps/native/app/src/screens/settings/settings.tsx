import { useApolloClient } from '@apollo/client'
import { authenticateAsync } from 'expo-local-authentication'
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
import DeviceInfo from 'react-native-device-info'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'
import { useTheme } from 'styled-components/native'

import editIcon from '../../assets/icons/edit.png'
import { PressableHighlight } from '../../components/pressable-highlight/pressable-highlight'
import { useFeatureFlag } from '../../contexts/feature-flag-provider'
import {
  UpdateProfileDocument,
  UpdateProfileMutation,
  UpdateProfileMutationVariables,
  useDeletePasskeyMutation,
  useGetProfileQuery,
} from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { navigateTo } from '../../lib/deep-linking'
import { showPicker } from '../../lib/show-picker'
import { authStore } from '../../stores/auth-store'
import {
  Locale,
  preferencesStore,
  usePreferencesStore,
} from '../../stores/preferences-store'
import { useUiStore } from '../../stores/ui-store'
import {
  Alert,
  NavigationBarSheet,
  TableViewAccessory,
  TableViewCell,
  TableViewGroup,
} from '../../ui'
import chevronForward from '../../ui/assets/icons/chevron-forward.png'
import { ComponentRegistry } from '../../utils/component-registry'
import { getAppRoot } from '../../utils/lifecycle/get-app-root'
import { testIDs } from '../../utils/test-ids'
import { useBiometricType } from '../onboarding/onboarding-biometrics'

const { getNavigationOptions, useNavigationOptions } =
  createNavigationOptionHooks(() => ({
    topBar: {
      visible: false,
    },
  }))

export const SettingsScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  useNavigationOptions(componentId)

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
  const isInfoDismissed = dismissed.includes('userSettingsInformational')
  const { authenticationTypes, isEnrolledBiometrics } = useUiStore()
  const biometricType = useBiometricType(authenticationTypes)
  const isPasskeyEnabled = useFeatureFlag('isPasskeyEnabled', false)

  const onLogoutPress = async () => {
    await authStore.getState().logout()
    await Navigation.dismissAllModals()
    await Navigation.setRoot({
      root: await getAppRoot(),
    })
  }

  const userProfile = useGetProfileQuery()
  const [deletePasskey] = useDeletePasskeyMutation()

  const [documentNotifications, setDocumentNotifications] = useState(
    userProfile.data?.getUserProfile?.documentNotifications,
  )

  const [emailNotifications, setEmailNotifications] = useState(
    !!userProfile.data?.getUserProfile?.canNudge,
  )

  const onRemovePasskeyPress = () => {
    return RNAlert.alert(
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
    }).then(({ selectedItem }) => {
      if (selectedItem?.id) {
        setLocale(selectedItem.id as Locale)
        const locale = selectedItem.id === 'is-IS' ? 'is' : 'en'
        updateLocale(locale)
      }
    })
  }

  const updateDocumentNotifications = (value: boolean) => {
    client
      .mutate<UpdateProfileMutation, UpdateProfileMutationVariables>({
        mutation: UpdateProfileDocument,
        update(cache, { data }) {
          cache.modify({
            fields: {
              getUserProfile: (existing) => {
                return { ...existing, ...data?.updateProfile }
              },
            },
          })
        },
        variables: {
          input: {
            documentNotifications: value,
          },
        },
      })
      .catch((err) => {
        console.error(err)
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

  const updateEmailNotifications = (value: boolean) => {
    client
      .mutate<UpdateProfileMutation, UpdateProfileMutationVariables>({
        mutation: UpdateProfileDocument,
        update(cache, { data }) {
          cache.modify({
            fields: {
              getUserProfile: (existing) => {
                return { ...existing, ...data?.updateProfile }
              },
            },
          })
        },
        variables: {
          input: {
            canNudge: value,
          },
        },
      })
      .catch((err) => {
        console.error(err)
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
              getUserProfile: (existing) => {
                return { ...existing, ...data?.updateProfile }
              },
            },
          })
        },
        variables: {
          input: {
            locale: value,
          },
        },
      })
      .catch(() => {
        // noop
      })
  }

  useEffect(() => {
    if (userProfile) {
      setDocumentNotifications(
        userProfile.data?.getUserProfile?.documentNotifications,
      )
      setEmailNotifications(!!userProfile.data?.getUserProfile?.canNudge)
    }
  }, [userProfile])

  return (
    <View style={{ flex: 1 }} testID={testIDs.SCREEN_SETTINGS}>
      <NavigationBarSheet
        componentId={componentId}
        title={intl.formatMessage({ id: 'setting.screenTitle' })}
        onClosePress={() => Navigation.dismissModal(componentId)}
        style={{ marginHorizontal: 16 }}
        showLoading={userProfile.loading && !!userProfile.data}
      />
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
                onPress={() => navigateTo(`/editphone`)}
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
              id: 'settings.usersettings.email',
            })}
            subtitle={userProfile.data?.getUserProfile?.email ?? '-'}
            accessory={
              <TouchableOpacity
                onPress={() => navigateTo(`/editemail`)}
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
                onPress={() => navigateTo(`/editbankinfo`)}
                style={{
                  paddingLeft: 16,
                  paddingBottom: 10,
                  paddingTop: 10,
                  paddingRight: 16,
                  marginRight: -16,
                }}
              >
                <Image source={editIcon} style={{ width: 19, height: 19 }} />
              </TouchableOpacity>
            }
          />
        </TableViewGroup>
        <TableViewGroup
          header={intl.formatMessage({
            id: 'settings.communication.groupTitle',
          })}
        >
          <TableViewCell
            title={intl.formatMessage({
              id: 'settings.communication.newNotificationsEmailLabel',
            })}
            subtitle={intl.formatMessage({
              id: 'settings.communication.newNotificationsEmailDescription',
            })}
            accessory={
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
              <Switch
                onValueChange={(value) => {
                  updateDocumentNotifications(value)
                  setDocumentNotifications(value)
                }}
                disabled={userProfile.loading && !userProfile.data}
                value={documentNotifications}
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
              {
                id: 'settings.security.useBiometricsLabel',
              },
              {
                biometricType: biometricType.text,
              },
            )}
            subtitle={
              authenticationTypes.length === 0
                ? intl.formatMessage({
                    id: 'onboarding.biometrics.noAuthenticationTypes',
                  })
                : isEnrolledBiometrics
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
            }
          />
          {isPasskeyEnabled && (
            <PressableHighlight
              onPress={() => {
                hasCreatedPasskey
                  ? onRemovePasskeyPress()
                  : navigateTo('/passkey')
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
            onPress={() => {
              showPicker({
                title: intl.formatMessage({
                  id: 'settings.security.appLockTimeoutLabel',
                }),
                items: [
                  {
                    id: '5000',
                    label: `${intl.formatNumber(5, {
                      style: 'decimal',
                      unitDisplay: 'long',
                      unit: 'second',
                    })} ${intl.formatMessage({
                      id: 'settings.security.appLockTimeoutSeconds',
                    })}`,
                  },
                  {
                    id: '10000',
                    label: `${intl.formatNumber(10, {
                      style: 'decimal',
                      unitDisplay: 'long',
                      unit: 'second',
                    })} ${intl.formatMessage({
                      id: 'settings.security.appLockTimeoutSeconds',
                    })}`,
                  },
                  {
                    id: '15000',
                    label: `${intl.formatNumber(15, {
                      style: 'decimal',
                      unitDisplay: 'long',
                      unit: 'second',
                    })} ${intl.formatMessage({
                      id: 'settings.security.appLockTimeoutSeconds',
                    })}`,
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
                  {`${intl.formatNumber(Math.floor(appLockTimeout / 1000), {
                    style: 'decimal',
                    unitDisplay: 'short',
                    unit: 'second',
                  })} ${intl.formatMessage({
                    id: 'settings.security.appLockTimeoutSeconds',
                  })}`}
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
        <TableViewGroup
          header={intl.formatMessage({ id: 'settings.about.groupTitle' })}
        >
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
          <TableViewCell
            title={intl.formatMessage({ id: 'settings.about.versionLabel' })}
            subtitle={`${DeviceInfo.getVersion()} build ${DeviceInfo.getBuildNumber()}`}
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
    </View>
  )
}

SettingsScreen.options = getNavigationOptions
