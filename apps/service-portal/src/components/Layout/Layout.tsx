import React, { FC, useRef } from 'react'
import Header from '../header/header'
import Sidebar from '../sidebar/sidebar'
import { Box, Columns, Column } from '@island.is/island-ui/core'
import ContentBreadcrumbs from '../../components/ContentBreadcrumbs/ContentBreadcrumbs'
import * as styles from './Layout.treat'
import UserInfoLoadingOverlay from '../Loaders/userInfoLoadingOverlay'
import NotificationSidebar from '../Notifications/NotificationSidebar/NotificationSidebar'

const Layout: FC = ({ children }) => {
  const mainRef = useRef()

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
        <div className={styles.mainWrapper} ref={mainRef}>
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
