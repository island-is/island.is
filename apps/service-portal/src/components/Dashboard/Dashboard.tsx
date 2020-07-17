import React, { FC, Suspense } from 'react'
import {
  Box,
  Typography,
  Stack,
  Divider,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { useStateValue } from '../../stateProvider'
import { ServicePortalModule } from '@island.is/service-portal/core'

const WidgetLoader: FC<{ module: ServicePortalModule }> = React.memo(
  ({ module }) => {
    const Widgets = module.widgets()

    if (Widgets)
      // TODO: Better loader
      return (
        <Suspense fallback={<SkeletonLoader />}>
          <Widgets />
        </Suspense>
      )

    // TODO: Fallback
    return null
  },
)

export const Dashboard: FC<{}> = () => {
  const [{ modules }] = useStateValue()

  return (
    <Box padding={4}>
      <Stack space={[1, 1, 2]}>
        <Typography variant="h4" as="h4">
          Dashboard
        </Typography>
        <Divider />
        <WidgetLoader module={modules.applicationsModule} />
      </Stack>
    </Box>
  )
}

export default Dashboard
