import { FC, ReactNode, useState, useEffect } from 'react'
import { NotFound } from '../NotFound/NotFound'

import { useDynamicRoutes } from '../../hooks/useDynamicRoutes/useDynamicRoutes'
import { SkeletonLoader } from '@island.is/island-ui/core'
import { matchPath, useLocation } from 'react-router-dom'

interface Props {
  children: ReactNode
}

export const DynamicWrapper: FC<React.PropsWithChildren<Props>> = ({
  children,
}) => {
  const [noMatch, setNoMatch] = useState(false)
  const { activeDynamicRoutes, loading } = useDynamicRoutes()
  const location = useLocation()

  const matches = activeDynamicRoutes.find((route) =>
    matchPath(route, location.pathname),
  )

  useEffect(() => {
    if (!loading && !matches) {
      setNoMatch(true)
    }
  }, [loading, matches])

  if (matches) {
    return <>{children}</>
  }

  if (noMatch) {
    return <NotFound />
  }

  return <SkeletonLoader space={1} height={30} repeat={4} />
}
