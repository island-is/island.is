import React, { FC } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useStore } from '../../store/stateProvider'
import { Breadcrumbs, Box } from '@island.is/island-ui/core'
import * as styles from './ContentBreadcrumbs.treat'

type TreeItem = { url?: string; children?: TreeItem[] }

const reduce = (
  f: (acc: TreeItem[], n: TreeItem) => TreeItem[],
  tree: TreeItem,
  acc: TreeItem[],
) => {
  const { children } = tree
  const newAcc = f(acc, tree)

  if (!children) return newAcc
  return children.reduce((iAcc, n) => reduce(f, n, iAcc), newAcc)
}

const ContentBreadcrumbs: FC<{}> = () => {
  const location = useLocation()
  const [{ navigation }] = useStore()
  const items = reduce(
    (acc, n) => {
      if (location.pathname.includes(n.url)) return [...acc, n]
      else return acc
    },
    { url: undefined, children: navigation },
    [],
  )

  return (
    <Box className={styles.wrapper} padding={3}>
      <Breadcrumbs>
        <Link to="/">Mitt Ísland</Link>
        {items.map((item, index) => (
          <Link key={index} to={item.url}>
            {item.name}
          </Link>
        ))}
      </Breadcrumbs>
    </Box>
  )
}

export default ContentBreadcrumbs
