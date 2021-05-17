import React from 'react'
import { SafeAreaView } from 'react-native'
import styled from 'styled-components/native'
import close from '../../assets/icons/close.png'

const Host = styled.View`
  background-color: ${(props) =>
    props.theme.isDark ? '#080817' : props.theme.color.blue100};
`

const MessageText = styled.Text`
  padding: 27px 0px;
  font-family: 'IBMPlexSans';
  font-size: 13px;
  line-height: 17px;
  color: ${(props) => props.theme.shade.foreground};
  flex: 1;
`

const Image = styled.Image`
  width: 16px;
  height: 16px;
`

const Close = styled.TouchableOpacity`
  padding: 10px;
  justify-content: center;
  align-items: center;
`

interface InfoMessageProps {
  children: string
  onClose?(): void
  style?: any
}

export function InfoMessage({ children, onClose, style }: InfoMessageProps) {
  return (
    <Host style={style}>
      <SafeAreaView style={{ marginHorizontal: 16, flexDirection: 'row' }}>
        <MessageText>{children}</MessageText>
        {onClose && (
          <Close onPress={onClose}>
            <Image source={close} />
          </Close>
        )}
      </SafeAreaView>
    </Host>
  )
}
