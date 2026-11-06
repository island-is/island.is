import React from 'react'
import { Image } from 'react-native'
import styled from 'styled-components/native'
import close from '../../assets/alert/close.png'
import { token } from '../../utils'

const Host = styled.View`
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 24px;
  background-color: ${token((t) => t.interactive.background.primaryMinimal)};
`

export function Close() {
  return (
    <Host>
      <Image source={close as any} style={{ width: 8, height: 8 }} />
    </Host>
  )
}
