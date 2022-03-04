import { OrganizationPage } from '@island.is/web/graphql/schema'
import React from 'react'
import { Box, Hidden, Link, Text } from '@island.is/island-ui/core'
import * as styles from './DefaultHeader.css'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'

interface HeaderProps {
  organizationPage: OrganizationPage
}

export const DefaultHeader: React.FC<HeaderProps> = ({ organizationPage }) => {
  const { linkResolver } = useLinkResolver()

  const backgroundStyle = `linear-gradient(99.09deg, ${organizationPage.themeProperties.gradientStartColor} 23.68%,
        ${organizationPage.themeProperties.gradientEndColor} 123.07%),
        linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0, 0, 0, 0) 70%)`

  return (
    <Box className={styles.headerBg} style={{ background: backgroundStyle }}>
      <Box className={styles.headerWrapper}>
        <SidebarLayout
          sidebarContent={
            !!organizationPage.organization.logo && (
              <Link
                href={
                  linkResolver('organizationpage', [organizationPage.slug]).href
                }
              >
                <Box
                  borderRadius="circle"
                  className={styles.iconCircle}
                  background="white"
                >
                  <img
                    src={organizationPage.organization.logo.url}
                    className={styles.headerLogo}
                    alt=""
                  />
                </Box>
              </Link>
            )
          }
        >
          <Hidden above="sm">
            <Link
              href={
                linkResolver('organizationpage', [organizationPage.slug]).href
              }
            >
              {!!organizationPage.organization.logo && (
                <Box
                  borderRadius="circle"
                  className={styles.iconCircle}
                  background="white"
                >
                  <img
                    src={organizationPage.organization.logo.url}
                    className={styles.headerLogo}
                    alt=""
                  />
                </Box>
              )}
            </Link>
          </Hidden>
          <Box marginTop={[2, 2, 6]} textAlign={['center', 'center', 'right']}>
            <Text variant="h1" color="white">
              {organizationPage.title}
            </Text>
          </Box>
        </SidebarLayout>
      </Box>
    </Box>
  )
}
