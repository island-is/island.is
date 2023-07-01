import { SEOProps } from '../../types/interfaces'
import React, { FC } from 'react'
import { Footer, SEO, Menu } from './components'
import { Box, Divider, ToastContainer } from '@island.is/island-ui/core'
import * as styles from './Layout.css'

type LayoutProps = {
  isFrontPage?: boolean
  seo?: SEOProps
  justifyContent?: 'spaceBetween' | 'flexStart'
}

const Layout: FC<React.PropsWithChildren<LayoutProps>> = ({
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
      <Box>
        <SEO
          title={seo.title}
          url={seo.url}
          image={seo.image}
          description={seo.description}
          keywords={seo.keywords}
        />
        <Menu isFrontPage={isFrontPage} />
        <Divider />
        <ToastContainer />
        {children}
      </Box>
      <Box>
        <Footer />
      </Box>
    </Box>
  )
}
export default Layout
