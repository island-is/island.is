import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'
import { dynamicColor } from '../../utils'
import { font } from '../../utils/font'

const Host = styled.View`
  display: flex;
  flex-direction: row;
  padding: 20px 70px 20px 24px;
  margin-bottom: 16px;
  border-radius: 8px;
  border-width: 1px;
  border-color: ${dynamicColor(
    ({ theme }) => ({
      light: theme.color.blue200,
      dark: theme.shades.dark.shade300,
    }),
    true,
  )};
  align-items: center;
  justify-content: space-between;
`

const Text = styled.Text`
  padding-right: 30px;
  margin-bottom: 16px;

  ${font({
    fontWeight: '400',
    lineHeight: 16,
    fontSize: 12,
  })}
`

interface EmptyCardProps {
  text: string
  image: React.ReactNode
  link: React.ReactNode
}

export function EmptyCard({ text, image, link }: EmptyCardProps) {
  return (
    <Host>
      <View>
        <Text>{text}</Text>
        <View>{link}</View>
      </View>
      <View>{image}</View>
    </Host>
  )
}
