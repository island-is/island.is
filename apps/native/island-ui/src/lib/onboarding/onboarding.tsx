import React from 'react'
import { ViewProps } from 'react-native'
import styled from 'styled-components/native'
import { font } from '../../utils'

const Host = styled.View`
  flex: 1;
`

const Wrapper = styled.SafeAreaView`
  flex: 1;
  align-items: center;
  justify-content: center;
`

const Title = styled.Text`
  ${font({
    fontWeight: '300',
    fontSize: 20,
    lineHeight: 28,
  })}
  text-align: center;
  margin-left: 32px;
  margin-right: 32px;
  margin-bottom: 64px;
`

const ButtonContainer = styled.View`
  margin-bottom: 32px;
`

interface OnboradingProps extends ViewProps {
  illustration: React.ReactNode
  title: React.ReactNode
  buttonSubmit: React.ReactNode
  buttonCancel: React.ReactNode
}

export function Onboarding({
  illustration,
  title,
  buttonSubmit,
  buttonCancel,
  ...rest
}: OnboradingProps) {
  return (
    <Host {...rest}>
      {illustration}
      <Wrapper>
        <Title>{title}</Title>
        <ButtonContainer>{buttonSubmit}</ButtonContainer>
        {buttonCancel}
      </Wrapper>
    </Host>
  )
}
