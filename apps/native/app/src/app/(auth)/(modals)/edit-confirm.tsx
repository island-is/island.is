import { router, useLocalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { Alert, ScrollView, View } from 'react-native'

import { useUpdateUserProfile } from './_hooks/use-update-user-profile'
import {
  Button,
  CancelButton,
  NavigationBarSheet,
  TextField,
  Typography,
} from '@/ui'
import { testIDs } from '@/utils/test-ids'

export default function EditConfirmScreen() {
  const intl = useIntl()
  const { type, email, phone } = useLocalSearchParams<{
    type: 'phone' | 'email'
    email?: string
    phone?: string
  }>()
  const [text, onChangeText] = useState('')
  const { updateUserProfile } = useUpdateUserProfile()
  const disabled = text.trim().length < 3
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    const input =
      type === 'email'
        ? { email, emailCode: text }
        : { mobilePhoneNumber: phone, smsCode: text }

    setLoading(true)
    try {
      const res = await updateUserProfile(input)
      if (res.data?.updateProfile) {
        // Dismiss both confirm and the parent edit screen
        router.dismiss(2)
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
    <ScrollView
      style={{ flex: 1 }}
      keyboardShouldPersistTaps="handled"
      testID={testIDs.SCREEN_EDIT_CONFIRM}
      stickyHeaderIndices={[0]}
    >
      <NavigationBarSheet
        componentId="edit-confirm"
        title={intl.formatMessage({ id: 'edit.confirm.screenTitle' })}
        onClosePress={() => router.back()}
        style={{ marginHorizontal: 16 }}
      />
      <View style={{ paddingHorizontal: 16 }}>
        <View style={{ marginBottom: 32, marginTop: 8 }}>
          <Typography>
            {intl.formatMessage({ id: 'edit.confirm.description' }, { type })}
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
          onPress={handleConfirm}
          style={{ marginBottom: 24 }}
          disabled={disabled || loading}
        />
        <View style={{ alignItems: 'center' }}>
          <CancelButton
            title={intl.formatMessage({ id: 'edit.cancel.button' })}
            onPress={() => router.back()}
            isSmall
          />
        </View>
      </View>
    </ScrollView>
  )
}
