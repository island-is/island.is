import React from 'react'
import { TouchableOpacityProps } from 'react-native'
import styled from 'styled-components/native'
import { dynamicColor, font } from '../../utils'

interface IconButtonProps extends TouchableOpacityProps {
  title: React.ReactNode
  image: React.ReactNode
}

const Host = styled.TouchableOpacity`
  flex: 1;
  border-radius: ${({ theme }) => theme.border.radius.large};
  border-width: ${({ theme }) => theme.border.width.standard}px;
  border-color: ${dynamicColor(
    ({ theme }) => ({
      dark: theme.shades.dark.shade300,
      light: theme.color.blue200,
    }),
    true,
  )};
`

const Wrapper = styled.View`
  padding: ${({ theme }) => theme.spacing[2]}px;
  flex-direction: column;
  align-content: center;
  align-items: center;
`

const ImageWrap = styled.View`
  align-items: center;
  justify-content: center;
  height: 30px;
  margin-bottom: ${({ theme }) => theme.spacing[1]}px;
`;

const Title = styled.Text`
  text-align: center;
  ${font({
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
  })}
`

export function IconButton({ title, image, ...rest }: IconButtonProps) {
  return (
    <Host {...(rest as any)}>
      <Wrapper>
        <ImageWrap>
          {image}
        </ImageWrap>
        <Title>{title}</Title>
      </Wrapper>
    </Host>
  )
}
