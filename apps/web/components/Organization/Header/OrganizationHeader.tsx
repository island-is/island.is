import React, { ReactNode } from 'react'
import { OrganizationPage } from '@island.is/web/graphql/schema'
import {
  Box,
  BreadCrumbItem,
  Breadcrumbs,
  GridContainer,
  Text,
} from '@island.is/island-ui/core'

import * as styles from './OrganizationHeader.treat'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import NextLink from 'next/link'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'

interface HeaderProps {
  organizationPage?: OrganizationPage
  mobileNav: ReactNode
  breadcrumbItems?: BreadCrumbItem[]
}

const OrganizationHeader: React.FC<HeaderProps> = ({
  organizationPage,
  mobileNav,
  breadcrumbItems,
}) => {
  const { linkResolver } = useLinkResolver()
  return (
    <>
      <Box className={styles.headerBg}>
        <Box className={styles.headerBg}>
          <GridContainer>
            <Box marginTop={[1, 1, 3]} marginBottom={5}>
              <Breadcrumbs
                color="white"
                items={breadcrumbItems ?? []}
                renderLink={(link) => {
                  return (
                    <NextLink {...linkResolver('homepage')} passHref>
                      {link}
                    </NextLink>
                  )
                }}
              />
            </Box>
          </GridContainer>
          <Box className={styles.headerWrapper}>
            <SidebarLayout sidebarContent="">
              <Box paddingTop={[2, 2, 0]} paddingBottom={[0, 0, 4, 4]}>
                <Box display="flex" flexDirection="row" alignItems="center">
                  <img
                    src={organizationPage.organization.logo.url}
                    className={styles.headerLogo}
                    alt=""
                  />
                  <Text variant="h1" as="h1" color="white">
                    {organizationPage.title}
                  </Text>
                </Box>
              </Box>
            </SidebarLayout>
            <GridContainer>
              <Box
                display={['block', 'block', 'none']}
                paddingBottom={4}
                className={styles.mobileNav}
              >
                {mobileNav}
              </Box>
            </GridContainer>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default OrganizationHeader
