import React from 'react';
import {Image, TouchableOpacityProps} from 'react-native';
import styled from 'styled-components/native';
import chevronForward from '../../assets/icons/chevron-forward.png';
import {dynamicColor, font} from '../../utils';

interface IconButtonProps extends TouchableOpacityProps {
  title: React.ReactNode;
  image: React.ReactNode;
}

const Host = styled.TouchableOpacity`
  flex: 1;
  border-bottom-width: ${({theme}) => theme.border.width.standard}px;
  border-color: ${dynamicColor(
    props => ({
      dark: 'shade500',
      light: props.theme.color.blue200,
    }),
    true,
  )};

  margin-left: -${({theme}) => theme.spacing[2]}px;
  margin-right: -${({theme}) => theme.spacing[2]}px;
`;

const Wrapper = styled.View`
  padding: ${({theme}) => theme.spacing[2]}px;
  flex-direction: row;
  align-content: center;
  align-items: center;
`;

const ImageWrap = styled.View`
  align-items: center;
  justify-content: center;
  height: 42px;
  width: 42px;
  margin-right: ${({theme}) => theme.spacing[2]}px;

  background-color: ${dynamicColor(
    ({theme}) => ({
      dark: theme.shades.dark.shade300,
      light: theme.color.blue100,
    }),
    true,
  )};
  border-radius: 30px;
`;

const Title = styled.Text`
  text-align: center;
  ${font({
    fontWeight: '300',
    fontSize: 16,
    lineHeight: 24,
  })}
`;

const Icon = styled.View`
  margin-left: auto;
`;

export function IconButton({title, image, ...rest}: IconButtonProps) {
  return (
    <Host {...(rest as any)}>
      <Wrapper>
        <ImageWrap>{image}</ImageWrap>
        <Title>{title}</Title>
        <Icon>
          <Image source={chevronForward} style={{width: 24, height: 24}} />
        </Icon>
      </Wrapper>
    </Host>
  );
}
