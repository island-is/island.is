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
import { PinKeypad } from '../../components/pin-keypad/pin-keypad'
import { VisualizedPinCode } from '../../components/visualized-pin-code/visualized-pin-code'
import { useState } from 'react'
import styled from 'styled-components/native';
import { usePreferencesStore } from '../../stores/preferences-store'

const MAX_PIN_CHARS = 4;

const Host = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
`;

export const AppLockScreen: NavigationFunctionComponent<{ isRoot: boolean; status: string }> = ({ componentId, status, isRoot = false }) => {

  const { useBiometrics } = usePreferencesStore();
  const isPromptRef = useRef(false);
  const [code, setCode] = useState('');

  const resetLockScreen = useCallback(() => {
    authStore.setState(() => ({
      lockScreenActivatedAt: undefined,
      lockScreenComponentId: undefined,
    }));
  }, []);

  const unlockApp = useCallback(() => {
    const { lockScreenComponentId, lockScreenType } = authStore.getState();
    if (lockScreenComponentId && lockScreenType === 'overlay') {
      Navigation.dismissOverlay(lockScreenComponentId);
    } else {
      Navigation.setRoot({ root: getMainRoot() });
    }
    resetLockScreen();
  }, []);

  const authenticateWithBiometrics = useCallback(async () => {
    if (!useBiometrics) {
      // dont have biometrics
      return;
    }
    if (isPromptRef.current) {
      // dont show twice?
      return;
    }
    isPromptRef.current = true;
    const response = await authenticateAsync();
    if (response.success) {
      unlockApp();
    }
  }, [isPromptRef]);

  useEffect(() => {
    if (status === 'active' && isPromptRef.current) {
      isPromptRef.current = false;
    } else if (status === 'active') {
      authenticateWithBiometrics();
    }
  }, [status]);

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

  useEffect(() => {
    if (code === '0000') {
      unlockApp();
    }
  }, [code]);

  const onPinInput = (char: string) => {
    setCode(previousCode => `${previousCode}${previousCode.length >= MAX_PIN_CHARS ? '' : char}`);
  }

  const onBackPress = () => {
    setCode(previousCode => `${previousCode.substr(0, previousCode.length - 1)}`);
  }

  const onFaceIdPress = () => {
    // we know the prompt is not present at this time
    isPromptRef.current = false;
    authenticateWithBiometrics();
  }

  return (
    <Host
      testID={testIDs.SCREEN_APP_LOCK}
    >
      <SafeAreaView style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <VisualizedPinCode code={code} maxChars={MAX_PIN_CHARS} />
        <View style={{ height: 32 }} />
        <PinKeypad
          onInput={onPinInput}
          onBackPress={onBackPress}
          onFaceIdPress={onFaceIdPress}
          back={code.length > 0}
          faceId={useBiometrics}
        />
      </SafeAreaView>
    </Host>
  )
}
