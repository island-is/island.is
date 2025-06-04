import { PropsWithChildren } from 'react'
import { ViewStyle } from 'react-native'
import styled from 'styled-components/native'

const StyledContainer = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
`

type ContainerProps = {
  style?: ViewStyle
}

export const Container = ({
  style,
  children,
}: PropsWithChildren<ContainerProps>) => (
  <StyledContainer style={style}>{children}</StyledContainer>
)
