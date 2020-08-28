import React, { FC } from 'react'
import Header from '../Header/Header'
import Sidebar from '../Sidebar/Sidebar'
import { Box, Columns, Column, Hidden, Footer } from '@island.is/island-ui/core'
import ContentBreadcrumbs from '../../components/ContentBreadcrumbs/ContentBreadcrumbs'
import * as styles from './Layout.treat'
import UserInfoLoadingOverlay from '../Loaders/UserInfoLoadingOverlay/UserInfoLoadingOverlay'
import useRoutes from '../../hooks/useRoutes/useRoutes'
import { footerProps } from './footerProps'

const Layout: FC = ({ children }) => {
  useRoutes()

  return (
    <>
      <UserInfoLoadingOverlay />
      <Header />
      <Box overflow="hidden" className={styles.layoutWrapper}>
        <Box
          className={styles.mainWrapper}
          paddingX={[2, 2, 4, 4, 6]}
          paddingY={[2, 2, 2, 7]}
        >
          <Columns space={[0, 0, 0, 'gutter', 'containerGutter']}>
            <Column width="content">
              <Hidden below="lg">
                <Sidebar />
              </Hidden>
            </Column>
            <Column>
              <Box as="main">
                <ContentBreadcrumbs />
                <div>{children}</div>
              </Box>
            </Column>
          </Columns>
        </Box>
        <Footer {...footerProps} />
      </Box>
    </>
  )
}
export default Layout
