import React, { FC } from 'react'
import Header from '../header/header'
import Sidebar from '../sidebar/sidebar'
import { Box } from '@island.is/island-ui/core'
import ContentBreadcrumbs from '../../components/ContentBreadcrumbs/ContentBreadcrumbs'
import * as styles from './Layout.treat'

const Layout: FC = ({ children }) => {
  return (
    <>
      <Header />
      <Box display="flex" position="relative" overflow="hidden" height="full">
        <Box className={styles.sidebar}>
          <Sidebar />
        </Box>
        <Box as="main" className={styles.mainContainer}>
          <ContentBreadcrumbs />
          <Box padding={3}>{children}</Box>
        </Box>
      </Box>
    </>
  )
}
export default Layout
