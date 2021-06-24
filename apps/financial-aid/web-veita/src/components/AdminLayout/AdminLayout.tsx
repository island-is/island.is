import React, { ReactNode, useEffect } from 'react'

import { Nav } from '../Nav'

import * as styles from './AdminLayout.treat'

interface PageProps {
  children: ReactNode
}

const AdminLayout: React.FC<PageProps> = ({ children }) => {
  useEffect(() => {
    document.title = 'Sveita • Umsóknir um fjárhagsaðstoð'
  }, [])

  return (
    <>
      <Nav />
      <div className={` wrapper ${styles.gridWrapper}`}>
        <div className={styles.childContainer}>{children}</div>
      </div>
    </>
  )
}

export default AdminLayout
