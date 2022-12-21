

import { Button, NavigationBarSheet, TextField, Typography } from '@island.is/island-ui-native'
import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'
import { useThemedNavigationOptions } from '../../hooks/use-themed-navigation-options'
import { useIntl } from 'react-intl'
import { testIDs } from '../../utils/test-ids'
import { navigateTo } from '../../lib/deep-linking'

const {
  getNavigationOptions,
  useNavigationOptions,
} = useThemedNavigationOptions(() => ({
  topBar: {
    visible: false,
  },
}))

export const EditEmailScreen: NavigationFunctionComponent = ({ componentId }) => {
  useNavigationOptions(componentId)
  const intl = useIntl()

  // todo data bind default state
  const [text, onChangeText] = React.useState("bjarni@enum.is");
  return (
    <View style={{ flex: 1 }} testID={testIDs.SCREEN_EDIT_EMAIL}>
      <NavigationBarSheet
        componentId={componentId}
        title={intl.formatMessage({ id: 'edit.email.screenTitle' })}
        onClosePress={() => Navigation.dismissModal(componentId)}
        style={{ marginHorizontal: 16 }}
      />
      <ScrollView style={{ flex: 1 }} >
        <View style={{ paddingHorizontal: 16 }}>
          <View style={{ marginBottom: 32, marginTop: 8}}>
            <Typography>{intl.formatMessage({ id: 'edit.email.description' })}</Typography>
          </View>
          <View style={{ marginBottom: 24 }}>
            <TextField label={intl.formatMessage({ id: 'edit.email.inputlabel' })} value={text} onChange={onChangeText} />
          </View>
          <Button title={intl.formatMessage({ id: 'edit.email.button' })} onPress={() => navigateTo('/editconfirm/email')} />
        </View>
      </ScrollView>
    </View>
  )
}

EditEmailScreen.options = getNavigationOptions
