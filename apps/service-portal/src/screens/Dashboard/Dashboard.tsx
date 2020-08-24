import React, { FC, Suspense } from 'react'
import { Box, Typography } from '@island.is/island-ui/core'
import { useStore } from '../../store/stateProvider'
import {
  ServicePortalWidget,
  ServicePortalModule,
} from '@island.is/service-portal/core'
import WidgetLoading from './WidgetLoading/WidgetLoading'
import { User } from 'oidc-client'

const Widget: FC<{
  widget: ServicePortalWidget
  userInfo: User
}> = React.memo(({ widget, userInfo }) => {
  const Component = widget.render(userInfo)

  if (Component)
    return (
      <Box marginBottom={8}>
        <Box marginBottom={2}>
          <Typography variant="h3" as="h3">
            {widget.name}
          </Typography>
        </Box>
        <Suspense fallback={<WidgetLoading />}>
          <Component userInfo={userInfo} />
        </Suspense>
      </Box>
    )

  return null
})

const WidgetLoader: FC<{
  modules: ServicePortalModule[]
  userInfo: User
}> = React.memo(({ modules, userInfo }) => {
  const widgets = modules
    .reduce(
      (prev, curr) => [...prev, ...curr.widgets(userInfo)],
      [] as ServicePortalWidget[],
    )
    .sort((a, b) => a.weight - b.weight)

  return (
    <>
      {widgets.map((widget, index) => (
        <Widget widget={widget} key={index} userInfo={userInfo} />
      ))}
    </>
  )
})

export const Dashboard: FC<{}> = () => {
  const [{ modules, userInfo }] = useStore()

  return (
    <Box padding={3}>
      <WidgetLoader modules={modules} userInfo={userInfo} />
    </Box>
  )
}

export default Dashboard
