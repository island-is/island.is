import React, { FC, Suspense, useCallback, useMemo } from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { useStore } from '../../store/stateProvider'
import {
  ServicePortalWidget,
  ServicePortalModule,
} from '@island.is/service-portal/core'
import WidgetLoading from './WidgetLoading/WidgetLoading'
import { useModuleProps } from '../../hooks/useModuleProps/useModuleProps'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import Greeting from '../../components/Greeting/Greeting'
import { User } from 'oidc-client'
import { useLocale } from '@island.is/localization'
import { WidgetErrorBoundary } from './WidgetError/WidgetError'

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
