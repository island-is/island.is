import React, { FC } from 'react'
import Header from '../Header/Header'
import Sidebar from '../Sidebar/Sidebar'
import {
  Box,
  Columns,
  Column,
  Hidden,
  Footer,
  ContentBlock,
  ToastContainer,
} from '@island.is/island-ui/core'
import ContentBreadcrumbs from '../../components/ContentBreadcrumbs/ContentBreadcrumbs'
import * as styles from './Layout.treat'
import UserInfoLoadingOverlay from '../Loaders/UserInfoLoadingOverlay/UserInfoLoadingOverlay'
import useRoutes from '../../hooks/useRoutes/useRoutes'
import { getFooterProps } from './footerProps'
import { useScrollTopOnUpdate } from '@island.is/service-portal/core'
import { useLocation } from 'react-router-dom'
import MobileMenu from '../MobileMenu/MobileMenu'
import { useFooterContent } from '@island.is/service-portal/graphql'
import { useLocale } from '@island.is/localization'

const Layout: FC = ({ children }) => {
  useRoutes()
  const { locale } = useLocale()
  const data = useFooterContent(locale)
  const { pathname } = useLocation()
  useScrollTopOnUpdate([pathname])
  const footerProps = getFooterProps(data)

  return (
    <>
      <UserInfoLoadingOverlay />
      <ToastContainer useKeyframeStyles={false} />
      <Header />
      <Hidden above="md">
        <MobileMenu />
      </Hidden>
      <Box overflow="hidden" className={styles.layoutWrapper}>
        <ContentBlock>
          <Box paddingX={[2, 2, 4, 4, 6]} paddingY={[2, 2, 2, 7]}>
            <Columns space={[0, 0, 0, 'containerGutter']} collapseBelow="lg">
              <Column width="4/12">
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
        </ContentBlock>
        <Footer {...footerProps} />
      </Box>
    </>
  )
}
export default Layout
