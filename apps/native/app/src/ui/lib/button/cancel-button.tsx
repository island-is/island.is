import React from 'react';
import {Image, TouchableOpacityProps} from 'react-native';
import styled from 'styled-components/native';
import arrow from '../../assets/icons/arrow.png';
import {dynamicColor, font} from '../../utils';

interface CancelProps extends TouchableOpacityProps {
  title: React.ReactNode;
  isSmall?: boolean;
}

const Host = styled.TouchableOpacity`
  border-bottom-width: 1px;
  border-bottom-color: ${dynamicColor(({theme}) => theme.color.blue400, true)};
`;

const Wrapper = styled.View`
  flex-direction: row;
  align-content: center;
  align-items: center;
`;

const Title = styled.Text<{isSmall?: boolean}>`
  margin-right: 7px;
  padding: 4px 0;
  ${font({
    fontWeight: '600',
    fontSize: ({isSmall}) => (isSmall ? 12 : 16),
    lineHeight: ({isSmall}) => (isSmall ? 16 : 24),
    color: props => props.theme.color.blue400,
  })}
`;

export function CancelButton({title, isSmall, ...rest}: CancelProps) {
  return (
    <Host {...(rest as any)}>
      <Wrapper>
        <Title isSmall={isSmall}>{title}</Title>
        <Image source={arrow} style={{width: 10, height: 10}} />
      </Wrapper>
    </Host>
  );
}
