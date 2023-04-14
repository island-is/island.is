import {Button, NavigationBarSheet, TextField, Typography} from '@ui';
import React, {useEffect} from 'react';
import {View, Text, ScrollView, Alert} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {createNavigationOptionHooks} from '../../hooks/create-navigation-option-hooks';
import {useIntl} from 'react-intl';
import {testIDs} from '../../utils/test-ids';
import {navigateTo} from '../../lib/deep-linking';
import {useUpdateUserProfile, useUserProfile} from './profile-queries';
import {client} from '../../graphql/client';
import {CREATE_EMAIL_VERIFICATION} from '../../graphql/queries/create-email-verification.mutation';

const {
  getNavigationOptions,
  useNavigationOptions,
} = createNavigationOptionHooks(() => ({
  topBar: {
    visible: false,
  },
}));

export const EditEmailScreen: NavigationFunctionComponent<{
  email?: string;
}> = ({componentId, email}) => {
  useNavigationOptions(componentId);
  const intl = useIntl();
  const userProfile = useUserProfile();
  const [loading, setLoading] = React.useState(false);
  const [text, onChangeText] = React.useState(email ?? '');

  const originalEmail = userProfile.data?.getUserProfile?.email ?? email;
  const disabled = text.trim() === originalEmail.trim() || text.trim() === '';

  useEffect(() => {
    if (userProfile.data?.getUserProfile?.email) {
      onChangeText(userProfile.data?.getUserProfile?.email);
    }
  }, [userProfile]);

  return (
    <View style={{flex: 1}} testID={testIDs.SCREEN_EDIT_EMAIL}>
      <NavigationBarSheet
        componentId={componentId}
        title={intl.formatMessage({id: 'edit.email.screenTitle'})}
        onClosePress={() => Navigation.dismissModal(componentId)}
        style={{marginHorizontal: 16}}
      />
      <ScrollView style={{flex: 1}} keyboardShouldPersistTaps="handled">
        <View style={{paddingHorizontal: 16}}>
          <View style={{marginBottom: 32, marginTop: 8}}>
            <Typography>
              {intl.formatMessage({id: 'edit.email.description'})}
            </Typography>
          </View>
          <View style={{marginBottom: 24}}>
            <TextField
              label={intl.formatMessage({id: 'edit.email.inputlabel'})}
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
            title={intl.formatMessage({id: 'edit.email.button'})}
            onPress={async () => {
              setLoading(true);
              try {
                const res = await client.mutate({
                  mutation: CREATE_EMAIL_VERIFICATION,
                  variables: {
                    input: {
                      email: text,
                    },
                  },
                });
                if (res.data) {
                  navigateTo('/editconfirm/email', {
                    type: 'email',
                    email: text,
                    parentComponentId: componentId,
                  });
                } else {
                  throw new Error('Failed to create sms verification');
                }
              } catch (e) {
                Alert.alert('Villa', 'Gat ekki sent staðfestingarkóða');
              }
              setLoading(false);
            }}
            disabled={disabled || loading}
          />
        </View>
      </ScrollView>
    </View>
  );
};

EditEmailScreen.options = getNavigationOptions;
