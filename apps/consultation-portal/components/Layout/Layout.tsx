import React, { FC } from 'react'
import Footer from '../Footer/Footer'
import Menu from '../Menu/Menu'
type LayoutProps = {
  isFrontPage?: boolean
}
export const Layout: FC<LayoutProps> = ({ children, isFrontPage }) => {
  return (
    <div>
      <Menu isFrontPage={isFrontPage} />
      {children}
      <Footer />
    </div>
  )
}
export default Layout
