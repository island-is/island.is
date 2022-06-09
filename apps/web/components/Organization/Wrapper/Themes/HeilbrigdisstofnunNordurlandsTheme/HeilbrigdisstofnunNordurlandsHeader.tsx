import { OrganizationPage } from '@island.is/web/graphql/schema'
import React from 'react'
import { Box, Hidden, Link, Text } from '@island.is/island-ui/core'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import * as styles from './HeilbrigdisstofnunNordurlandsHeader.css'

interface HeaderProps {
  organizationPage: OrganizationPage
}

export const HeilbrigdisstofnunNordurlandsHeader: React.FC<HeaderProps> = ({
  organizationPage,
}) => {
  const { linkResolver } = useLinkResolver()

  const backgroundImageSource =
    organizationPage.themeHeaderImage?.url ||
    'url(https://images.ctfassets.net/8k0h54kbe6bj/4v20729OMrRYkktuaCTWRi/675807c8c848895833c4a6a162f2813a/hsn-header-icon.svg)'

  return (
    <Box
      className={styles.headerBg}
      style={{
        backgroundImage: backgroundImageSource,
      }}
    >
      <Box className={styles.headerWrapper}>
        <SidebarLayout
          sidebarContent={
            !!organizationPage.organization.logo && (
              <Link
                href={
                  linkResolver('organizationpage', [organizationPage.slug]).href
                }
                className={styles.iconCircle}
              >
                <img
                  src={organizationPage.organization.logo.url}
                  className={styles.headerLogo}
                  alt=""
                />
              </Link>
            )
          }
        >
          {!!organizationPage.organization.logo && (
            <Hidden above="sm">
              <Link
                href={
                  linkResolver('organizationpage', [organizationPage.slug]).href
                }
                className={styles.iconCircle}
              >
                <img
                  src={organizationPage.organization.logo.url}
                  className={styles.headerLogo}
                  alt=""
                />
              </Link>
            </Hidden>
          )}
          <Box marginTop={[2, 2, 6]} textAlign={['center', 'center', 'right']}>
            <Link
              href={
                linkResolver('organizationpage', [organizationPage.slug]).href
              }
            >
              <Text variant="h1" as="h1" color="white">
                {organizationPage.title}
              </Text>
            </Link>
          </Box>
        </SidebarLayout>
      </Box>
    </Box>
  )
}
