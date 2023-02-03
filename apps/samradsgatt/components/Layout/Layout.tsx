import { GridContainer } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import Menu from '../Menu/Menu'
type LayoutProps = {
  showIcon?: boolean
}
export const Layout: FC<LayoutProps> = ({ children, showIcon }) => {
  return (
    <div>
      <Menu showIcon={showIcon} />
      {children}
    </div>
  )
}
export default Layout
