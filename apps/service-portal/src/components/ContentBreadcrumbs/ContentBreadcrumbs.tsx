import React, { FC } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Breadcrumbs, Box } from '@island.is/island-ui/core'
import {
  ServicePortalPath,
  ServicePortalNavigationItem,
} from '@island.is/service-portal/core'
import useNavigation from '../../hooks/useNavigation/useNavigation'

const reduce = (
  f: (
    acc: ServicePortalNavigationItem[],
    n: ServicePortalNavigationItem,
  ) => ServicePortalNavigationItem[],
  tree: ServicePortalNavigationItem,
  acc: ServicePortalNavigationItem[],
) => {
  const { children } = tree
  const newAcc = f(acc, tree)

  if (!children) return newAcc
  return children.reduce((iAcc, n) => reduce(f, n, iAcc), newAcc)
}

const ContentBreadcrumbs: FC<{}> = () => {
  const navigation = useNavigation()
  const location = useLocation()
  const items: ServicePortalNavigationItem[] = reduce(
    (acc, n) => {
      if (location.pathname.includes(n.path)) return [...acc, n]
      else return acc
    },
    {
      name: 'Mitt Ísland',
      path: ServicePortalPath.MinarSidurRoot,
      children: navigation,
    },
    [] as ServicePortalNavigationItem[],
  )

  return (
    <Box paddingY={3}>
      <Breadcrumbs>
        {items.map((item, index) => (
          <Link key={index} to={item.path}>
            {item.name}
          </Link>
        ))}
      </Breadcrumbs>
    </Box>
  )
}

export default ContentBreadcrumbs
