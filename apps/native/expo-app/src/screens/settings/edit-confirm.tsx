import React from 'react'
import { useIntl } from 'react-intl'
import { Alert, ScrollView, View } from 'react-native'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'

import {
  Button,
  CancelButton,
  NavigationBarSheet,
  TextField,
  Typography,
} from '../../ui'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { testIDs } from '../../utils/test-ids'
import { useUpdateUserProfile } from './utils/profile-queries'

const { getNavigationOptions, useNavigationOptions } =
  createNavigationOptionHooks(() => ({
    topBar: {
      visible: false,
    },
  }))

export const EditConfirmScreen: NavigationFunctionComponent<any> = ({
  componentId,
  parentComponentId,
  type,
  email,
  phone,
}) => {
  useNavigationOptions(componentId)
  const intl = useIntl()
  const [text, onChangeText] = React.useState('')
  const { updateUserProfile } = useUpdateUserProfile()
  const disabled = text?.trim().length < 3
  const [loading, setLoading] = React.useState(false)

  const handleConfirm = async () => {
    let input: any = {}
    setLoading(true)
    if (type === 'email') {
      input = { email: email, emailCode: text }
    } else if (type === 'phone') {
      input = { mobilePhoneNumber: phone, smsCode: text }
    }
    try {
      const res = await updateUserProfile(input)
      if (res.data?.updateProfile) {
        Navigation.dismissModal(componentId)
        if (parentComponentId) {
          Navigation.dismissModal(parentComponentId)
        }
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (e) {
      Alert.alert(
        intl.formatMessage({ id: 'edit.confirm.error' }),
        intl.formatMessage({ id: 'edit.confirm.errorMessage' }),
      )
    }
    setLoading(false)
  }

  return (
    <View style={{ flex: 1 }} testID={testIDs.SCREEN_EDIT_CONFIRM}>
      <NavigationBarSheet
        componentId={componentId}
        title={intl.formatMessage({ id: 'edit.confirm.screenTitle' })}
        onClosePress={() => Navigation.dismissModal(componentId)}
        style={{ marginHorizontal: 16 }}
      />
      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
        <View style={{ paddingHorizontal: 16 }}>
          <View style={{ marginBottom: 32, marginTop: 8 }}>
            <Typography>
              {intl.formatMessage(
                { id: 'edit.confirm.description' },
                { type: type },
              )}
            </Typography>
          </View>
          <View style={{ marginBottom: 16 }}>
            <TextField
              label={intl.formatMessage({ id: 'edit.confirm.inputlabel' })}
              value={text}
              onChange={onChangeText}
              placeholder="000"
              maxLength={3}
              autoFocus
              keyboardType="number-pad"
              textContentType="oneTimeCode"
            />
          </View>
          <Button
            title={intl.formatMessage({ id: 'edit.confirm.button' })}
            onPress={() => {
              handleConfirm()
            }}
            style={{
              marginBottom: 24,
            }}
            disabled={disabled || loading}
          />
          <View style={{ alignItems: 'center' }}>
            <CancelButton
              title={intl.formatMessage({ id: 'edit.cancel.button' })}
              onPress={() => Navigation.dismissModal(componentId)}
              isSmall
            />
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

EditConfirmScreen.options = getNavigationOptions
