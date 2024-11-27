import React from 'react'
import { Image } from 'react-native'
import styled from 'styled-components/native'
import close from '../../assets/alert/close.png'
import { dynamicColor } from '../../utils'

const Host = styled.View`
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 24px;
  background-color: ${dynamicColor((props) => ({
    dark: props.theme.shades.dark.shade100,
    light: props.theme.color.blue100,
  }))};
`

export function Close() {
  return (
    <Host>
      <Image source={close as any} style={{ width: 8, height: 8 }} />
    </Host>
  )
}
