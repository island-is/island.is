import { useApolloClient } from '@apollo/client'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { Alert, ScrollView, View } from 'react-native'

import {
  CreateSmsVerificationDocument,
  CreateSmsVerificationMutation,
  CreateSmsVerificationMutationVariables,
  DeleteIslykillValueDocument,
  DeleteIslykillValueMutation,
  DeleteIslykillValueMutationVariables,
  GetProfileDocument,
  useGetProfileQuery,
} from '@/graphql/types/schema'
import { Button, NavigationBarSheet, TextField, Typography } from '@/ui'
import { testIDs } from '@/utils/test-ids'

const parsePhone = (phone: string) =>
  phone
    .trim()
    .replace(/^\+354/, '')
    .replace(/-/g, '')

export default function EditPhoneScreen() {
  const client = useApolloClient()
  const intl = useIntl()
  const [loading, setLoading] = useState(false)
  const userProfile = useGetProfileQuery()
  const [text, onChangeText] = useState('')

  const originalPhone = parsePhone(
    userProfile.data?.getUserProfile?.mobilePhoneNumber ?? '',
  )

  const updatePhone = (value: string) => {
    let str = parsePhone(value)
    if (str.length > 3) {
      str = str.replace(/(\d{3})(\d{1,4})/, '$1-$2')
    }
    onChangeText(str)
  }

  useEffect(() => {
    if (userProfile.data?.getUserProfile?.mobilePhoneNumber) {
      updatePhone(userProfile.data.getUserProfile.mobilePhoneNumber)
    }
  }, [userProfile.data])

  const isEmpty = text.trim() === ''
  const disabled = parsePhone(text) === originalPhone

  const onPress = async () => {
    setLoading(true)
    try {
      if (isEmpty) {
        const res = await client.mutate<
          DeleteIslykillValueMutation,
          DeleteIslykillValueMutationVariables
        >({
          mutation: DeleteIslykillValueDocument,
          variables: { input: { mobilePhoneNumber: true } },
          refetchQueries: [GetProfileDocument],
        })
        if (res.data) {
          router.back()
        } else {
          throw new Error('Failed to delete phone number')
        }
      } else {
        const res = await client.mutate<
          CreateSmsVerificationMutation,
          CreateSmsVerificationMutationVariables
        >({
          mutation: CreateSmsVerificationDocument,
          variables: {
            input: { mobilePhoneNumber: text.replace(/-/g, '') },
          },
        })
        if (res.data) {
          router.push({
            pathname: '/(auth)/(modals)/edit-confirm',
            params: {
              type: 'phone',
              phone: `+354-${text.replace(/-/g, '')}`,
            },
          })
        } else {
          throw new Error('Failed to create sms verification')
        }
      }
    } catch (e) {
      Alert.alert(
        intl.formatMessage({ id: 'edit.phone.error' }),
        intl.formatMessage({ id: 'edit.phone.errorMessage' }),
      )
    }
    setLoading(false)
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      keyboardShouldPersistTaps="handled"
      testID={testIDs.SCREEN_EDIT_PHONE}
      stickyHeaderIndices={[0]}
    >
      <NavigationBarSheet
        componentId="edit-phone"
        title={intl.formatMessage({ id: 'edit.phone.screenTitle' })}
        onClosePress={() => router.back()}
        style={{ marginHorizontal: 16 }}
        showLoading={userProfile.loading && !!userProfile.data}
      />
      <View style={{ paddingHorizontal: 16 }}>
        <View style={{ marginBottom: 32, marginTop: 8 }}>
          <Typography>
            {intl.formatMessage({ id: 'edit.phone.description' })}
          </Typography>
        </View>
        <View style={{ marginBottom: 24 }}>
          <TextField
            label={intl.formatMessage({ id: 'edit.phone.inputlabel' })}
            value={text}
            onChange={updatePhone}
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
          />
        </View>
        <Button
          title={
            isEmpty
              ? intl.formatMessage({ id: 'edit.phone.button.empty' })
              : intl.formatMessage({ id: 'edit.phone.button' })
          }
          onPress={onPress}
          disabled={disabled || loading}
        />
      </View>
    </ScrollView>
  )
}
