import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import React, { FC, Suspense, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  PlausiblePageviewDetail,
  ServicePortalModule,
  ServicePortalPath,
  ServicePortalWidget,
} from '@island.is/service-portal/core'
import { User } from '@island.is/shared/types'

import Greeting from '../../components/Greeting/Greeting'
import { useModuleProps } from '../../hooks/useModuleProps/useModuleProps'
import { useStore } from '../../store/stateProvider'
import { WidgetErrorBoundary } from './WidgetError/WidgetError'
import WidgetLoading from './WidgetLoading/WidgetLoading'

const Widget: FC<{
  widget: ServicePortalWidget
  userInfo: User
  client: ApolloClient<NormalizedCacheObject>
}> = React.memo(({ widget, userInfo, client }) => {
  const Component = widget.render({
    userInfo,
    client,
  })

  if (Component)
    return (
      <Suspense fallback={<WidgetLoading />}>
        <WidgetErrorBoundary name={widget.name}>
          <Component userInfo={userInfo} client={client} />
        </WidgetErrorBoundary>
      </Suspense>
    )

  return null
})

const WidgetLoader: FC<{
  modules: ServicePortalModule[]
  userInfo: User
  client: ApolloClient<NormalizedCacheObject>
}> = ({ modules, userInfo, client }) => {
  const { formatMessage } = useLocale()
  const widgets = useMemo(
    () =>
      modules
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
        .sort((a, b) => a.weight - b.weight),
    [modules, userInfo, client],
  )

  return (
    <>
      {widgets.map((widget, index) => (
        <Box marginBottom={8} key={index}>
          <Box marginBottom={2}>
            <Text variant="h3" as="h3">
              {formatMessage(widget.name)}
            </Text>
          </Box>
          <Widget
            key={`widget-${index}`}
            widget={widget}
            userInfo={userInfo}
            client={client}
          />
        </Box>
      ))}
    </>
  )
}

export const Dashboard: FC<{}> = () => {
  const [{ modules, modulesPending }] = useStore()
  const { userInfo, client } = useModuleProps()
  const location = useLocation()

  useEffect(() => {
    PlausiblePageviewDetail(ServicePortalPath.MinarSidurRoot)
  }, [location])

  return (
    <Box>
      <Greeting />
      {userInfo !== null && !modulesPending && (
        <WidgetLoader
          modules={Object.values(modules)}
          userInfo={userInfo}
          client={client}
        />
      )}
    </Box>
  )
}

export default Dashboard
