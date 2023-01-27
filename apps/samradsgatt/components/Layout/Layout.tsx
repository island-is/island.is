import React, { FC } from 'react'
import Menu from '../Menu/Menu'
type LayoutProps = {
  showIcon?: boolean
}
export const Layout: FC<LayoutProps> = ({ children, showIcon }) => {
  return (
    <div>
      <Menu showIcon={showIcon} />
      <div>{children}</div>
    </div>
  )
}
export default Layout
