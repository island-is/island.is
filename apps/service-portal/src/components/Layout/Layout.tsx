import React, { FC } from 'react'
import Header from '../header/header'
import Sidebar from '../sidebar/sidebar'
import { Page, ContentBlock } from '@island.is/island-ui/core'
import ContentBreadcrumbs from '../../components/ContentBreadcrumbs/ContentBreadcrumbs'

import * as styles from './Layout.treat'

const Layout: FC = ({ children }) => {
  return (
    <>
      <Header />
      <div className={styles.mainWrapper}>
        <Sidebar />
        <Page>
          <ContentBreadcrumbs />
          {children}
        </Page>
      </div>
    </>
  )
}
export default Layout
