import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import React, { FC, Suspense, useState } from 'react'
import { useDeepCompareEffect } from 'react-use'

import {
  ServicePortalGlobalComponent,
  ServicePortalModule,
} from '@island.is/service-portal/core'
import { User } from '@island.is/shared/types'

import { useModuleProps } from '../../hooks/useModuleProps/useModuleProps'
import { useStore } from '../../store/stateProvider'

const GlobalComponent: FC<{
  component: ServicePortalGlobalComponent
  userInfo: User
  client: ApolloClient<NormalizedCacheObject>
}> = React.memo(({ component, userInfo, client }) => {
  const Component = component.render()

  if (Component)
    return (
      <Suspense fallback={null}>
        <Component userInfo={userInfo} client={client} {...component.props} />
      </Suspense>
    )

  return null
})

const ModuleLoader: FC<{
  modules: ServicePortalModule[]
  userInfo: User
  client: ApolloClient<NormalizedCacheObject>
}> = ({ modules, userInfo, client }) => {
  const [components, setComponents] = useState<ServicePortalGlobalComponent[]>(
    [],
  )

  async function loadComponents(modules: ServicePortalModule[]) {
    const components = await Promise.all(
      Object.values(modules).reduce((prev, curr) => {
        if (!curr.global) return prev

        const moduleComponents = curr.global({ userInfo, client })
        return [...prev, moduleComponents]
      }, [] as Promise<ServicePortalGlobalComponent[]>[]),
    )

    setComponents(
      components.reduce(
        (prev, curr) => [...prev, ...curr],
        [] as ServicePortalGlobalComponent[],
      ),
    )
  }

  // Use a deep compare of all modules to determine whether to reload them
  useDeepCompareEffect(() => {
    loadComponents(modules)
  }, [modules])

  return (
    <>
      {components.map((x, index) => (
        <GlobalComponent
          key={index}
          component={x}
          userInfo={userInfo}
          client={client}
        />
      ))}
    </>
  )
}

export const GlobalModules: FC = () => {
  const [{ modules, modulesPending }] = useStore()
  const { userInfo, client } = useModuleProps()

  return userInfo && !modulesPending ? (
    <ModuleLoader
      modules={Object.values(modules)}
      userInfo={userInfo}
      client={client}
    />
  ) : null
}
