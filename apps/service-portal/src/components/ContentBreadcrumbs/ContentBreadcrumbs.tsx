import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumbs, Box } from '@island.is/island-ui/core'
import * as styles from './ContentBreadcrumbs.treat'
import { ServicePortalPath } from '@island.is/service-portal/core'

/**
 * Deprecated way of building the breadcrumbs
 */
// type TreeItem = { url?: string; children?: TreeItem[] }
// const reduce = (
//   f: (acc: TreeItem[], n: TreeItem) => TreeItem[],
//   tree: TreeItem,
//   acc: TreeItem[],
// ) => {
//   const { children } = tree
//   const newAcc = f(acc, tree)

//   if (!children) return newAcc
//   return children.reduce((iAcc, n) => reduce(f, n, iAcc), newAcc)
// }

// const items = reduce(
//     (acc, n) => {
//       if (location.pathname.includes(n.url)) return [...acc, n]
//       else return acc
//     },
//     { url: undefined, children: navigation },
//     [],
//   )
// {items.map((item, index) => (
//           <Link key={index} to={item.url}>
//             {item.name}
//           </Link>
//         ))}

// TODO: This has to be updated to fit the newest refactors to routes and navigation
const ContentBreadcrumbs: FC<{}> = () => {
  return (
    <Box className={styles.wrapper} padding={3}>
      <Breadcrumbs>
        <Link to={ServicePortalPath.MinarSidurRoot}>Mitt Ísland</Link>
      </Breadcrumbs>
    </Box>
  )
}

export default ContentBreadcrumbs
