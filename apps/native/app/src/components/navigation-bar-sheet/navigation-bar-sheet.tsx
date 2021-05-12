import React from 'react';
import { Platform, SafeAreaView } from "react-native"
import styled from 'styled-components/native';
import closeIcon from '../../assets/icons/close.png';

const Header = styled.View`
  padding-top: 20px;
  padding-bottom: 16px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const HeaderTitle = styled.Text`
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 21px;
  color: ${props => props.theme.color.dark400};
`;

const Handle = styled.View`
  position: absolute;
  width: 120px;
  height: 4px;
  border-radius: 4px;
  background-color: ${props => props.theme.color.dark100};
  top: 5px;
  left: 50%;
  margin-left: -60px;
  opacity: 1;
`;

const CloseButton = styled.TouchableOpacity`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${props => props.theme.color.blue100};
  align-items: center;
  justify-content: center;
`;

const CloseIcon = styled.Image`
  tint-color: ${props => props.theme.color.blue400};
  width: 24px;
  height: 24px;
`;

export function NavigationBarSheet({ title, onClosePress, style }: { title: string; onClosePress(): void; style?: any }) {
  return (
    <>
      {Platform.OS === 'ios' && !Platform.isPad && <Handle />}
      <SafeAreaView>
        <Header style={style}>
          <HeaderTitle>{title}</HeaderTitle>
          <CloseButton onPress={onClosePress}>
            <CloseIcon source={closeIcon} />
          </CloseButton>
        </Header>
      </SafeAreaView>
    </>
  );
}
