import React, { useMemo } from 'react'
import type { CSSProperties } from '@vanilla-extract/css'
import { OrganizationPage } from '@island.is/web/graphql/schema'
import { Box, Hidden, Link, Text } from '@island.is/island-ui/core'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { useNamespace } from '@island.is/web/hooks'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { getScreenWidthString } from '@island.is/web/utils/screenWidth'
import { theme } from '@island.is/island-ui/theme'
import * as styles from './TransportAuthorityHeader.css'

const getDefaultStyle = (width: number): CSSProperties => {
  if (width > theme.breakpoints.md)
    return {
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundImage:
        "url('https://images.ctfassets.net/8k0h54kbe6bj/3FlyNx2KbY9AWBt9DN1VV4/3dacbef059219b9b6dc3ff8c3b25be6c/NM-014018_Asynd_a_Island.is_v3_Hausbanner_1440x385.png')",
      backgroundPosition: '25% center',
    }
  return {
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundImage:
      "url('https://images.ctfassets.net/8k0h54kbe6bj/3FlyNx2KbY9AWBt9DN1VV4/3dacbef059219b9b6dc3ff8c3b25be6c/NM-014018_Asynd_a_Island.is_v3_Hausbanner_1440x385.png')",
    backgroundPosition: '30% center',
  }
}

interface HeaderProps {
  organizationPage: OrganizationPage
}

const TransportAuthorityHeader: React.FC<HeaderProps> = ({
  organizationPage,
}) => {
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
      style={n(
        `transportAuthorityHeader-${screenWidth}`,
        getDefaultStyle(width),
      )}
      className={styles.headerBg}
    >
      <div>
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
          <Box
            className={styles.title}
            marginTop={[2, 2, 6]}
            textAlign={['center', 'center', 'left']}
          >
            <Link
              href={
                linkResolver('organizationpage', [organizationPage.slug]).href
              }
            >
              <Text variant="h1" color="blueberry600">
                {organizationPage.title}
              </Text>
            </Link>
          </Box>
        </SidebarLayout>
      </div>
    </div>
  )
}

export default TransportAuthorityHeader
