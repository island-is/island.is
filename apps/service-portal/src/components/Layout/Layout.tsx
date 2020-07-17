import React, { FC } from 'react'
import Header from '../header/header'
import Sidebar from '../sidebar/sidebar'
import { Page, ContentBlock } from '@island.is/island-ui/core'
import * as styles from './Layout.treat'

const Layout: FC = ({ children }) => {
  return (
    <>
      <Header />
      <div className={styles.mainWrapper}>
        <Sidebar />
        <Page>
          <ContentBlock>{children}</ContentBlock>
        </Page>
      </div>
    </>
  )
}
export default Layout
