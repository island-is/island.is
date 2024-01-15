import React from 'react'
import styled from 'styled-components/native'
import { font } from '../../utils/font'

const Host = styled.ScrollView`
  flex: 1;
`
const Title = styled.Text`
  margin-bottom: 16px;
  ${font({
    fontWeight: '600',
    fontSize: 20,
  })}
`

const Message = styled.Text`
  ${font({
    fontWeight: '300',
    fontSize: 16,
    lineHeight: 24,
  })}
`

interface ContentProps {
  title?: string
  message?: string
}

export function Content({ title, message }: ContentProps) {
  return (
    <Host>
      {title && <Title>{title}</Title>}
      {message && <Message>{message}</Message>}
    </Host>
  )
}
