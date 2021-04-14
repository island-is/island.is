import React, { FC } from 'react'
import Header from '../Header/Header'
import Sidebar from '../Sidebar/Sidebar'
import {
  Box,
  Columns,
  Column,
  Hidden,
  ContentBlock,
} from '@island.is/island-ui/core'
import * as styles from './Layout.treat'
import { useScrollTopOnUpdate } from '@island.is/service-portal/core'
import { useLocation } from 'react-router-dom'
import MobileMenu from '../MobileMenu/MobileMenu'
import { useStore } from '../../store/stateProvider'
import { RemoveScroll } from 'react-remove-scroll'

const Layout: FC = ({ children }) => {
  const { pathname } = useLocation()
  useScrollTopOnUpdate([pathname])
  const [{ mobileMenuState }] = useStore()

  return (
    <>
      <Header />
      {/* // counter intuitive, the scroll blocks all scrolling aside from the component that is wrapped */}
      <RemoveScroll enabled={mobileMenuState === 'open'}>
        <Hidden above="md">
          <MobileMenu />
        </Hidden>
      </RemoveScroll>
      <Box overflow="hidden" className={styles.layoutWrapper}>
        <Box as="main">{children}</Box>
      </Box>
    </>
  )
}
export default Layout
