import { Text } from '@island.is/island-ui/core'
import { useIsMobile } from '@island.is/portals/my-pages/core'
import React from 'react'

/**
 * Text cell for `PortalTable` columns marked `meta: { type: 'interactive' }`.
 * The table right aligns its own text cells on mobile, so columns that should
 * stay left aligned are marked interactive and render their text through this.
 */
const TableTextCell: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { isMobile } = useIsMobile()
  return <Text variant={isMobile ? 'default' : 'medium'}>{children}</Text>
}

export const tableTextCell = (children: React.ReactNode) => (
  <TableTextCell>{children}</TableTextCell>
)

export default TableTextCell
