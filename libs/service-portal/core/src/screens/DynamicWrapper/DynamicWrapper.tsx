import React, { FC, ReactNode } from 'react'
import { NotFound } from '../NotFound/NotFound'

import { useRouteMatch } from 'react-router-dom'
import { useDynamicRoutes } from '@island.is/service-portal/core'
import { SkeletonLoader } from '@island.is/island-ui/core'

interface Props {
  children: ReactNode
}

export const DynamicWrapper: FC<Props> = ({ children }) => {
  const { activeDynamicRoutes, loading } = useDynamicRoutes()

  const matches = useRouteMatch(activeDynamicRoutes)

  if (matches) {
    return <>{children}</>
  }
  if (!loading && !matches) {
    return <NotFound />
  }
  return <SkeletonLoader space={1} height={30} repeat={4} />
}
