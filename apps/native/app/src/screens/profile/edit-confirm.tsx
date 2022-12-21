

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

const {
  getNavigationOptions,
  useNavigationOptions,
} = useThemedNavigationOptions(() => ({
  topBar: {
    visible: false,
  },
}))

export const EditConfirmScreen: NavigationFunctionComponent = ({ componentId }) => {
  useNavigationOptions(componentId)
  const intl = useIntl()
  const [text, onChangeText] = React.useState('');
  return (
    <View style={{ flex: 1 }} testID={testIDs.SCREEN_EDIT_CONFIRM}>
      <NavigationBarSheet
        componentId={componentId}
        title={intl.formatMessage({ id: 'edit.confirm.screenTitle' })}
        onClosePress={() => Navigation.dismissModal(componentId)}
        style={{ marginHorizontal: 16 }}
      />
      <ScrollView style={{ flex: 1 }} >
      <View style={{ paddingHorizontal: 16 }}>
          <View style={{ marginBottom: 32, marginTop: 8}}>
            <Typography>{intl.formatMessage({ id: 'edit.confirm.description' })}</Typography>
          </View>
          <View style={{ marginBottom: 24 }}>
            <TextField label={intl.formatMessage({ id: 'edit.confirm.inputlabel' })} value={text} onChange={onChangeText} />
          </View>
          <Button title={intl.formatMessage({ id: 'edit.confirm.button' })} onPress={() => Navigation.dismissModal(componentId)} />
        </View>
      </ScrollView>
    </View>
  )
}

EditConfirmScreen.options = getNavigationOptions
