import React, { FC, Suspense } from 'react'
import { Box, Typography, SkeletonLoader } from '@island.is/island-ui/core'
import { useStore } from '../../stateProvider'
import { ServicePortalModule } from '@island.is/service-portal/core'

const WidgetLoader: FC<{
  module: ServicePortalModule
  activeSubjectId: string
}> = React.memo(({ module, activeSubjectId }) => {
  const moduleProps = {
    activeSubjectNationalId: activeSubjectId,
  }
  const Widgets = module.widgets(moduleProps)

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
          <Widgets />
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
      <WidgetLoader
        module={modules.applicationsModule}
        activeSubjectId={userInfo.sub.nationalId}
      />
      <WidgetLoader
        module={modules.documentsModule}
        activeSubjectId={userInfo.sub.nationalId}
      />
    </Box>
  )
}

export default Dashboard
