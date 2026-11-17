import React from 'react'
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { token } from '../../utils'
import { Typography } from '../typography/typography'

const Heading = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
`

const Row = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  padding-top: ${({ theme }) => theme.spacing[2]}px;
  padding-bottom: ${({ theme }) => theme.spacing[2]}px;
  border-bottom-color: ${token((t) => t.border.primary)};
  border-bottom-width: 1px;
`

export const TableCell = styled.View`
  margin-horizontal: ${({ theme }) => theme.spacing[1]}px;
  flex: 1;
`

type TableProps = {
  title?: React.ReactNode
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
}

// Table rows under an optional eyebrow heading.
export function Table({ title, children, style }: TableProps) {
  return (
    <View style={style}>
      {title && (
        <Heading>
          <Typography variant="eyebrow">{title}</Typography>
        </Heading>
      )}
      {children}
    </View>
  )
}

type TableRowProps = ViewProps & {
  // Position in the table. Even rows are tinted, odd rows white.
  index: number
}

export function TableRow({ index, style, ...rest }: TableRowProps) {
  const theme = useTheme()

  return (
    <Row
      style={[
        {
          backgroundColor:
            index % 2 === 0
              ? theme.tokens.background.brandMinimal
              : theme.tokens.background.invert,
        },
        style,
      ]}
      {...rest}
    />
  )
}
