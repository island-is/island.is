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
import { useScrollTopOnUpdate } from '@island.is/service-portal/core'
import { useLocation } from 'react-router-dom'
import MobileMenu from '../MobileMenu/MobileMenu'
import { useNamespaces } from '@island.is/localization'
import { useStore } from '../../store/stateProvider'
import { RemoveScroll } from 'react-remove-scroll'

const Layout: FC = ({ children }) => {
  useRoutes()
  useModules()
  useNamespaces('service.portal')
  const { pathname } = useLocation()
  useScrollTopOnUpdate([pathname])
  const [{ mobileMenuState, sidebarState }] = useStore()
  const [span, setSpan] = useState<ResponsiveProp<GridColumns>>([
    '12/12',
    '12/12',
    '12/12',
    '8/12',
    '9/12',
  ])
  const [offset, setOffset] = useState<ResponsiveProp<GridColumns>>([
    '0',
    '0',
    '0',
    '4/12',
    '3/12',
  ])

  useEffect(() => {
    if (sidebarState === 'closed' && pathname.includes('fjarmal')) {
      setSpan(['12/12', '12/12', '12/12', '11/12', '11/12'])
      setOffset(['0', '0', '0', '1/12', '1/12'])
    } else if (sidebarState === 'closed' && !pathname.includes('fjarmal')) {
      setSpan(['12/12', '12/12', '12/12', '10/12', '10/12'])
      setOffset(['0', '0', '0', '2/12', '2/12'])
    } else if (sidebarState === 'open' && pathname.includes('fjarmal')) {
      setSpan(['12/12', '12/12', '12/12', '9/12', '10/12'])
      setOffset(['0', '0', '0', '3/12', '2/12'])
    } else {
      setSpan(['12/12', '12/12', '12/12', '8/12', '9/12'])
      setOffset(['0', '0', '0', '4/12', '3/12'])
    }
  }, [sidebarState, pathname])

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
      <Box overflow="hidden" className={styles.layoutWrapper} width="full">
        <Hidden below="lg">
          <Sidebar />
        </Hidden>
        <Box as="main">
          <GridContainer>
            <GridRow>
              <GridColumn span={span} offset={offset}>
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
