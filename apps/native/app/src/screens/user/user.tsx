import { Container, Heading } from '@island.is/island-ui-native';
import React, { useEffect } from 'react'
import { Button, SafeAreaView, TextInput, Text, TouchableOpacity } from 'react-native'
import { Navigation, NavigationFunctionComponent } from 'react-native-navigation';
import { useNavigation, showModal } from 'react-native-navigation-hooks';
import { useAuthStore } from '../../stores/auth-store'
import { loginRoot} from '../../main';
import { testIDs } from '../../utils/test-ids';

export const UserScreen: NavigationFunctionComponent = () => {
  const authStore = useAuthStore();
  return (
    <SafeAreaView
      style={{
        width: '100%',
        height: '100%',
      }}
      testID={testIDs.SCREEN_USER}
    >
      <Container>
        <Heading>{authStore.userInfo?.name}</Heading>
        <Text style={{ marginBottom: 30, marginTop: -30}}>Kt. {authStore.userInfo?.nationalId}</Text>
        <Text>Authorization (Expires: {authStore.authorizeResult?.accessTokenExpirationDate})</Text>
        <TextInput value={authStore.authorizeResult?.accessToken} />
        <Button title="Logout" onPress={() => {
          authStore.logout();
          Navigation.setRoot(loginRoot)
        }} />
      </Container>
    </SafeAreaView>
  )
}
