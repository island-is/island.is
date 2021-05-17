import React from 'react'
import styled from 'styled-components/native';

const Host = styled.View`
  display: flex;
  width: 100%;
  flex-direction: row;

  padding-bottom: 16px;
  margin-top: 16px;
  margin-bottom: 16px;
`;

const TextContainer = styled.View`
  flex: 1;
`;

const Text = styled.Text`
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 20px;
  line-height: 26px;
  color: ${props => props.theme.shade.foreground};
`;

interface HeadingProps {
  children: React.ReactNode;
  button?: React.ReactNode;
}

export function Heading({ children, button }: HeadingProps) {
  return (
    <Host>
      <TextContainer>
        <Text>
          {children}
        </Text>
      </TextContainer>
      {button}
    </Host>
  )
}
