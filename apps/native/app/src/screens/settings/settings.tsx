import React, { useEffect, useRef, useState } from 'react'
import {
  ScrollView,
  Switch,
  View,
  TouchableHighlight,
} from 'react-native'
import SegmentedControl from '@react-native-segmented-control/segmented-control'
import { NATION_REGISTRY_USER_QUERY } from '../../graphql/queries/national-registry-user.query'
import { useTheme } from 'styled-components/native'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'
import { useAuthStore } from '../../stores/auth-store'
import { testIDs } from '../../utils/test-ids'
import { getAppRoot } from '../../utils/lifecycle/get-app-root'
import { TableViewGroup } from '../../components/tableview/tableview-group'
import { TableViewCell } from '../../components/tableview/tableview-cell'
import { usePreferencesStore } from '../../stores/preferences-store'
import { useIntl } from '../../utils/intl'
import { TabBar } from '../../components/tab-bar/tab-bar'
import styled from 'styled-components/native'
import { useQuery } from '@apollo/client'
import { client } from '../../graphql/client'
import { Platform } from 'react-native'
import { Animated } from 'react-native'
import { Dimensions } from 'react-native'
import { ComponentRegistry } from '../../utils/navigation-registry'

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
  font-size: 12px;
  line-height: 16px;
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
  const ar = useRef<Animated.CompositeAnimation>()
  const aw = useRef(Dimensions.get('window').width)
  const av = useRef(new Animated.Value(0))

  const offset = 64
  const animate = () => {
    ar.current = Animated.timing(av.current, {
      duration: 1660,
      toValue: aw.current + offset,
      useNativeDriver: true,
    })
    ar.current.start(() => {
      av.current.setValue(-(aw.current + offset))
      animate()
    })
  }

  useEffect(() => {
    animate()
    return () => {
      if (ar.current) {
        ar.current.stop()
      }
    }
  }, [])

  return (
    <InputHost>
      <InputContent>
        <InputLabel>{label}</InputLabel>
        {loading ? (
          <InputLoading
            onLayout={(e) => {
              aw.current = e.nativeEvent.layout.width
            }}
          >
            <InputLoadingOverlay
              style={{
                opacity: 1,
                transform: [{ translateX: av.current }, { rotate: '5deg' }],
              }}
            />
          </InputLoading>
        ) : (
          <InputValue>{value ?? ''}</InputValue>
        )}
      </InputContent>
    </InputHost>
  )
}

function formatNationalId(str: string = '') {
  return [str.substr(0, 6), str.substr(6, 4)].join('-')
}

export const SettingsScreen: NavigationFunctionComponent = () => {
  const authStore = useAuthStore()
  const intl = useIntl()
  const theme = useTheme()
  const {
    locale,
    setLocale,
    appearanceMode,
    setAppearanceMode,
  } = usePreferencesStore()

  // switch states
  const [tab, setTab] = useState(0)
  const [darkMode, setDarkMode] = useState(appearanceMode === 'dark')
  const [notificationsNewDocuments, setNotificationsNewDocuments] = useState(
    false,
  )

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
      <TabBar
        values={[
          intl.formatMessage({ id: 'settings.tabs.personalInfo' }),
          intl.formatMessage({ id: 'settings.tabs.preferences' })
        ]}
        onChange={(selectedIndex) => setTab(selectedIndex)}
        selectedIndex={tab}
      />
      {tab === 1 ? (
        <ScrollView style={{ flex: 1, paddingTop: 32 }}>
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
                />
              }
            />
            <TableViewCell
              title={intl.formatMessage({
                id: 'settings.communication.appUpdatesNotifications',
              })}
              accessory={<Switch onValueChange={() => {}} value={false} />}
            />
            <TableViewCell
              title={intl.formatMessage({
                id: 'settings.communication.applicationsNotifications',
              })}
              accessory={<Switch onValueChange={() => {}} value={false} />}
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
                <Switch onValueChange={setDarkMode} value={darkMode} />
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
          <TableViewGroup header="Annað">
            <TouchableHighlight
              onPress={onLogoutPress}
              underlayColor={theme.color.blue100}
            >
              <TableViewCell title="Útskrá" />
            </TouchableHighlight>
          </TableViewGroup>
        </ScrollView>
      ) : (
        <ScrollView
          style={{ flex: 1, flexDirection: 'column', paddingTop: 32 - 24 }}
        >
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
