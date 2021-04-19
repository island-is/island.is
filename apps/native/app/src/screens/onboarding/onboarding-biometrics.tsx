import React from 'react';
import { Button } from "@island.is/island-ui-native";
import { SafeAreaView, View, Text, Image } from 'react-native';
import image from '../../assets/illustrations/digital-services-m1.png';
import styled from 'styled-components/native';
import { NavigationFunctionComponent } from 'react-native-navigation';
import { preferencesStore, usePreferencesStore } from '../../stores/preferences-store';
import { authenticateAsync } from 'expo-local-authentication';
import { nextOnboardingStep } from '../../utils/onboarding';

const Illustration = styled.SafeAreaView`
  background-color: ${props => props.theme.color.blue100};
  /* margin-bottom: 45px; */
  margin-top: -32px;
`;

const Title = styled.Text`
  font-family: 'IBMPlexSans-Light';
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: ${props => props.theme.color.dark400};
  margin-left: 32px;
  margin-right: 32px;
  margin-bottom: 64px;
`;

const ButtonContainer = styled.View`
  margin-bottom: 32px;
`;

const CancelButton = styled.TouchableOpacity`
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.color.blue400};
`;

const CancelText = styled.Text`
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 16px;
  line-height: 20px;
  color: ${props => props.theme.color.blue400};
`;

export const OnboardingBiometricsScreen: NavigationFunctionComponent<{hasHardware: boolean; isEnrolled: boolean; supportedAuthenticationTypes: number }> = (props) => {
  const { hasHardware, isEnrolled, supportedAuthenticationTypes } = props;
  const { useBiometrics, setUseBiometrics } = usePreferencesStore();

  const onBiometricsPress = () => {
    // check to see if we want to prompt
    authenticateAsync().then((authenticate) => {
      if (authenticate.success) {
        setUseBiometrics(true)
        preferencesStore.setState(() => ({ hasOnboardedBiometrics: true }))
        nextOnboardingStep();
      }
    });
  }

  const onCancelPress = () => {
    preferencesStore.setState(() => ({ hasOnboardedBiometrics: true }));
    nextOnboardingStep();
  }

  return (
    <View style={{ flex: 1 }}>
      <Illustration>
        <Image source={image} style={{ marginBottom: -44 }} />
      </Illustration>
      <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Title>{isEnrolled ? 'Þú getur einnig notað Face ID til að opna appið án þess að slá inn PIN.' : 'Þitt tæki styður Face ID en þú hefur ekki virkt það.'}</Title>
        <ButtonContainer>
          <Button title="Nota Face ID" onPress={onBiometricsPress} disabled={!isEnrolled} />
        </ButtonContainer>
        <CancelButton onPress={onCancelPress}>
          <CancelText>Sleppa því í bili</CancelText>
        </CancelButton>
      </SafeAreaView>
    </View>
  );
}

OnboardingBiometricsScreen.options = {
  popGesture: false,
  topBar: {
    visible: false,
  },
}
