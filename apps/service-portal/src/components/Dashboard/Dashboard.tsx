import React, { FC, Suspense } from 'react'
import { Box, Typography } from '@island.is/island-ui/core'
import { useStore } from '../../store/stateProvider'
import { ServicePortalModule } from '@island.is/service-portal/core'
import ModuleLoader from '../Loaders/ModuleLoader/ModuleLoader'
import { User } from 'oidc-client'

const WidgetLoader: FC<{
  module: ServicePortalModule
  userInfo: User
}> = React.memo(({ module, userInfo }) => {
  const Widgets = module.widgets(userInfo)

  if (Widgets)
    return (
      <Box marginBottom={8}>
        <Box marginBottom={2}>
          <Typography variant="h3" as="h3">
            {module.name}
          </Typography>
        </Box>
        <Suspense fallback={<ModuleLoader />}>
          <Widgets userInfo={userInfo} />
        </Suspense>
      </Box>
    )

  return null
})

export const Dashboard: FC<{}> = () => {
  const [{ modules, userInfo }] = useStore()

  return (
    <Box padding={3}>
      {modules.map((module, index) => (
        <WidgetLoader module={module} key={index} userInfo={userInfo} />
      ))}
    </Box>
  )
}

export default Dashboard
