import {
  Button,
  NavigationBarSheet,
  TextField,
  Typography,
} from '@island.is/island-ui-native'
import React, { useEffect } from 'react'
import { View, Text, ScrollView } from 'react-native'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'
import { useThemedNavigationOptions } from '../../hooks/use-themed-navigation-options'
import { useIntl } from 'react-intl'
import { testIDs } from '../../utils/test-ids'
import { navigateTo } from '../../lib/deep-linking'
import { useUpdateUserProfile, useUserProfile } from './profile-queries'
import { client } from '../../graphql/client'
import { CREATE_EMAIL_VERIFICATION } from '../../graphql/queries/create-email-verification.mutation'

const {
  getNavigationOptions,
  useNavigationOptions,
} = useThemedNavigationOptions(() => ({
  topBar: {
    visible: false,
  },
}))

export const EditEmailScreen: NavigationFunctionComponent<{
  email?: string
}> = ({ componentId, email }) => {
  useNavigationOptions(componentId)
  const intl = useIntl()
  const userProfile = useUserProfile()
  const [text, onChangeText] = React.useState(email ?? '')

  const originalEmail = userProfile.data?.getUserProfile?.email ?? email
  const disabled = text.trim() === originalEmail.trim() || text.trim() === ''

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
      <ScrollView style={{ flex: 1 }}>
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
              autoCompleteType="email"

            />
          </View>
          <Button
            title={intl.formatMessage({ id: 'edit.email.button' })}
            disabled={disabled}
            onPress={() => {
              client
                .mutate({
                  mutation: CREATE_EMAIL_VERIFICATION,
                  variables: {
                    input: {
                      email: text,
                    }
                  },
                })
                .then((res) => {
                  if (res.data?.createEmailVerification) {
                    navigateTo('/editconfirm/email', {
                      email: text,
                      parentComponentId: componentId,
                    })
                  } else {
                    console.log('error');
                  }
                });
            }}
          />
        </View>
      </ScrollView>
    </View>
  )
}

EditEmailScreen.options = getNavigationOptions
