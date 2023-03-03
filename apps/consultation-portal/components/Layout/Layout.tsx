import React, { FC } from 'react'
import Footer from '../Footer/Footer'
import Menu from '../Menu/Menu'
type LayoutProps = {
  showIcon?: boolean
}
export const Layout: FC<LayoutProps> = ({ children, showIcon }) => {
  return (
    <div>
      <Menu showIcon={showIcon} />
      {children}
      <Footer />
    </div>
  )
}
export default Layout
