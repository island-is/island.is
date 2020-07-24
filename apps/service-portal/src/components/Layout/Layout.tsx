import React, { FC } from 'react'
import Header from '../header/header'
import Sidebar from '../sidebar/sidebar'
import { Box, Columns, Column } from '@island.is/island-ui/core'
import ContentBreadcrumbs from '../../components/ContentBreadcrumbs/ContentBreadcrumbs'
import * as styles from './Layout.treat'
import UserInfoLoadingOverlay from '../Loaders/userInfoLoadingOverlay'
import NotificationSidebar from '../Notifications/NotificationSidebar/NotificationSidebar'

const Layout: FC = ({ children }) => {
  return (
    <>
      <UserInfoLoadingOverlay />
      <Header />
      <Box display="flex" justifyContent="spaceBetween" overflow="hidden">
        <div className={styles.mainWrapper}>
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
        </div>
        <NotificationSidebar />
      </Box>
    </>
  )
}
export default Layout
