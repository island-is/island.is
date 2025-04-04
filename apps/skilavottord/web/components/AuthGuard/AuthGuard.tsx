import React, { FC, ReactNode, useContext } from 'react'
import { UserContext } from '@island.is/skilavottord-web/context'
import { hasPermission, Page } from '@island.is/skilavottord-web/auth/utils'
import { NotFound } from '@island.is/skilavottord-web/components'
import { LoadingDots, Box } from '@island.is/island-ui/core'

interface AuthGuardProps {
  permission: Page
  children: ReactNode
  loading?: boolean
}

const AuthGuard: FC<AuthGuardProps> = ({ permission, children, loading }) => {
  const { user, isAuthenticated } = useContext(UserContext)

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" marginTop={4}>
        <LoadingDots />
      </Box>
    )
  }

  if (!user) {
    return null
  }

  if (!isAuthenticated || !hasPermission(permission, user?.role)) {
    return <NotFound />
  }

  return children
}

export default AuthGuard
