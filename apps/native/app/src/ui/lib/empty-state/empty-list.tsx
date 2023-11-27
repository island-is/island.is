import React from 'react';
import styled from 'styled-components/native';
import {font} from '../../utils/font';

const Host = styled.View`
  display: flex;
  flex: 1;

  justify-content: center;
  align-items: center;
  padding: 0 53px;
`;

const ImageWrap = styled.View`
  margin-bottom: 50px;
`;

const Title = styled.Text`
  margin-bottom: ${({theme}) => theme.spacing[2]}px;

  ${font({
    fontWeight: '600',
  })}

  text-align: center;
`;

const Description = styled.Text`
  ${font({
    fontWeight: '300',
    lineHeight: 24,
  })}
  text-align: center;
`;

interface HeadingProps {
  title: React.ReactNode;
  description: React.ReactNode;
  image: React.ReactNode;
}

export function EmptyList({title, description, image}: HeadingProps) {
  return (
    <Host>
      <ImageWrap>{image}</ImageWrap>
      <Title>{title}</Title>
      <Description>{description}</Description>
    </Host>
  );
}
