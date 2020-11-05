import React, { FC } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Breadcrumbs, Box, Hidden, Tag } from '@island.is/island-ui/core'
import {
  ServicePortalPath,
  ServicePortalNavigationItem,
} from '@island.is/service-portal/core'
import useNavigation from '../../hooks/useNavigation/useNavigation'
import { useLocale } from '@island.is/localization'
import { defineMessage } from 'react-intl'

const reduce = (
  f: (
    acc: ServicePortalNavigationItem[],
    n: ServicePortalNavigationItem,
  ) => ServicePortalNavigationItem[],
  tree: ServicePortalNavigationItem,
  acc: ServicePortalNavigationItem[],
): ServicePortalNavigationItem[] => {
  const { children } = tree
  const newAcc = f(acc, tree)

  if (!children) return newAcc
  return children.reduce((iAcc, n) => reduce(f, n, iAcc), newAcc)
}

const ContentBreadcrumbs: FC<{}> = () => {
  const navigation = useNavigation()
  const location = useLocation()
  const { formatMessage } = useLocale()
  const items: ServicePortalNavigationItem[] = reduce(
    (acc, n) => {
      if (n.path && location.pathname.includes(n.path)) return [...acc, n]
      else return acc
    },
    {
      name: 'root',
      children: navigation,
    },
    [] as ServicePortalNavigationItem[],
  )

  if (items.length < 2) return null

  return (
    <Box paddingY={[0, 2]}>
      <Breadcrumbs color="purple400" separatorColor="purple400">
        {items.map((item, index) =>
          item.path !== undefined ? (
            index === items.length - 1 ? (
              <Tag key={index} variant="purple">
                {formatMessage(item.name)}
              </Tag>
            ) : (
              <Link key={index} to={item.path}>
                {formatMessage(item.name)}
              </Link>
            )
          ) : null,
        )}
      </Breadcrumbs>
    </Box>
  )
}

export default ContentBreadcrumbs
