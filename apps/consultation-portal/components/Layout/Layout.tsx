import { SEOProps } from '../../types/interfaces'
import React, { FC } from 'react'
import Footer from '../Footer/Footer'
import Menu from '../Menu/Menu'
import SEO from '../SEO/SEO'

type LayoutProps = {
  isFrontPage?: boolean
  seo: SEOProps
}
export const Layout: FC<LayoutProps> = ({ children, isFrontPage, seo }) => {
  return (
    <>
      <SEO title={seo.title} url={seo.url} image={seo.image} />
      <Menu isFrontPage={isFrontPage} />
      {children}
      <Footer />
    </>
  )
}
export default Layout
