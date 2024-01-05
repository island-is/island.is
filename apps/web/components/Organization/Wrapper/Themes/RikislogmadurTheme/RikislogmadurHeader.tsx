import { Box, Hidden, Link, Text } from '@island.is/island-ui/core'
import { OrganizationPage } from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { getScreenWidthString } from '@island.is/web/utils/screenWidth'
import { CSSProperties } from '@vanilla-extract/css'
import { useMemo } from 'react'

import * as styles from './RikislogmadurHeader.css'

const getDefaultStyle = (): CSSProperties => {
  return {
    backgroundBlendMode: 'saturation',
    background: `
          linear-gradient(178.67deg, rgba(0, 61, 133, 0.2) 1.87%, rgba(0, 61, 133, 0.3) 99.6%),
          url('https://images.ctfassets.net/8k0h54kbe6bj/c2BVu7RrN6C7tH3gvdkI0/578a34b27b455c6030c6d1cef2113fea/rikislogmadur-haus.png')`,
    backgroundRepeat: 'no-repeat',
    backgroundPositionX: '0%',
    backgroundSize: '100% 100% 100%',
  }
}

interface HeaderProps {
  organizationPage: OrganizationPage
}

const RikislogmadurHeader = ({ organizationPage }: HeaderProps) => {
  const { linkResolver } = useLinkResolver()
  const namespace = useMemo(
    () => JSON.parse(organizationPage.organization?.namespace?.fields ?? '{}'),
    [organizationPage.organization?.namespace?.fields],
  )
  const n = useNamespace(namespace)
  const { width } = useWindowSize()

  const screenWidth = getScreenWidthString(width)

  return (
    <div
      style={n(`rikislogmadurHeader-${screenWidth}`, getDefaultStyle())}
      className={styles.headerBg}
    >
      <div className={styles.headerWrapper}>
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
                  alt=""
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
          <Box marginTop={[2, 2, 6]} textAlign={['center', 'center', 'right']}>
            <Link
              href={
                linkResolver('organizationpage', [organizationPage.slug]).href
              }
            >
              <Text variant="h1" as="h1" color="blueberry600">
                {organizationPage.title}
              </Text>
            </Link>
          </Box>
        </SidebarLayout>
      </div>
    </div>
  )
}

export default RikislogmadurHeader
