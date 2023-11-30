import messaging from '@react-native-firebase/messaging';
import {Alert, TableViewAccessory, TableViewCell, TableViewGroup} from '@ui';
import {authenticateAsync} from 'expo-local-authentication';
import React, {useEffect, useRef, useState} from 'react';
import {useIntl} from 'react-intl';
import {
  Image,
  Linking,
  Platform,
  Pressable,
  Alert as RNAlert,
  ScrollView,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native';
import CodePush, {LocalPackage} from 'react-native-code-push';
import DeviceInfo from 'react-native-device-info';
import {Navigation} from 'react-native-navigation';
import {useTheme} from 'styled-components/native';
import editIcon from '../../assets/icons/edit.png';
import {PressableHighlight} from '../../components/pressable-highlight/pressable-highlight';
import {client} from '../../graphql/client';
import {
  UpdateProfileDocument,
  UpdateProfileMutation,
  UpdateProfileMutationVariables,
  useGetProfileQuery,
} from '../../graphql/types/schema';
import {navigateTo} from '../../lib/deep-linking';
import {showPicker} from '../../lib/show-picker';
import {authStore} from '../../stores/auth-store';
import {
  PreferencesStore,
  preferencesStore,
  usePreferencesStore,
} from '../../stores/preferences-store';
import {useUiStore} from '../../stores/ui-store';
import {ComponentRegistry} from '../../utils/component-registry';
import {getAppRoot} from '../../utils/lifecycle/get-app-root';
import {testIDs} from '../../utils/test-ids';
import {useBiometricType} from '../onboarding/onboarding-biometrics';

const PreferencesSwitch = React.memo(
  ({name}: {name: keyof PreferencesStore}) => {
    const theme = useTheme();
    return (
      <Switch
        onValueChange={value =>
          preferencesStore.setState({[name]: value} as any)
        }
        value={preferencesStore.getState()[name] as boolean}
        thumbColor={Platform.select({android: theme.color.dark100})}
        trackColor={{
          false: theme.color.dark200,
          true: theme.color.blue400,
        }}
      />
    );
  },
);

export function SettingsContent() {
  const intl = useIntl();
  const theme = useTheme();
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
  } = usePreferencesStore();
  const [loadingCP, setLoadingCP] = useState(false);
  const [localPackage, setLocalPackage] = useState<LocalPackage | null>(null);
  const [pushToken, setPushToken] = useState('loading...');
  const efficient = useRef<any>({}).current;
  const isInfoDismissed = dismissed.includes('userSettingsInformational');
  const {authenticationTypes, isEnrolledBiometrics} = useUiStore();
  const biometricType = useBiometricType(authenticationTypes);

  const onLogoutPress = async () => {
    await authStore.getState().logout();
    await Navigation.dismissAllModals();
    await Navigation.setRoot({
      root: await getAppRoot(),
    });
  };

  const userProfile = useGetProfileQuery();

  const [documentNotifications, setDocumentNotifications] = useState(
    userProfile.data?.getUserProfile?.documentNotifications,
  );

  const onLanguagePress = () => {
    showPicker({
      type: 'radio',
      title: intl.formatMessage({
        id: 'settings.accessibilityLayout.language',
      }),
      items: [
        {label: 'Íslenska', id: 'is-IS'},
        {label: 'English', id: 'en-US'},
      ],
      selectedId: locale,
      cancel: true,
    }).then(({selectedItem}: any) => {
      if (selectedItem) {
        setLocale(selectedItem.id);
      }
    });
  };

  useEffect(() => {
    setTimeout(() => {
      // @todo move to ui store, persist somehow
      setLoadingCP(true);
      CodePush.getUpdateMetadata().then(p => {
        setLoadingCP(false);
        setLocalPackage(p);
      });
      messaging()
        .getToken()
        .then(token => setPushToken(token))
        .catch(() => setPushToken('no token in simulator'));
    }, 330);
  }, []);

  function updateDocumentNotifications(value: boolean) {
    client
      .mutate<UpdateProfileMutation, UpdateProfileMutationVariables>({
        mutation: UpdateProfileDocument,
        update(cache, {data}) {
          cache.modify({
            fields: {
              getUserProfile: existing => {
                return {...existing, ...data?.updateProfile};
              },
            },
          });
        },
        variables: {
          input: {
            documentNotifications: value,
          },
        },
      })
      .catch(err => {
        RNAlert.alert('Villa', err.message);
      });
  }

  useEffect(() => {
    if (userProfile) {
      setDocumentNotifications(
        userProfile.data?.getUserProfile?.documentNotifications,
      );
    }
  }, [userProfile]);

  return (
    <ScrollView style={{flex: 1}} testID={testIDs.USER_SCREEN_SETTINGS}>
      <Alert
        type="info"
        visible={!isInfoDismissed}
        message={intl.formatMessage({id: 'settings.infoBoxText'})}
        onClose={() => dismiss('userSettingsInformational')}
        hideIcon
      />
      <View style={{height: 32}} />
      <TableViewGroup
        header={intl.formatMessage({
          id: 'settings.usersettings.groupTitle',
        })}>
        <TableViewCell
          title={intl.formatMessage({
            id: 'settings.usersettings.telephone',
          })}
          subtitle={userProfile.data?.getUserProfile?.mobilePhoneNumber ?? '-'}
          accessory={
            <TouchableOpacity
              onPress={() => navigateTo(`/editphone`)}
              style={{
                paddingLeft: 16,
                paddingBottom: 10,
                paddingTop: 10,
                paddingRight: 16,
                marginRight: -16,
              }}>
              <Image source={editIcon as any} style={{width: 19, height: 19}} />
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
              }}>
              <Image source={editIcon as any} style={{width: 19, height: 19}} />
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
              }}>
              <Image source={editIcon as any} style={{width: 19, height: 19}} />
            </TouchableOpacity>
          }
        />
      </TableViewGroup>
      <TableViewGroup
        header={intl.formatMessage({
          id: 'settings.communication.groupTitle',
        })}>
        <TableViewCell
          title={intl.formatMessage({
            id: 'settings.communication.newDocumentsNotifications',
          })}
          accessory={
            <Switch
              onValueChange={value => {
                updateDocumentNotifications(value);
                setDocumentNotifications(value);
              }}
              disabled={userProfile.loading && !userProfile.data}
              value={documentNotifications}
              thumbColor={Platform.select({android: theme.color.dark100})}
              trackColor={{
                false: theme.color.dark200,
                true: theme.color.blue400,
              }}
            />
          }
        />
        {/* <TableViewCell
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
        /> */}
      </TableViewGroup>
      <TableViewGroup
        header={intl.formatMessage({
          id: 'settings.accessibilityLayout.groupTitle',
        })}>
        <TableViewCell
          title={intl.formatMessage({
            id: 'settings.accessibilityLayout.sytemDarkMode',
          })}
          accessory={
            <Switch
              onValueChange={value => {
                setAppearanceMode(value ? 'automatic' : 'light');
              }}
              value={appearanceMode === 'automatic'}
              thumbColor={Platform.select({android: theme.color.dark100})}
              trackColor={{
                false: theme.color.dark200,
                true: theme.color.blue400,
              }}
            />
          }
        />
        <Pressable
          onPress={() => {
            clearTimeout(efficient.ts);
            efficient.count = (efficient.count ?? 0) + 1;
            if (efficient.count === 11) {
              setAppearanceMode('efficient');
            }
            efficient.ts = setTimeout(() => {
              efficient.count = 0;
            }, 500);
          }}>
          <TableViewCell
            title={intl.formatMessage({
              id: 'settings.accessibilityLayout.darkMode',
            })}
            accessory={
              <Switch
                onValueChange={value =>
                  setAppearanceMode(value ? 'dark' : 'light')
                }
                value={appearanceMode === 'dark'}
                thumbColor={Platform.select({android: theme.color.dark100})}
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
        })}>
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
            });
          }}>
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
            authenticationTypes.length === 0
              ? intl.formatMessage({
                  id: 'onboarding.biometrics.noAuthenticationTypes',
                })
              : isEnrolledBiometrics
              ? intl.formatMessage(
                  {
                    id: 'settings.security.useBiometricsDescription',
                  },
                  {biometricType: biometricType.text},
                )
              : intl.formatMessage(
                  {
                    id: 'onboarding.biometrics.notEnrolled',
                  },
                  {biometricType: biometricType.text},
                )
          }
          accessory={
            <Switch
              onValueChange={value => {
                if (value === true && !hasAcceptedBiometrics) {
                  authenticateAsync().then(authenticate => {
                    if (authenticate.success) {
                      setUseBiometrics(true);
                      preferencesStore.setState({hasAcceptedBiometrics: true});
                    }
                  });
                } else {
                  setUseBiometrics(value);
                }
              }}
              disabled={!isEnrolledBiometrics}
              value={useBiometrics}
              thumbColor={Platform.select({android: theme.color.dark100})}
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
                    style: 'decimal',
                    unitDisplay: 'long',
                    unit: 'second',
                  }),
                },
                {
                  id: '10000',
                  label: intl.formatNumber(10, {
                    style: 'decimal',
                    unitDisplay: 'long',
                    unit: 'second',
                  }),
                },
                {
                  id: '15000',
                  label: intl.formatNumber(15, {
                    style: 'decimal',
                    unitDisplay: 'long',
                    unit: 'second',
                  }),
                },
              ],
              cancel: true,
            }).then(res => {
              if (res.selectedItem) {
                const appLockTimeout = Number(res.selectedItem.id);
                preferencesStore.setState({appLockTimeout});
              }
            });
          }}>
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
                  style: 'decimal',
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
            );
          }}>
          <TableViewCell
            title={intl.formatMessage({id: 'settings.security.privacyTitle'})}
            subtitle={intl.formatMessage({
              id: 'settings.security.privacySubTitle',
            })}
          />
        </PressableHighlight>
      </TableViewGroup>
      <TableViewGroup
        header={intl.formatMessage({id: 'settings.about.groupTitle'})}>
        <TableViewCell
          title={intl.formatMessage({id: 'settings.about.versionLabel'})}
          subtitle={`${DeviceInfo.getVersion()} build ${DeviceInfo.getBuildNumber()}`}
        />
        <PressableHighlight
          onPress={() => {
            setLoadingCP(true);
            CodePush.sync(
              {
                installMode: CodePush.InstallMode.IMMEDIATE,
              },
              status => {
                switch (status) {
                  case CodePush.SyncStatus.UP_TO_DATE:
                    return RNAlert.alert('Up to date', 'The app is up to date');
                  case CodePush.SyncStatus.UPDATE_INSTALLED:
                    return RNAlert.alert(
                      'Update installed',
                      'The app has been updated',
                    );
                  case CodePush.SyncStatus.UPDATE_IGNORED:
                    return RNAlert.alert(
                      'Update cancelled',
                      'The update was cancelled',
                    );
                  case CodePush.SyncStatus.UNKNOWN_ERROR:
                    return RNAlert.alert(
                      'Unknown error',
                      'An unknown error occurred',
                    );
                }
              },
            ).finally(() => {
              setLoadingCP(false);
            });
          }}>
          <TableViewCell
            title={intl.formatMessage({id: 'settings.about.codePushLabel'})}
            subtitle={
              loadingCP
                ? intl.formatMessage({id: 'settings.about.codePushLoading'})
                : !localPackage
                ? intl.formatMessage({id: 'settings.about.codePushUpToDate'})
                : `${localPackage?.label}`
            }
          />
        </PressableHighlight>
        <PressableHighlight
          onPress={onLogoutPress}
          testID={testIDs.USER_SETTINGS_LOGOUT_BUTTON}>
          <TableViewCell
            title={intl.formatMessage({id: 'settings.about.logoutLabel'})}
            subtitle={intl.formatMessage({
              id: 'settings.about.logoutDescription',
            })}
          />
        </PressableHighlight>
      </TableViewGroup>
    </ScrollView>
  );
}
