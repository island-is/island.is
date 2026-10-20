import { Box, Text } from '@island.is/island-ui/core'
import React from 'react'

interface Props {
  label: string
  children: React.ReactNode
}

/**
 * Label and value row for `PortalTable` cells that use `meta: { span: 2 }`.
 * Those cells take the full card width on mobile without a label, so this
 * adds the label back in the same layout the table uses for its other rows.
 */
const MobileLabeledCell: React.FC<Props> = ({ label, children }) => (
  <Box display="flex" flexDirection="row">
    <Box width="half" display="flex" alignItems="center">
      <Text fontWeight="semiBold">{label}</Text>
    </Box>
    <Box width="half">{children}</Box>
  </Box>
)

export default MobileLabeledCell
