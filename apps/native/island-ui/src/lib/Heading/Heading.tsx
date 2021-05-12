import React from 'react'
import styled from 'styled-components/native';

const Host = styled.View`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  padding-bottom: 16px;
  margin-top: 16px;
  margin-bottom: 16px;
`;

const Text = styled.Text`
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 20px;
  line-height: 26px;
  color: ${props => props.theme.shade.foreground};
  margin-right: auto;
`;


interface HeadingProps {
  children: React.ReactNode;
  button?: React.ReactNode;
  isCenterAligned?: boolean;
}

export function Heading({ children, button, isCenterAligned }: HeadingProps) {
  return (
    <Host>
      <Text>
        {children}
      </Text>
      {button}
    </Host>
  )
}
