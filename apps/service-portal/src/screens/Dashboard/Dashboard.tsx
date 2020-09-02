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
import { ApolloClient, NormalizedCacheObject, useQuery } from '@apollo/client'
import { GET_FRONTPAGE_SLIDES } from '@island.is/service-portal/graphql'
import { Query, QueryGetFrontpageSliderListArgs } from '@island.is/api/schema'
import Hero from '../../components/Hero/Hero'

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
  const moduleProps = useModuleProps()
  const { data, loading } = useQuery<Query, QueryGetFrontpageSliderListArgs>(
    GET_FRONTPAGE_SLIDES,
    {
      variables: {
        input: {
          lang: 'is',
        },
      },
    },
  )

  return (
    <Box>
      <Hero content={data?.getFrontpageSliderList} loading={loading} />
      <WidgetLoader modules={modules} {...moduleProps} />
    </Box>
  )
}

export default Dashboard
