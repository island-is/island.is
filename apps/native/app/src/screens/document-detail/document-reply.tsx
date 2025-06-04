import React from 'react'
import { useIntl } from 'react-intl'
import { SafeAreaView } from 'react-native'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'

import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { NavigationBarSheet, Problem } from '../../ui'

const { getNavigationOptions, useNavigationOptions } =
  createNavigationOptionHooks(() => ({
    topBar: {
      visible: false,
    },
  }))

export const DocumentReplyScreen: NavigationFunctionComponent = ({
  componentId,
  ...rest
}) => {
  useNavigationOptions(componentId)
  const intl = useIntl()
  console.log(rest)
  return (
    <>
      <NavigationBarSheet
        componentId={componentId}
        title={intl.formatMessage({ id: 'notifications.screenTitle' })}
        onClosePress={() => Navigation.dismissModal(componentId)}
        showLoading={true}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <Problem type="error" withContainer />
      </SafeAreaView>
    </>
  )
}

DocumentReplyScreen.options = getNavigationOptions
