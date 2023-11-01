import React, { useMemo } from 'react'

import { Box, Hidden, Link, Text } from '@island.is/island-ui/core'
import { OrganizationPage } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'

import * as styles from './TryggingastofnunHeader.css'

interface HeaderProps {
  organizationPage: OrganizationPage
}

const TryggingastofnunHeader: React.FC<
  React.PropsWithChildren<HeaderProps>
> = ({ organizationPage }) => {
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
          <div className={styles.headerBgLogoWrapper}>
            <img
              src={n(
                `tryggingastofnunHeaderLogo`,
                'https://images.ctfassets.net/8k0h54kbe6bj/1AGuSiZPffij03q5ALWg42/134a9b74dc84372f9e38cb38d00c1570/TR-Header.png',
              )}
              alt=""
              className={styles.headerBgLogo}
            />
          </div>
        </Hidden>
        <SidebarLayout
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
                  alt="tryggingastofnun-logo"
                />
              </Link>
            )
          }
        >
          {!!organizationPage.organization?.logo && (
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
          <Box
            marginTop={[2, 2, 6]}
            textAlign={['center', 'center', 'right']}
            className={styles.headerTitleBox}
          >
            <Link
              href={
                linkResolver('organizationpage', [organizationPage.slug]).href
              }
            >
              <Text variant="h1" as="h1" fontWeight="semiBold">
                {organizationPage.title}
              </Text>
            </Link>
          </Box>
        </SidebarLayout>
      </div>
    </div>
  )
}

export default TryggingastofnunHeader
