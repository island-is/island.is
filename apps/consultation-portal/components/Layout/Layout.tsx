import { SEOProps } from '../../types/interfaces'
import React, { FC } from 'react'
import Footer from '../Footer/Footer'
import Menu from '../Menu/Menu'
import SEO from '../SEO/SEO'
import { Box, Divider, ToastContainer } from '@island.is/island-ui/core'
import * as styles from './Layout.css'

type LayoutProps = {
  isFrontPage?: boolean
  seo?: SEOProps
  justifyContent?: 'spaceBetween' | 'flexStart'
}
export const Layout: FC<LayoutProps> = ({
  children,
  isFrontPage,
  seo,
  justifyContent = 'spaceBetween',
}) => {
  return (
    <Box
      flexDirection="column"
      justifyContent={justifyContent}
      display="flex"
      className={styles.processContainer}
    >
      <SEO title={seo.title} url={seo.url} image={seo.image} />
      <Box>
        <Menu isFrontPage={isFrontPage} />
        <Divider />
      </Box>
      <ToastContainer />

      {children}
      <Footer />
    </Box>
  )
}
export default Layout
