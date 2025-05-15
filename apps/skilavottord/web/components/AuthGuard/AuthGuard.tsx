import { Box, LoadingDots } from '@island.is/island-ui/core'
import { hasPermission, Page } from '@island.is/skilavottord-web/auth/utils'
import { Alert, AlertType } from '@island.is/skilavottord-web/components'
import { UserContext } from '@island.is/skilavottord-web/context'
import { FC, ReactNode, useContext } from 'react'

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

  if (!user || !isAuthenticated || !hasPermission(permission, user?.role)) {
    return <Alert type={AlertType.ACCESS_DENIED} />
  }

  return children
}

export default AuthGuard
