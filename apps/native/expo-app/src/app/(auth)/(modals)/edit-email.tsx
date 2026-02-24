import { useApolloClient } from '@apollo/client'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { Alert, ScrollView, View } from 'react-native'

import {
  CreateEmailVerificationDocument,
  CreateEmailVerificationMutation,
  CreateEmailVerificationMutationVariables,
  DeleteIslykillValueDocument,
  DeleteIslykillValueMutation,
  DeleteIslykillValueMutationVariables,
  GetProfileDocument,
  useGetProfileQuery,
} from '@/graphql/types/schema'
import { Button, NavigationBarSheet, TextField, Typography } from '@/ui'
import { testIDs } from '@/utils/test-ids'

export default function EditEmailScreen() {
  const client = useApolloClient()
  const intl = useIntl()
  const [loading, setLoading] = useState(false)
  const userProfile = useGetProfileQuery()
  const [text, onChangeText] = useState('')

  const originalEmail = userProfile.data?.getUserProfile?.email ?? ''
  const isEmpty = text.trim() === ''
  const disabled = text.trim() === originalEmail.trim()

  useEffect(() => {
    if (userProfile.data?.getUserProfile?.email) {
      onChangeText(userProfile.data.getUserProfile.email)
    }
  }, [userProfile.data])

  const onPress = async () => {
    setLoading(true)
    try {
      if (isEmpty) {
        const res = await client.mutate<
          DeleteIslykillValueMutation,
          DeleteIslykillValueMutationVariables
        >({
          mutation: DeleteIslykillValueDocument,
          variables: { input: { email: true } },
          refetchQueries: [GetProfileDocument],
        })
        if (res.data) {
          router.back()
        } else {
          throw new Error('Failed to delete email')
        }
      } else {
        const res = await client.mutate<
          CreateEmailVerificationMutation,
          CreateEmailVerificationMutationVariables
        >({
          mutation: CreateEmailVerificationDocument,
          variables: { input: { email: text } },
        })
        if (res.data) {
          router.push({
            pathname: '/edit-confirm',
            params: {
              type: 'email',
              email: text,
            },
          })
        } else {
          throw new Error('Failed to create email verification')
        }
      }
    } catch (e) {
      Alert.alert(
        intl.formatMessage({ id: 'edit.email.error' }),
        intl.formatMessage({ id: 'edit.email.errorMessage' }),
      )
    }
    setLoading(false)
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      keyboardShouldPersistTaps="handled"
      testID={testIDs.SCREEN_EDIT_EMAIL}
      stickyHeaderIndices={[0]}
    >
      <NavigationBarSheet
        componentId="edit-email"
        title={intl.formatMessage({ id: 'edit.email.screenTitle' })}
        onClosePress={() => router.back()}
        style={{ marginHorizontal: 16 }}
        showLoading={userProfile.loading && !!userProfile.data}
      />
      <View style={{ paddingHorizontal: 16 }}>
        <View style={{ marginBottom: 32, marginTop: 8 }}>
          <Typography>
            {intl.formatMessage({ id: 'edit.email.description' })}
          </Typography>
        </View>
        <View style={{ marginBottom: 24 }}>
          <TextField
            label={intl.formatMessage({ id: 'edit.email.inputlabel' })}
            value={text}
            onChange={onChangeText}
            autoFocus
            keyboardType="email-address"
            textContentType="emailAddress"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
          />
        </View>
        <Button
          title={
            isEmpty
              ? intl.formatMessage({ id: 'edit.email.button.empty' })
              : intl.formatMessage({ id: 'edit.email.button' })
          }
          onPress={onPress}
          disabled={disabled || loading}
        />
      </View>
    </ScrollView>
  )
}
