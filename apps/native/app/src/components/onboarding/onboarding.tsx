import { theme } from '@island.is/island-ui/theme';
import React from 'react'
import { Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, TouchableWithoutFeedback, View } from 'react-native';
import styled from 'styled-components/native';

const Host = styled.View`
  height: 100%;
  display: flex;
  flex: 1;

  padding: 0 35px 0;
`;

const Top = styled.ScrollView``;

const Title = styled.Text`
  font-family: 'IBMPlexSans-Bold';
  font-size: 36px;
  line-height: 42px;
  margin-bottom: ${theme.spacing.gutter}px;
`;

const Copy = styled.Text`
  font-family: 'IBMPlexSans';
  margin-bottom: ${theme.spacing.gutter}px;
  font-size: 18px;
  line-height: 26px;
`;

const Childs = styled.View`
  margin-bottom: 16px;
`;

const Action = styled.View`
  margin-bottom: 16px;
`;


interface InputProps {
  title?: string;
  copy?: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
  testID?: string;
}

export function OnBoarding({ title, copy, children, action, testID }: InputProps) {

  return (
    <SafeAreaView style={{ flex: 1 }} testID={testID}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <Host>
            <View style={{ flex: 1, maxHeight: 100 }} />
            <Top alwaysBounceVertical={false}>
              <Title>{title}</Title>
              <Copy>{copy}</Copy>
              <Childs>{children}</Childs>
            </Top>
            <Action>{action}</Action>
          </Host>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  )
}
