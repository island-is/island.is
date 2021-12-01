import React, { FC, useEffect, useState } from 'react'
import Header from '../Header/Header'
import Sidebar from '../Sidebar/Sidebar'
import {
  Box,
  Hidden,
  ToastContainer,
  GridContainer,
  GridColumn,
  GridRow,
  ResponsiveProp,
  GridColumns,
} from '@island.is/island-ui/core'
import ContentBreadcrumbs from '../../components/ContentBreadcrumbs/ContentBreadcrumbs'
import * as styles from './Layout.css'
import AuthOverlay from '../Loaders/AuthOverlay/AuthOverlay'
import useRoutes from '../../hooks/useRoutes/useRoutes'
import { useModules } from '../../hooks/useModules/useModules'
import {
  ServicePortalPath,
  useScrollTopOnUpdate,
} from '@island.is/service-portal/core'
import { useLocation } from 'react-router-dom'
import MobileMenu from '../MobileMenu/MobileMenu'
import { useNamespaces } from '@island.is/localization'
import { useStore } from '../../store/stateProvider'
import { RemoveScroll } from 'react-remove-scroll'
import { gridlayout, wideScreens } from './constants'

const Layout: FC = ({ children }) => {
  useRoutes()
  useModules()
  useNamespaces('service.portal')
  const { pathname } = useLocation()
  useScrollTopOnUpdate([pathname])
  const [{ mobileMenuState, sidebarState }] = useStore()

  const [span, setSpan] = useState<ResponsiveProp<GridColumns>>(
    gridlayout.default.span,
  )
  const [offset, setOffset] = useState<ResponsiveProp<GridColumns>>(
    gridlayout.default.offset,
  )
  const hasWideLayout = wideScreens.includes(pathname as ServicePortalPath)
  const isDefaultClosed = sidebarState === 'closed' && !hasWideLayout
  const isWideClosed = sidebarState === 'closed' && hasWideLayout
  const isWide = sidebarState === 'open' && hasWideLayout

  useEffect(() => {
    if (isWideClosed) {
      setSpan(gridlayout.wideClosed.span)
      setOffset(gridlayout.wideClosed.offset)
    } else if (isDefaultClosed) {
      setSpan(gridlayout.defaultClosed.span)
      setOffset(gridlayout.defaultClosed.offset)
    } else if (isWide) {
      setSpan(gridlayout.wide.span)
      setOffset(gridlayout.wide.offset)
    } else {
      setSpan(gridlayout.default.span)
      setOffset(gridlayout.default.offset)
    }
  }, [isDefaultClosed, isWide, isWideClosed])

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
      <Hidden below="lg">
        <Sidebar />
      </Hidden>
      <Box overflow="hidden" className={styles.layoutWrapper} paddingBottom={7}>
        <Box as="main">
          <GridContainer>
            <GridRow>
              <GridColumn
                span={span}
                offset={offset}
                className={styles.layoutGrid}
              >
                <ContentBreadcrumbs />
                <div>{children}</div>
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Box>
      </Box>
    </>
  )
}
export default Layout
