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
import * as styles from './Layout.css'
import AuthOverlay from '../Loaders/AuthOverlay/AuthOverlay'
import useRoutes from '../../hooks/useRoutes/useRoutes'
import { useModules } from '../../hooks/useModules/useModules'
import { getFooterProps } from './footerProps'
import { useScrollTopOnUpdate } from '@island.is/service-portal/core'
import { useLocation } from 'react-router-dom'
import MobileMenu from '../MobileMenu/MobileMenu'
import { useFooterContent } from '@island.is/service-portal/graphql'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useStore } from '../../store/stateProvider'
import { RemoveScroll } from 'react-remove-scroll'

const Layout: FC = ({ children }) => {
  useRoutes()
  useModules()
  const { locale, formatMessage } = useLocale()
  useNamespaces('service.portal')
  const data = useFooterContent(locale)
  const { pathname } = useLocation()
  useScrollTopOnUpdate([pathname])
  const footerProps = getFooterProps(data, formatMessage)
  const [{ mobileMenuState }] = useStore()

  return (
    <>
      <AuthOverlay />
      <ToastContainer useKeyframeStyles={false} />
      <Header />
      {/* // counter intuitive, the scroll blocks all scrolling aside from the component that is wrapped */}
      <RemoveScroll enabled={mobileMenuState === 'open'}>
        <Hidden above="md">
          <MobileMenu />
        </Hidden>
      </RemoveScroll>
      <Box overflow="hidden" className={styles.layoutWrapper}>
        <ContentBlock>
          <Box paddingX={[2, 2, 4, 4, 6]} paddingY={[2, 2, 2, 7]}>
            <Columns space={[0, 0, 0, 3, 5]} collapseBelow="lg">
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
        </ContentBlock>
        <Hidden print={true}>
          <Footer {...footerProps} />
        </Hidden>
      </Box>
    </>
  )
}
export default Layout
