import React, { FC } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useStore } from '../../stateProvider'
import { Breadcrumbs, Box } from '@island.is/island-ui/core'
import { ServicePortalNavigationItem } from '@island.is/service-portal/core'
import * as styles from './ContentBreadcrumbs.treat'

const nodeByUrl = (url: string, data: ServicePortalNavigationItem[]) => {
  let result: ServicePortalNavigationItem | null = null

  function iter(a: ServicePortalNavigationItem) {
    if (!a) return null
    if (a.url === url) {
      result = a
      return true
    }
    return Array.isArray(a.children) && a.children.some(iter)
  }

  data.some(iter)
  return result
}

const ContentBreadcrumbs: FC<{}> = () => {
  const location = useLocation()
  const [{ navigation }] = useStore()
  const node = nodeByUrl(
    location.pathname,
    Object.keys(navigation).map((x) => navigation[x]),
  )

  const navItem = node
    ? { name: node.name, url: node.url }
    : location.pathname === '/'
    ? { name: 'Forsíða', url: '/' }
    : null

  return (
    <Box className={styles.wrapper} padding={3}>
      <Breadcrumbs>
        <Link to="/">Mitt Ísland</Link>
        {navItem && <Link to={navItem.url}>{navItem.name}</Link>}
      </Breadcrumbs>
    </Box>
  )
}

export default ContentBreadcrumbs
