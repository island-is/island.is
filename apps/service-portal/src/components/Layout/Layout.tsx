import React, { FC } from 'react'
import Header from '../Header/Header'
import Sidebar from '../Sidebar/Sidebar'
import { Box, Columns, Column, Hidden } from '@island.is/island-ui/core'
import ContentBreadcrumbs from '../../components/ContentBreadcrumbs/ContentBreadcrumbs'
import * as styles from './Layout.treat'
import UserInfoLoadingOverlay from '../Loaders/UserInfoLoadingOverlay/UserInfoLoadingOverlay'
import useRoutes from '../../hooks/useRoutes/useRoutes'

const Layout: FC = ({ children }) => {
  useRoutes()

  return (
    <>
      <UserInfoLoadingOverlay />
      <Header />
      <Box
        display="flex"
        justifyContent="spaceBetween"
        overflow="hidden"
        className={styles.layoutWrapper}
      >
        <Box
          className={styles.mainWrapper}
          paddingX={[2, 2, 4, 4, 6]}
          paddingY={[0, 0, 0, 7]}
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
      </Box>
    </>
  )
}
export default Layout
