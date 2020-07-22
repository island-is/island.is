import React, { FC, Suspense } from 'react'
import { Box, Typography, SkeletonLoader } from '@island.is/island-ui/core'
import { useStore } from '../../stateProvider'
import { ServicePortalModule } from '@island.is/service-portal/core'
import { JwtToken } from '../../mirage-server/models/jwt-model'

const WidgetLoader: FC<{
  module: ServicePortalModule
  userInfo: JwtToken
}> = React.memo(({ module, userInfo }) => {
  const Widgets = module.widgets(userInfo)

  if (Widgets)
    // TODO: Better loader
    return (
      <Box marginBottom={8}>
        <Box marginBottom={2}>
          <Typography variant="h3" as="h3">
            {module.name}
          </Typography>
        </Box>
        <Suspense fallback={<SkeletonLoader />}>
          <Widgets userInfo={userInfo} />
        </Suspense>
      </Box>
    )

  // TODO: Fallback
  return null
})

export const Dashboard: FC<{}> = () => {
  const [{ modules, userInfo }] = useStore()

  return (
    <Box padding={3}>
      <WidgetLoader module={modules.applicationsModule} userInfo={userInfo} />
      <WidgetLoader module={modules.documentsModule} userInfo={userInfo} />
    </Box>
  )
}

export default Dashboard
