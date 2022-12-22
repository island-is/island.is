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
import { useUserProfile } from './profile-queries'
import { client } from '../../graphql/client'
import { CREATE_SMS_VERIFICATION } from '../../graphql/queries/create-sms-verification.mutation'

const {
  getNavigationOptions,
  useNavigationOptions,
} = useThemedNavigationOptions(() => ({
  topBar: {
    visible: false,
  },
}))

const parsePhone = (phone: string) => {
  return phone
    .trim()
    .replace(/^\+354/, '')
    .replace(/-/g, '')
}

export const EditPhoneScreen: NavigationFunctionComponent<{
  phone?: string
}> = ({ componentId, phone }) => {
  useNavigationOptions(componentId)
  const intl = useIntl()

  const userProfile = useUserProfile()
  const [text, onChangeText] = React.useState(phone ?? '')

  const originalPhone = parsePhone(
    userProfile.data?.getUserProfile?.mobilePhoneNumber ?? phone ?? '',
  )
  const disabled = parsePhone(text) === originalPhone || text.trim() === ''

  const updatePhone = (value: string) => {
    let str = parsePhone(value)
    if (str.length > 3) {
      str = str.replace(/(\d{3})(\d{1,4})/, '$1-$2')
    }
    onChangeText(str)
  }

  useEffect(() => {
    if (userProfile.data?.getUserProfile?.mobilePhoneNumber) {
      updatePhone(userProfile.data?.getUserProfile?.mobilePhoneNumber)
    }
  }, [userProfile])

  // todo data bind default state
  return (
    <View style={{ flex: 1 }} testID={testIDs.SCREEN_EDIT_PHONE}>
      <NavigationBarSheet
        componentId={componentId}
        title={intl.formatMessage({ id: 'edit.phone.screenTitle' })}
        onClosePress={() => Navigation.dismissModal(componentId)}
        style={{ marginHorizontal: 16 }}
      />
      <ScrollView style={{ flex: 1 }}>
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
              maxLength={8}
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
            />
          </View>
          <Button
            title={intl.formatMessage({ id: 'edit.phone.button' })}
            onPress={() => {
              client
                .mutate({
                  mutation: CREATE_SMS_VERIFICATION,
                  variables: {
                    input: {
                      mobilePhoneNumber: text.replace(/-/g, ''),
                    },
                  },
                })
                .then((res) => {
                  if (res.data) {
                    navigateTo('/editconfirm/phone', {
                      type: 'phone',
                      phone: `+354-${text}`,
                      parentComponentId: componentId,
                    })
                  }
                })
            }}
            disabled={disabled}
          />
        </View>
      </ScrollView>
    </View>
  )
}

EditPhoneScreen.options = getNavigationOptions
