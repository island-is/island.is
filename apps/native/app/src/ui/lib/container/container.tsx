import { PropsWithChildren } from 'react'
import { ViewProps, ViewStyle } from 'react-native'
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
  ...props
}: PropsWithChildren<ContainerProps & ViewProps>) => (
  <StyledContainer rowGap={rowGap} style={style} {...props}>
    {children}
  </StyledContainer>
)
