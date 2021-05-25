import React from 'react'
import { ImageSourcePropType } from 'react-native';
import styled from 'styled-components/native';

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
  margin-bottom: 16px;
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 16px;
  line-height: 20px;
  color: ${(props) => props.theme.shade.foreground};
  text-align: center;
`;

const Description = styled.Text`
  font-family: 'IBMPlexSans-Light';
  font-size: 16px;
  line-height: 24px;
  color: ${(props) => props.theme.shade.foreground};
  text-align: center;
`;


interface HeadingProps {
  title: string;
  description: string;
  image: React.ReactNode;
}

export function EmptyList({ title, description, image }: HeadingProps) {
  return (
    <Host>
      <ImageWrap>
        {image}
      </ImageWrap>
      <Title>{title}</Title>
      <Description>{description}</Description>
    </Host>
  )
}
