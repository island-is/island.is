import React from 'react'
import styled from 'styled-components/native'

import { Typography } from '../typography/typography'

const Host = styled(Typography)`
  margin-bottom: ${({ theme }) => theme.spacing[1]}px;
`

interface FieldLabelProps {
  children: React.ReactNode
}

export function FieldLabel({ children }: FieldLabelProps) {
  return <Host variant="body3">{children}</Host>
}
