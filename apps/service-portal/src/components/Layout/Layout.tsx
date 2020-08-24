import React, { FC } from 'react'
import Header from '../Header/Header'
import Sidebar from '../Sidebar/Sidebar'
import { Box, Columns, Column } from '@island.is/island-ui/core'
import ContentBreadcrumbs from '../../components/ContentBreadcrumbs/ContentBreadcrumbs'
import * as styles from './Layout.treat'
import UserInfoLoadingOverlay from '../Loaders/UserInfoLoadingOverlay/UserInfoLoadingOverlay'
import NotificationSidebar from '../Notifications/NotificationSidebar/NotificationSidebar'
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
          paddingX={[0, 0, 0, 6]}
          paddingY={[0, 0, 0, 7]}
        >
          <Columns>
            <Column width="3/12">
              <Sidebar />
            </Column>
            <Column width="9/12">
              <Box as="main">
                <ContentBreadcrumbs />
                <Box padding={3}>{children}</Box>
              </Box>
            </Column>
          </Columns>
        </Box>
        <NotificationSidebar />
      </Box>
    </>
  )
}
export default Layout
