import React, { FC, Suspense } from 'react'
import {
  Box,
  Typography,
  Stack,
  Divider,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { useStore } from '../../stateProvider'
import { ServicePortalModule } from '@island.is/service-portal/core'

const WidgetLoader: FC<{ module: ServicePortalModule }> = React.memo(
  ({ module }) => {
    const Widgets = module.widgets()

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
  },
)

export const Dashboard: FC<{}> = () => {
  const [{ modules }] = useStore()

  return (
    <Box padding={3}>
      <WidgetLoader module={modules.applicationsModule} />
      <WidgetLoader module={modules.documentsModule} />
    </Box>
  )
}

export default Dashboard
