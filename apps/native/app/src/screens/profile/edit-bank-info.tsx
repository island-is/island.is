

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

export const EditBankInfoScreen: NavigationFunctionComponent = ({ componentId }) => {
  useNavigationOptions(componentId)
  const intl = useIntl()

  // todo data bind default state
  const [banktext, onChangeBankText] = React.useState("0307");
  const [booktext, onChangeBookText] = React.useState("26");
  const [numbertext, onChangeNumberText] = React.useState("002329");


  return (
    <View style={{ flex: 1 }} testID={testIDs.SCREEN_EDIT_BANK_INFO}>
      <NavigationBarSheet
        componentId={componentId}
        title={intl.formatMessage({ id: 'edit.bankinfo.screenTitle' })}
        onClosePress={() => Navigation.dismissModal(componentId)}
        style={{ marginHorizontal: 16 }}
      />
      <ScrollView style={{ flex: 1 }} >
        <View style={{ paddingHorizontal: 16 }}>
          <View style={{ marginBottom: 32, marginTop: 8}}>
            <Typography>{intl.formatMessage({ id: 'edit.bankinfo.description' })}</Typography>
          </View>
          <View style={{ marginBottom: 24, flexDirection: 'row' }}>
            <TextField style={{ marginRight: 8, width: 90 }} label={intl.formatMessage({ id: 'edit.bankinfo.inputlabel.bank' })} value={banktext} onChange={onChangeBankText} />
            <TextField style={{ marginRight: 8, width: 70 }} label={intl.formatMessage({ id: 'edit.bankinfo.inputlabel.book' })} value={booktext} onChange={onChangeBookText} />
            <TextField style={{ flexGrow: 1 }} label={intl.formatMessage({ id: 'edit.bankinfo.inputlabel.number' })} value={numbertext} onChange={onChangeNumberText} />
          </View>
          <Button title={intl.formatMessage({ id: 'edit.bankinfo.button' })} onPress={() => navigateTo('/editconfirm/bankinfo')} />
        </View>
      </ScrollView>
    </View>
  )
}

EditBankInfoScreen.options = getNavigationOptions
