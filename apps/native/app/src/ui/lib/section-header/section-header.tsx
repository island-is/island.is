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

interface SectionHeaderProps {
  children: React.ReactNode
  button?: React.ReactNode
  size?: 'default' | 'small'
}

export function SectionHeader({
  children,
  button,
  size = 'default',
}: SectionHeaderProps) {
  return (
    <Host>
      <TextContainer>
        <Typography variant={size === 'small' ? 'heading5' : 'heading3'}>
          {children}
        </Typography>
      </TextContainer>
      {button}
    </Host>
  )
}

interface HeadingProps {
  children: React.ReactNode
  button?: React.ReactNode
  small?: boolean
  /** @deprecated heading4 is retired, so this renders the default size. */
  medium?: boolean
}

/** @deprecated Use `SectionHeader`. */
export function Heading({ children, button, small = false }: HeadingProps) {
  return (
    <SectionHeader button={button} size={small ? 'small' : 'default'}>
      {children}
    </SectionHeader>
  )
}
