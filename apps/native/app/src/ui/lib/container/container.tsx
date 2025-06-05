import { PropsWithChildren } from 'react'
import { ViewStyle } from 'react-native'
import styled from 'styled-components/native'
import { Spacing } from '../../utils'

const StyledContainer = styled.View<{ rowGap?: Spacing }>`
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
  ${({ theme, rowGap }) => rowGap && `row-gap: ${theme.spacing[rowGap]}px;`}
`

type ContainerProps = {
  rowGap?: Spacing
  style?: ViewStyle
}

export const Container = ({
  rowGap,
  style,
  children,
}: PropsWithChildren<ContainerProps>) => (
  <StyledContainer rowGap={rowGap} style={style}>
    {children}
  </StyledContainer>
)
