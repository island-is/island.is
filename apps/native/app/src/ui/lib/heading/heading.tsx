import React from 'react';
import styled from 'styled-components/native';
import {font} from '../../utils/font';

const Host = styled.View`
  display: flex;
  width: 100%;
  flex-direction: row;
  margin-top: ${({theme}) => theme.spacing[2]}px;
  margin-bottom: ${({theme}) => theme.spacing[2]}px;
`;

const TextContainer = styled.View`
  flex: 1;
`;

const Text = styled.Text`
  ${font({
    fontWeight: '600',
    fontSize: 20,
  })}
`;

interface HeadingProps {
  children: React.ReactNode;
  button?: React.ReactNode;
}

export function Heading({children, button}: HeadingProps) {
  return (
    <Host>
      <TextContainer>
        <Text>{children}</Text>
      </TextContainer>
      {button}
    </Host>
  );
}
