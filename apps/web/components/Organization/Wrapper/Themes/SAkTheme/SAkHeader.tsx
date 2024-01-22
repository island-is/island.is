import React, { useMemo } from 'react'

import { Box, Hidden, Link, Text } from '@island.is/island-ui/core'
import { OrganizationPage } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'

import * as styles from './SAkHeader.css'

interface HeaderProps {
  organizationPage: OrganizationPage
}

const SAkHeader: React.FC<React.PropsWithChildren<HeaderProps>> = ({
  organizationPage,
}) => {
  const { linkResolver } = useLinkResolver()
  const namespace = useMemo(
    () => JSON.parse(organizationPage.organization?.namespace?.fields ?? '{}'),
    [organizationPage.organization?.namespace?.fields],
  )
  const n = useNamespace(namespace)

  return (
    <div className={styles.headerBg}>
      <div className={styles.headerWrapper}>
        <Hidden below="lg">
          <div className={styles.headerBgImageWrapper}>
            <img
              src={n(
                `sakHeaderBgImage`,
                'https://images.ctfassets.net/8k0h54kbe6bj/4SjqwRBZRMWVWG0y73sXxq/cf8d0d16704cfea124362eca03afdb41/sak-header-trans_2x.png',
              )}
              alt=""
              className={styles.headerBgImage}
            />
          </div>
        </Hidden>
        <SidebarLayout
          hiddenOnTablet={true}
          fullWidthContent={true}
          paddingTop={[0, 0, 0, 8]}
          sidebarContent={
            !!organizationPage.organization?.logo && (
              <Link
                href={
                  linkResolver('organizationpage', [organizationPage.slug]).href
                }
                className={styles.iconCircle}
              >
                <img
                  src={organizationPage.organization.logo.url}
                  className={styles.headerLogo}
                  alt="landlaeknir-logo"
                />
              </Link>
            )
          }
        >
          {!!organizationPage.organization?.logo && (
            <Hidden above="md">
              <Link
                href={
                  linkResolver('organizationpage', [organizationPage.slug]).href
                }
                className={styles.iconCircle}
              >
                <img
                  src={organizationPage.organization.logo.url}
                  className={styles.headerLogo}
                  alt="landlaeknir-logo"
                />
              </Link>
            </Hidden>
          )}

          <Box
            marginTop={[2, 2, 2, 6]}
            textAlign={['center', 'center', 'center', 'left']}
          >
            <Link
              className={styles.titleWrapper}
              href={
                linkResolver('organizationpage', [organizationPage.slug]).href
              }
            >
              <Text variant="h1" as="h1" color="white">
                <span className={styles.title}>{organizationPage.title}</span>
              </Text>
            </Link>
          </Box>
        </SidebarLayout>
      </div>
    </div>
  )
}

export default SAkHeader
