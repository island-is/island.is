import React from 'react'
import { Image, TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'
import arrow from '../../assets/icons/arrow.png'
import { dynamicColor, font } from '../../utils'

const Host = styled.TouchableOpacity`
  border-bottom-width: 1px;
  border-bottom-color: ${dynamicColor(({ theme }) => theme.color.blue400)};
`

const Wrapper = styled.View`
  flex-direction: row;
  align-content: center;
  align-items: center;
`;

const Title = styled.Text`
  margin-right: 7px;
  padding: 4px 0;
  ${font({
    fontWeight: '600',
    fontSize: 16,
    color: (props) => props.theme.color.blue400,
  })}
`;

interface CancelProps extends TouchableOpacity {
  children: React.ReactNode;
  testID: string;
  onPress?: () => void;
}

export function CancelButton({ children, ...rest }: CancelProps) {
  return (
    <Host {...rest}>
      <Wrapper>
        <Title>{children}</Title>
        <Image source={arrow}  style={{ width: 10, height: 10 }} />
      </Wrapper>
    </Host>
  )
}
