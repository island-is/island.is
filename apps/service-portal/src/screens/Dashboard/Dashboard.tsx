import React, { FC, Suspense } from 'react'
import { Box, Typography } from '@island.is/island-ui/core'
import { useStore } from '../../store/stateProvider'
import {
  ServicePortalWidget,
  ServicePortalModule,
} from '@island.is/service-portal/core'
import WidgetLoading from './WidgetLoading/WidgetLoading'
import { UserWithMeta } from '@island.is/service-portal/core'
import { useModuleProps } from '../../hooks/useModuleProps/useModuleProps'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'

const Widget: FC<{
  widget: ServicePortalWidget
  userInfo: UserWithMeta
  client: ApolloClient<NormalizedCacheObject>
}> = React.memo(({ widget, userInfo, client }) => {
  const Component = widget.render({
    userInfo,
    client,
  })

  if (Component)
    return (
      <Box marginBottom={8}>
        <Box marginBottom={2}>
          <Typography variant="h3" as="h3">
            {widget.name}
          </Typography>
        </Box>
        <Suspense fallback={<WidgetLoading />}>
          <Component userInfo={userInfo} client={client} />
        </Suspense>
      </Box>
    )

  return null
})

const WidgetLoader: FC<{
  modules: ServicePortalModule[]
  userInfo: UserWithMeta
  client: ApolloClient<NormalizedCacheObject>
}> = React.memo(({ modules, userInfo, client }) => {
  const widgets = modules
    .reduce(
      (prev, curr) => [
        ...prev,
        ...curr.widgets({
          userInfo,
          client,
        }),
      ],
      [] as ServicePortalWidget[],
    )
    .sort((a, b) => a.weight - b.weight)

  return (
    <>
      {widgets.map((widget, index) => (
        <Widget
          widget={widget}
          key={index}
          userInfo={userInfo}
          client={client}
        />
      ))}
    </>
  )
})

export const Dashboard: FC<{}> = () => {
  const [{ modules }] = useStore()
  const { userInfo, client } = useModuleProps()

  return (
    <Box>
      {userInfo !== null && (
        <WidgetLoader modules={modules} userInfo={userInfo} client={client} />
      )}
    </Box>
  )
}

export default Dashboard
