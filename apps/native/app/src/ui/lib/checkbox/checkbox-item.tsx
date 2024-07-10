import React from 'react'
import styled from 'styled-components/native'

import { dynamicColor } from '../../utils'
import { Typography } from '../typography/typography'

const Host = styled.View`
  padding-vertical: ${({ theme }) => theme.spacing[2]}px;
  margin-horizontal: ${({ theme }) => theme.spacing[2]}px;
  border-bottom-width: ${({ theme }) => theme.border.width.standard}px;
  border-bottom-color: ${dynamicColor(
    ({ theme }) => ({
      light: theme.color.blue200,
      dark: theme.shades.dark.shade300,
    }),
    true,
  )};
`

interface CheckboxItemProps {
  label: string
}

export function CheckboxItem({ label }: CheckboxItemProps) {
  return (
    <Host>
      <Typography>{label}</Typography>
    </Host>
  )
}
