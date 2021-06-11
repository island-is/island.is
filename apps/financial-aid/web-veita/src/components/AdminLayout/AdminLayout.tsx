import React, { ReactNode, useContext, useEffect } from 'react'
import { Logo, Text, Box, Button } from '@island.is/island-ui/core'
import { useRouter } from 'next/router'
import Link from 'next/link'

import { Nav } from '../Nav'

import * as styles from './AdminLayout.treat'

interface PageProps {
  children: ReactNode
}

const AdminLayout: React.FC<PageProps> = ({ children }) => {
  const router = useRouter()
  // const { isAuthenticated, setUser, user } = useContext(UserContext)

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
