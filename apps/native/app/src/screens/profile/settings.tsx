import { NavigationBarSheet } from '@island.is/island-ui-native'
import React from 'react'
import { View } from 'react-native'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'
import { useThemedNavigationOptions } from '../../hooks/use-themed-navigation-options'
import { useIntl } from 'react-intl'
import { testIDs } from '../../utils/test-ids'

import { TabSettings } from './tab-settings'

const {
  getNavigationOptions,
  useNavigationOptions,
} = useThemedNavigationOptions(() => ({
  topBar: {
    visible: false,
  },
}))

export const SettingsScreen: NavigationFunctionComponent = ({ componentId }) => {
  useNavigationOptions(componentId)
  const intl = useIntl()
  return (
    <View style={{ flex: 1 }} testID={testIDs.SCREEN_SETTINGS}>
      <NavigationBarSheet
        componentId={componentId}
        title={intl.formatMessage({ id: 'setting.screenTitle' })}
        onClosePress={() => Navigation.dismissModal(componentId)}
        style={{ marginHorizontal: 16 }}
      />
      <TabSettings />
    </View>
  )
}

SettingsScreen.options = getNavigationOptions
