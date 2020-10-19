import React, { FC, Suspense, useCallback, useMemo } from 'react'
import { Box, Typography } from '@island.is/island-ui/core'
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
        <Component userInfo={userInfo} client={client} />
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
      {widgets.map((widget, index) =>
        widget.utility ? (
          <Widget
            key={`widget-${index}`}
            widget={widget}
            userInfo={userInfo}
            client={client}
          />
        ) : (
          <Box marginBottom={8} key={index}>
            <Box marginBottom={2}>
              <Typography variant="h3" as="h3">
                {formatMessage(widget.name)}
              </Typography>
            </Box>
            <Widget
              key={`widget-${index}`}
              widget={widget}
              userInfo={userInfo}
              client={client}
            />
          </Box>
        ),
      )}
    </>
  )
}

export const Dashboard: FC<{}> = () => {
  const [{ modules }] = useStore()
  const { userInfo, client } = useModuleProps()

  return (
    <Box>
      <Greeting />
      {userInfo !== null && (
        <WidgetLoader modules={modules} userInfo={userInfo} client={client} />
      )}
    </Box>
  )
}

export default Dashboard
