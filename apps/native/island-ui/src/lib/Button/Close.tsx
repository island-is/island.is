import React from 'react'
import styled from 'styled-components/native';
import { Image } from 'react-native';
import close from '../../assets/alert/close.png';
import { theme } from '@island.is/island-ui/theme';

const Host = styled.View`
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 24px;

  background-color: ${theme.color.blue100};
`;


export function Close() {
  return (
    <Host>
      <Image source={close as any} style={{ width: 8, height: 8 }} />
    </Host>
  )
}
