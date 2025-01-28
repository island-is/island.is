import { useApolloClient } from '@apollo/client'
import React, { useEffect } from 'react'
import { useIntl } from 'react-intl'
import { Alert, ScrollView, View } from 'react-native'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'

import { Button, NavigationBarSheet, TextField, Typography } from '../../ui'
import {
  CreateEmailVerificationDocument,
  CreateEmailVerificationMutation,
  CreateEmailVerificationMutationVariables,
  DeleteIslykillValueDocument,
  DeleteIslykillValueMutation,
  DeleteIslykillValueMutationVariables,
  GetProfileDocument,
  useGetProfileQuery,
} from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { navigateTo } from '../../lib/deep-linking'
import { testIDs } from '../../utils/test-ids'

const { getNavigationOptions, useNavigationOptions } =
  createNavigationOptionHooks(() => ({
    topBar: {
      visible: false,
    },
  }))

export const EditEmailScreen: NavigationFunctionComponent<{
  email?: string
}> = ({ componentId, email }) => {
  useNavigationOptions(componentId)
  const client = useApolloClient()
  const intl = useIntl()
  const userProfile = useGetProfileQuery()
  const [loading, setLoading] = React.useState(false)
  const [text, onChangeText] = React.useState(email ?? '')

  const originalEmail = userProfile.data?.getUserProfile?.email ?? email ?? ''
  const isEmpty = text?.trim() === ''
  const disabled = text?.trim() === originalEmail?.trim()

  useEffect(() => {
    if (userProfile.data?.getUserProfile?.email) {
      onChangeText(userProfile.data?.getUserProfile?.email)
    }
  }, [userProfile])

  return (
    <View style={{ flex: 1 }} testID={testIDs.SCREEN_EDIT_EMAIL}>
      <NavigationBarSheet
        componentId={componentId}
        title={intl.formatMessage({ id: 'edit.email.screenTitle' })}
        onClosePress={() => Navigation.dismissModal(componentId)}
        style={{ marginHorizontal: 16 }}
      />
      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
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
            onPress={async () => {
              setLoading(true)
              try {
                if (isEmpty) {
                  const res = await client.mutate<
                    DeleteIslykillValueMutation,
                    DeleteIslykillValueMutationVariables
                  >({
                    mutation: DeleteIslykillValueDocument,
                    variables: {
                      input: {
                        email: true,
                      },
                    },
                    refetchQueries: [GetProfileDocument],
                  })
                  if (res.data) {
                    Navigation.dismissModal(componentId)
                  } else {
                    throw new Error('Failed to delete email')
                  }
                } else {
                  const res = await client.mutate<
                    CreateEmailVerificationMutation,
                    CreateEmailVerificationMutationVariables
                  >({
                    mutation: CreateEmailVerificationDocument,
                    variables: {
                      input: {
                        email: text,
                      },
                    },
                  })
                  if (res.data) {
                    navigateTo('/editconfirm/email', {
                      type: 'email',
                      email: text,
                      parentComponentId: componentId,
                    })
                  } else {
                    throw new Error('Failed to create sms verification')
                  }
                }
              } catch (e) {
                Alert.alert(
                  intl.formatMessage({ id: 'edit.email.error' }),
                  intl.formatMessage({ id: 'edit.email.errorMessage' }),
                )
              }
              setLoading(false)
            }}
            disabled={disabled || loading}
          />
        </View>
      </ScrollView>
    </View>
  )
}

EditEmailScreen.options = getNavigationOptions
