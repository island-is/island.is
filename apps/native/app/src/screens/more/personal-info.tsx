import { NavigationBarSheet } from '@ui'
import React from 'react'
import { useIntl } from 'react-intl'
import { View } from 'react-native'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { testIDs } from '../../utils/test-ids'
import { PersonalInfoContent } from './personal-info-content'

const { getNavigationOptions, useNavigationOptions } =
  createNavigationOptionHooks(() => ({
    topBar: {
      visible: false,
    },
  }))

export const PersonalInfoScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  useNavigationOptions(componentId)
  const intl = useIntl()
  return (
    <View style={{ flex: 1 }} testID={testIDs.SCREEN_PERSONAL_INFO}>
      <NavigationBarSheet
        componentId={componentId}
        title={intl.formatMessage({ id: 'personalInfo.screenTitle' })}
        onClosePress={() => Navigation.dismissModal(componentId)}
        style={{ marginHorizontal: 16 }}
      />
      <PersonalInfoContent />
    </View>
  )
}

PersonalInfoScreen.options = getNavigationOptions
