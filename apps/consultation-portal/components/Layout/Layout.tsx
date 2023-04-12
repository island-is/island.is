import { SEOProps } from '../../types/interfaces'
import React, { FC } from 'react'
import Footer from '../Footer/Footer'
import Menu from '../Menu/Menu'
import SEO from '../SEO/SEO'
import { Box, Divider } from '@island.is/island-ui/core'
import * as styles from './Layout.css'

type LayoutProps = {
  isFrontPage?: boolean
  seo?: SEOProps
}
export const Layout: FC<LayoutProps> = ({ children, isFrontPage, seo }) => {
  return (
    <Box
      flexDirection="column"
      justifyContent="spaceBetween"
      display="flex"
      className={styles.processContainer}
    >
      <SEO title={seo.title} url={seo.url} image={seo.image} />
      <Box>
        <Menu isFrontPage={isFrontPage} />
        <Divider />
      </Box>

      {children}
      <Footer />
    </Box>
  )
}
export default Layout
