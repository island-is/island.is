import React, { useEffect, useRef, useState } from 'react'
import {
  ScrollView,
  Switch,
  View,
  TouchableHighlight,
  Platform,
  Animated
} from 'react-native'
import SegmentedControl from '@react-native-segmented-control/segmented-control'
import { useTheme } from 'styled-components/native'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'
import styled from 'styled-components/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useQuery } from '@apollo/client'
import CodePush, { LocalPackage } from '../../../../node_modules/react-native-code-push';
import { NATION_REGISTRY_USER_QUERY } from '../../graphql/queries/national-registry-user.query'
import { useAuthStore } from '../../stores/auth-store'
import { testIDs } from '../../utils/test-ids'
import { getAppRoot } from '../../utils/lifecycle/get-app-root'
import { TableViewGroup } from '../../components/tableview/tableview-group'
import { TableViewCell } from '../../components/tableview/tableview-cell'
import { usePreferencesStore } from '../../stores/preferences-store'
import { useIntl } from '../../utils/intl'
import { TabBar } from '../../components/tab-bar/tab-bar'
import { client } from '../../graphql/client'
import { Skeleton } from '../../components/skeleton/skeleton'
import { NavigationBarSheet } from '../../components/navigation-bar-sheet/navigation-bar-sheet'
import { config } from '../../utils/config'


const InputHost = styled.SafeAreaView`
  flex: 1;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.color.blue100};
  margin-left: 16px;
  margin-right: 16px;
`

const InputContent = styled.View`
  padding-top: 24px;
  padding-bottom: 24px;
`

const InputLabel = styled.Text`
  font-family: 'IBMPlexSans';
  font-size: 13px;
  line-height: 17px;
  color: ${(props) => props.theme.color.dark400};
  margin-bottom: 8px;
`

const InputValue = styled.Text`
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 16px;
  line-height: 20px;
  color: ${(props) => props.theme.color.dark400};
`

const InputRow = styled.View`
  flex-direction: row;
`

const InputLoading = styled.View`
  height: 20px;
  width: 100%;
  background-color: ${(props) => props.theme.color.dark100};
  overflow: hidden;
`

const InputLoadingOverlay = styled(Animated.View)`
  position: absolute;
  top: -30px;
  left: 0px;
  height: 20px;
  width: 50%;
  background-color: ${(props) => props.theme.color.dark100};
  box-shadow: 0px 25px 25px ${(props) => props.theme.color.dark200};
`

function Input({
  label,
  value,
  loading,
}: {
  label: string
  value?: string
  loading?: boolean
}) {
  return (
    <InputHost>
      <InputContent>
        <InputLabel>{label}</InputLabel>
        {loading ? (
          <Skeleton active />
        ) : (
          <InputValue>{value ?? ''}</InputValue>
        )}
      </InputContent>
    </InputHost>
  )
}

const InfoMessage = styled.View`
  background-color: ${props => props.theme.color.blue100};
`;

const InfoMessageText = styled.Text`
  background-color: ${props => props.theme.color.blue100};
  padding: 27px 0px;
  font-family: 'IBMPlexSans';
  font-size: 13px;
  line-height: 17px;
`;

function formatNationalId(str: string = '') {
  return [str.substr(0, 6), str.substr(6, 4)].join('-')
}

export const SettingsScreen: NavigationFunctionComponent = ({ componentId }) => {
  const authStore = useAuthStore()
  const intl = useIntl()
  const theme = useTheme()
  const {
    locale,
    setLocale,
    appearanceMode,
    setAppearanceMode,
  } = usePreferencesStore()

  const [loadingCP, setLoadingCP] = useState(false);
  const [localPackage, setLocalPackage] = useState<LocalPackage | null>(null);

  // switch states
  const [tab, setTab] = useState(0)
  const [darkMode, setDarkMode] = useState(appearanceMode === 'dark')
  const [notificationsNewDocuments, setNotificationsNewDocuments] = useState(
    false,
  )
  const [appUpdatesNotifications, setAppUpdatesNotifications] = useState(false);
  const [applicationsNotifications, setApplicationsNotifications] = useState(false);

  const onLogoutPress = async () => {
    await authStore.logout()
    await Navigation.dismissAllModals()
    Navigation.setRoot({
      root: await getAppRoot(),
    })
  }

  useEffect(() => {
    const updatedMode = darkMode ? 'dark' : 'light'
    if (appearanceMode !== updatedMode) {
      setAppearanceMode(updatedMode)
    }
  }, [darkMode])

  useEffect(() => {
    setLoadingCP(true);
    CodePush.getUpdateMetadata().then(p => {
      setLoadingCP(false);
      setLocalPackage(p);
    });
  }, []);


  const natRegRes = useQuery(NATION_REGISTRY_USER_QUERY, { client })
  const natRegData = natRegRes?.data?.nationalRegistryUser || {}
  const loadingNatReg = natRegRes.loading;

  return (
    <View
      style={{
        flex: 1,
      }}
      testID={testIDs.SCREEN_USER}
    >
      <NavigationBarSheet
        title={intl.formatMessage({ id: 'settings.screenTitle' })}
        onClosePress={() => Navigation.dismissModal(componentId)}
        style={{ marginHorizontal: 16 }}
      />
      <TabBar
        values={[
          intl.formatMessage({ id: 'settings.tabs.personalInfo' }),
          intl.formatMessage({ id: 'settings.tabs.preferences' })
        ]}
        onChange={(selectedIndex) => setTab(selectedIndex)}
        selectedIndex={tab}
      />
      {tab === 1 ? (
        <ScrollView style={{ flex: 1 }}>
          <InfoMessage style={{ marginBottom: 32 }}>
            <SafeAreaView style={{ marginHorizontal: 16 }}>
              <InfoMessageText>Stillingar á virkni og útliti appsins</InfoMessageText>
            </SafeAreaView>
          </InfoMessage>
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
                  trackColor={{
                    false: theme.color.dark200,
                    true: theme.color.blue400
                  }}
                />
              }
            />
            <TableViewCell
              title={intl.formatMessage({
                id: 'settings.communication.appUpdatesNotifications',
              })}
              accessory={<Switch
                onValueChange={setAppUpdatesNotifications}
                value={appUpdatesNotifications}
                trackColor={{
                  false: theme.color.dark200,
                  true: theme.color.blue400
                }}
                />}
            />
            <TableViewCell
              title={intl.formatMessage({
                id: 'settings.communication.applicationsNotifications',
              })}
              accessory={<Switch
                onValueChange={setApplicationsNotifications}
                value={applicationsNotifications}
                trackColor={{
                  false: theme.color.dark200,
                  true: theme.color.blue400
                }}/>}
            />
          </TableViewGroup>
          <TableViewGroup
            header={intl.formatMessage({
              id: 'settings.accessibilityLayout.groupTitle',
            })}
          >
            <TableViewCell
              title={intl.formatMessage({
                id: 'settings.accessibilityLayout.darkMode',
              })}
              accessory={
                <Switch onValueChange={setDarkMode} value={darkMode}
                trackColor={{
                  false: theme.color.dark200,
                  true: theme.color.blue400
                }} />
              }
            />
            <TableViewCell
              title={intl.formatMessage({
                id: 'settings.accessibilityLayout.language',
              })}
              bottom={
                Platform.OS === 'ios' ? (
                  <SegmentedControl
                    values={['Íslenska', 'English']}
                    selectedIndex={locale === 'is-IS' ? 0 : 1}
                    style={{ marginTop: 16 }}
                    appearance="light"
                    onChange={(event) => {
                      const { selectedSegmentIndex } = event.nativeEvent
                      setLocale(selectedSegmentIndex === 0 ? 'is-IS' : 'en-US')
                    }}
                    activeFontStyle={{
                      fontFamily: 'IBMPlexSans-SemiBold',
                      color: theme.color.blue400,
                    }}
                    fontStyle={{
                      fontFamily: 'IBMPlexSans',
                    }}
                    backgroundColor={theme.color.blue100}
                  />
                ) : null
              }
            />
          </TableViewGroup>
          <TableViewGroup header="About">
            <TableViewCell
              title="Version"
              subtitle={`${config.constants.nativeAppVersion} build ${config.constants.nativeBuildVersion} ${config.constants.debugMode ? '(debug)' : ''}`}
            />
            <TableViewCell
              title="Codepush"
              subtitle={loadingCP ? 'Loading...' : !localPackage ? 'N/A: Using native bundle' : `${localPackage?.label}: ${localPackage.packageHash}`}
            />
            <TouchableHighlight
              onPress={onLogoutPress}
              underlayColor={theme.color.blue100}
            >
              <TableViewCell title="Logout" subtitle="You will be signed out of the app." />
            </TouchableHighlight>
          </TableViewGroup>
        </ScrollView>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
        >
          <InfoMessage>
            <SafeAreaView style={{ marginHorizontal: 16 }}>
              <InfoMessageText>
                Þín skráning í Þjóðskrá Íslands
              </InfoMessageText>
            </SafeAreaView>
          </InfoMessage>
          <Input
            loading={loadingNatReg}
            label={intl.formatMessage({ id: 'settings.natreg.displayName' })}
            value={natRegData?.fullName}
          />
          <InputRow>
            <Input
              loading={loadingNatReg}
              label={intl.formatMessage({ id: 'settings.natreg.nationalId' })}
              value={
                !loadingNatReg
                  ? formatNationalId(String(natRegData.nationalId))
                  : undefined
              }
            />
            <Input
              loading={loadingNatReg}
              label={intl.formatMessage({ id: 'settings.natreg.birthPlace' })}
              value={natRegData?.birthPlace}
            />
          </InputRow>
          <Input
            loading={loadingNatReg}
            label={intl.formatMessage({ id: 'settings.natreg.legalResidence' })}
            value={natRegData?.legalResidence}
          />
          <InputRow>
            <Input
              loading={loadingNatReg}
              label={intl.formatMessage({ id: 'settings.natreg.gender' })}
              value={
                !loadingNatReg
                  ? intl.formatMessage(
                      { id: 'settings.natreg.genderValue' },
                      natRegData,
                    )
                  : undefined
              }
            />
            <Input
              loading={loadingNatReg}
              label={intl.formatMessage({
                id: 'settings.natreg.maritalStatus',
              })}
              value={
                !loadingNatReg
                  ? intl.formatMessage(
                      { id: 'settings.natreg.maritalStatusValue' },
                      natRegData,
                    )
                  : undefined
              }
            />
          </InputRow>
          <Input
            loading={loadingNatReg}
            label={intl.formatMessage({ id: 'settings.natreg.citizenship' })}
            value={authStore.userInfo?.nat}
          />
          <Input
            loading={loadingNatReg}
            label={intl.formatMessage({ id: 'settings.natreg.religion' })}
            value={natRegData?.religion}
          />
        </ScrollView>
      )}
    </View>
  )
}

SettingsScreen.options = {
  topBar: {
    visible: false,
  },
}
