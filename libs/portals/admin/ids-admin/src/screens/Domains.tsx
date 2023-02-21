import {
  Hidden,
  Box,
  GridContainer,
  GridRow,
  GridColumn,
  Stack,
  Navigation,
} from '@island.is/island-ui/core'
import { Link, Outlet, useParams } from 'react-router-dom'
import { idsAdminNavigation } from '@island.is/portals/admin/ids-admin'
import { PortalNavigation, PortalNavigationItem } from '@island.is/portals/core'
import React from 'react'

const Domains = () => {
  const params = useParams()
  console.log(params)
  return (
    <GridContainer>
      <Hidden above="md">
        <Box paddingBottom={4}>
          <PortalNavigation
            navigation={
              idsAdminNavigation.children
                ? idsAdminNavigation.children[0]
                : ({} as PortalNavigationItem)
            }
          />
        </Box>
      </Hidden>
      <GridRow>
        <GridColumn
          span={['12/12', '12/12', '12/12', '4/12', '3/12']}
          order={[2, 2, 2, 0]}
        >
          <Stack space={3}>
            <Hidden below="lg">
              <Navigation
                title="Domain name"
                baseId={'navigation'}
                renderLink={(link, item) => {
                  console.log(item?.href)
                  return item?.href ? <Link to={item.href}>{link}</Link> : link
                }}
                items={
                  idsAdminNavigation.children
                    ? idsAdminNavigation.children[0].children?.map((child) => ({
                        href: child.path,
                        title: child.name as string,
                        active: child.active,
                        items: child.children?.map((grandChild) => ({
                          href: grandChild.path,
                          title: grandChild.name as string,
                          active: child.active,
                        })),
                      })) ?? []
                    : []
                }
              />
            </Hidden>
          </Stack>
        </GridColumn>
      </GridRow>
      <Box>
        <Outlet />
      </Box>
    </GridContainer>
  )
}

export default Domains
