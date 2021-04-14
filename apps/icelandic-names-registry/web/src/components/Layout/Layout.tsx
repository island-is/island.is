import React, { FC } from 'react'
import { useLocation } from 'react-router-dom'
import { Box, Hidden } from '@island.is/island-ui/core'
import { RemoveScroll } from 'react-remove-scroll'

import { useStore } from '../../store/stateProvider'
import Header from '../Header/Header'
import MobileMenu from '../MobileMenu/MobileMenu'
import { useScrollTopOnUpdate } from '../../hooks/useScrollTopOnUpdate/useScrollTopOnUpdate'

import * as styles from './Layout.treat'

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
