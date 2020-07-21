import React, { FC } from 'react'
import Header from '../header/header'
import Sidebar from '../sidebar/sidebar'
import cx from 'classnames'
import { Box, Page } from '@island.is/island-ui/core'
import ContentBreadcrumbs from '../../components/ContentBreadcrumbs/ContentBreadcrumbs'
import * as styles from './Layout.treat'

const Layout: FC = ({ children }) => {
  return (
    <>
      <Header />
      <Box className={styles.mainWrapper}>
        <Sidebar />
        <Box className={cx(styles.mainContainer)}>
          <ContentBreadcrumbs />
          <Box padding={3}>
            <Page>{children}</Page>
          </Box>
        </Box>
        <div className={cx(styles.messages)} />
      </Box>
    </>
  )
}
export default Layout
