import {
  ServicePortalGlobalComponent,
  ServicePortalModule,
} from '@island.is/service-portal/core'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { User } from 'oidc-client'
import React, { FC, Suspense, useEffect, useMemo, useState } from 'react'
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
      <Suspense fallback={<div>loading</div>}>
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
      modules.reduce((prev, curr) => {
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

  useEffect(() => {
    loadComponents(modules)
  }, modules)

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
  const [{ modules }] = useStore()
  const { userInfo, client } = useModuleProps()

  return userInfo ? (
    <ModuleLoader modules={modules} userInfo={userInfo} client={client} />
  ) : null
}
