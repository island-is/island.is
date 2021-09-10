import React, { ReactNode, useEffect } from 'react'

import { Nav } from '@island.is/financial-aid-web/veita/src/components/Nav'

import * as styles from './AdminLayout.treat'
import cn from 'classnames'

interface PageProps {
  children: ReactNode
  className?: string
}

const AdminLayout = ({ children, className }: PageProps) => {
  useEffect(() => {
    document.title = 'Veita • Umsóknir um fjárhagsaðstoð'
  }, [])

  return (
    <>
      <Nav />
      <div className={` wrapper ${styles.gridWrapper} `}>
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
