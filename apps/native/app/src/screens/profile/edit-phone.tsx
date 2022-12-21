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

export const EditPhoneScreen: NavigationFunctionComponent = ({ componentId }) => {
  useNavigationOptions(componentId)
  const intl = useIntl()

  // todo data bind default state
  const [text, onChangeText] = React.useState("867-2009");
  return (
    <View style={{ flex: 1 }} testID={testIDs.SCREEN_EDIT_PHONE}>
      <NavigationBarSheet
        componentId={componentId}
        title={intl.formatMessage({ id: 'edit.phone.screenTitle' })}
        onClosePress={() => Navigation.dismissModal(componentId)}
        style={{ marginHorizontal: 16 }}
      />
      <ScrollView style={{ flex: 1 }} >
        <View style={{ paddingHorizontal: 16 }}>
          <View style={{ marginBottom: 32, marginTop: 8}}>
            <Typography>{intl.formatMessage({ id: 'edit.phone.description' })}</Typography>
          </View>
          <View style={{ marginBottom: 24 }}>
            <TextField label={intl.formatMessage({ id: 'edit.phone.inputlabel' })} value={text} onChange={onChangeText} />
          </View>
          <Button title={intl.formatMessage({ id: 'edit.phone.button' })} onPress={() => navigateTo('/editconfirm/phone')} />
        </View>
      </ScrollView>
    </View>
  )
}

EditPhoneScreen.options = getNavigationOptions
