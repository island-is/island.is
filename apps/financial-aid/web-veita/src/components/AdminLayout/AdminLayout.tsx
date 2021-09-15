import React, { ReactNode, useEffect, useState } from 'react'

import { Nav } from '@island.is/financial-aid-web/veita/src/components/Nav'

import * as styles from './AdminLayout.treat'
import cn from 'classnames'
import { useRouter } from 'next/router'

interface PageProps {
  children: ReactNode
  className?: string
}

const AdminLayout = ({ children, className }: PageProps) => {
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

  return (
    <>
      <Nav showInMobile={showNavMobile} />
      <div className={` wrapper ${styles.gridWrapper} `}>
        <button
          className={cn({
            [`${styles.burgerMenu} burgerMenu`]: true,
            [`openBurgerMenu`]: showNavMobile,
          })}
          onClick={() => {
            setShowNavMobile(!showNavMobile)
          }}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div
          className={cn({
            [`${styles.childContainer}`]: true,
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
