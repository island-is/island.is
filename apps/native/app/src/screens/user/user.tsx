import { NavigationBarSheet, TabBar } from '@island.is/island-ui-native'
import React, { useState } from 'react'
import { View } from 'react-native'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'
import { useThemedNavigationOptions } from '../../hooks/use-themed-navigation-options'
import { useIntl } from '../../lib/intl'
import { testIDs } from '../../utils/test-ids'
import { TabPersonalInfo } from './tab-personal-info'
import { TabSettings } from './tab-settings'

const {
  getNavigationOptions,
  useNavigationOptions,
} = useThemedNavigationOptions(() => ({
  topBar: {
    visible: false,
  },
}))

export const UserScreen: NavigationFunctionComponent = ({ componentId }) => {
  useNavigationOptions(componentId)
  const intl = useIntl()
  const [tab, setTab] = useState(0)
  return (
    <View style={{ flex: 1 }} testID={testIDs.SCREEN_USER}>
      <NavigationBarSheet
        componentId={componentId}
        title={intl.formatMessage({ id: 'user.screenTitle' })}
        onClosePress={() => Navigation.dismissModal(componentId)}
        style={{ marginHorizontal: 16 }}
      />
      <TabBar
        values={[
          {
            testID: testIDs.USER_TABBAR_TAB_PROFILE_INFO,
            label: intl.formatMessage({ id: 'user.tabs.personalInfo' }),
          },
          {
            testID: testIDs.USER_TABBAR_TAB_SETTINGS,
            label: intl.formatMessage({ id: 'user.tabs.preferences' }),
          },
        ]}
        onChange={(selectedIndex) => setTab(selectedIndex)}
        selectedIndex={tab}
      />
      {tab === 0 && <TabPersonalInfo />}
      {tab === 1 && <TabSettings />}
    </View>
  )
}

UserScreen.options = getNavigationOptions
