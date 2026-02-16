import React from 'react'
import styled from 'styled-components/native'
import { Typography } from '../typography/typography'

const Host = styled.View`
  display: flex;
  width: 100%;
  flex-direction: row;
  margin-top: ${({ theme }) => theme.spacing[2]}px;
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
`

const TextContainer = styled.View`
  flex: 1;
`

interface HeadingProps {
  children: React.ReactNode
  button?: React.ReactNode
  small?: boolean
}

export function Heading({ children, button, small = false }: HeadingProps) {
  return (
    <Host>
      <TextContainer>
        <Typography variant={small ? 'heading5' : 'heading3'}>
          {children}
        </Typography>
      </TextContainer>
      {button}
    </Host>
  )
}
