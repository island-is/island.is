import React, { useCallback, useEffect } from 'react'
import { SafeAreaView,View,Text, Image, AppState, AppStateStatus, Button } from 'react-native'
import { Navigation, NavigationFunctionComponent } from 'react-native-navigation'
import { useNavigationComponentDidAppear, useNavigationComponentDidDisappear } from 'react-native-navigation-hooks/dist'
import logo from '../../assets/logo/logo-64w.png'
import { testIDs } from '../../utils/test-ids'
import { authenticateAsync } from 'expo-local-authentication';
import { getMainRoot } from '../../utils/lifecycle/get-app-root'
import { authStore } from '../../stores/auth-store'
import { useRef } from 'react'

function resetLockScreen() {
  authStore.setState(() => ({
    lockScreenActivatedAt: undefined,
    lockScreenComponentId: undefined,
  }));
}

function unlockApp() {
  const { lockScreenComponentId, lockScreenType } = authStore.getState();
  console.log({ lockScreenComponentId, lockScreenType })
  if (lockScreenComponentId && lockScreenType === 'overlay') {
    Navigation.dismissOverlay(lockScreenComponentId);
  } else {
    Navigation.setRoot({ root: getMainRoot() });
  }
  resetLockScreen();
}

export const AppLockScreen: NavigationFunctionComponent<{ isRoot: boolean }> = ({ componentId, isRoot = false }) => {

  const isBiometricsPrompt = useRef(false);

  const authenticateWithBiometrics = useCallback(async () => {
    if (isBiometricsPrompt.current) {
      return;
    }
    isBiometricsPrompt.current = true;
    const response = await authenticateAsync();
    isBiometricsPrompt.current = false;
    console.log({ response });
    if (response.success) {
      unlockApp();
    }
  }, []);

  const onAppStateChange = useCallback((status: AppStateStatus) => {
    if (status === 'active') {
      // authenticateWithBiometrics();
      // authenticateDelay = setTimeout(authenticateWithBiometrics, 1000);
    }
  }, []);

  useEffect(() => {
    AppState.addEventListener('change', onAppStateChange);
    return () => {
      AppState.removeEventListener('change', onAppStateChange);
    }
  }, []);

  useNavigationComponentDidAppear(() => {
    authStore.setState(() => ({
      lockScreenActivatedAt: Date.now(),
      lockScreenComponentId: componentId,
      lockScreenType: isRoot ? 'root' : 'overlay',
    }));
  });

  useNavigationComponentDidDisappear(() => {
    resetLockScreen();
  })

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f2f7ff'
      }}
      testID={testIDs.SCREEN_APP_LOCK}
    >
      <SafeAreaView style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <Image source={logo} />
        <Text style={{ fontSize: 32, marginTop: 20, fontFamily: 'IBMPlexSans-Bold' }}>Stafrænt Ísland</Text>
        <Button title="Unlock" onPress={() => {
          authenticateWithBiometrics();
        }} />
      </SafeAreaView>
      <Image source={require('../../assets/illustrations/digital-services-m1.png')} />
    </View>
  )
}
