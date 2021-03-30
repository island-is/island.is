import { theme } from '@island.is/island-ui/theme';
import React from 'react'
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, View } from 'react-native';
import styled from 'styled-components/native';

const Host = styled.View`
  height: 100%;
  display: flex;
  flex: 1;
  justify-content: space-between;
  padding: 70px 45px 20px;
`;

const Top = styled.View``;

const Title = styled.Text`
  font-size: 36px;
  line-height: 42px;
  font-weight: bold;
  margin-bottom: ${theme.spacing.gutter}px;
`;

const Copy = styled.Text`
  margin-bottom: ${theme.spacing.gutter * 1.5}px;
  font-size: 18px;
  line-height: 26px;
`;

const Childs = styled.View`
  margin-bottom: 60px;
`;

const Action = styled.View`
  margin-bottom: 50px;
`;


interface InputProps {
  title?: string;
  copy?: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
}

export function OnBoarding({ title, copy, children, action }: InputProps) {

  return (

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Host>
          <Top>
            <Title>{title}</Title>
            <Copy>{copy}</Copy>
            <Childs>{children}</Childs>
          </Top>
          {/* <View style={{ flex: 1 }} /> */}
          <Action>{action}</Action>
        </Host>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

  )
}
