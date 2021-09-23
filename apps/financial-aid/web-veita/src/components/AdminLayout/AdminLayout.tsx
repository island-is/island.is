import React, { ReactNode, useContext, useEffect, useState } from 'react'

import {
  Nav,
  MobileMenuButton,
} from '@island.is/financial-aid-web/veita/src/components'

import * as styles from './AdminLayout.treat'
import cn from 'classnames'
import { useRouter } from 'next/router'

import { AdminContext } from '@island.is/financial-aid-web/veita/src/components/AdminProvider/AdminProvider'

interface PageProps {
  children: ReactNode
  className?: string
}

const AdminLayout = ({ children, className }: PageProps) => {
  const { admin } = useContext(AdminContext)

  useEffect(() => {
    document.title = 'Veita • Umsóknir um fjárhagsaðstoð'
  }, [])

  const router = useRouter()
  const [showNavMobile, setShowNavMobile] = useState<boolean>(false)

  useEffect(() => {
    if (showNavMobile) {
      router.events.on('routeChangeComplete', () => {
        setShowNavMobile(false)
      })
    }
  }, [showNavMobile])

  if (!admin) {
    return <>{children}</>
  }

  return (
    <>
      <Nav showInMobile={showNavMobile} />
      <div className={` wrapper ${styles.gridWrapper} `}>
        <MobileMenuButton
          showNav={showNavMobile}
          onClick={() => {
            setShowNavMobile((showNavMobile) => !showNavMobile)
          }}
        />

        <div
          className={cn({
            [`${styles.childContainer}`]: true,
            [`${styles.mobileMenuOpen} `]: showNavMobile,
            [`${className}`]: true,
          })}
        >
          {children}
        </div>
      </div>
    </>
  )
}

export default AdminLayout
