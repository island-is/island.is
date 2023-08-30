import React, { useMemo } from 'react'
import { OrganizationPage } from '@island.is/web/graphql/schema'
import { Box, Hidden, Link, Text } from '@island.is/island-ui/core'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { theme } from '@island.is/island-ui/theme'
import { useNamespace } from '@island.is/web/hooks'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { getScreenWidthString } from '@island.is/web/utils/screenWidth'
import * as styles from './LandlaeknirHeader.css'

const backgroundUrl =
  'https://images.ctfassets.net/8k0h54kbe6bj/1FB32FjyMGC1PfpDfB2Kj1/257dc1108da254359f8988dfef536936/Pattern_PP_Pattern_Circle_Blue_1.png'
const illustrationUrl =
  'https://images.ctfassets.net/8k0h54kbe6bj/2p6UWMBdVkVHBAjsnX20bY/c04b402332dbae96c198db7b8640f20b/Header_illustration_1.svg'

const getDefaultStyle = (width: number) => {
  if (width >= theme.breakpoints.xl) {
    return {
      backgroundRepeat: 'no-repeat, no-repeat',
      backgroundPosition: 'bottom right',
      backgroundSize: 'contain, cover',
      backgroundImage: `url(${illustrationUrl}), url(${backgroundUrl})`,
    }
  }
  if (width >= theme.breakpoints.lg) {
    return {
      backgroundRepeat: 'no-repeat, no-repeat',
      backgroundPositionY: 'bottom',
      backgroundPositionX: '120%, 0',
      backgroundSize: 'unset',
      backgroundImage: `url(${illustrationUrl}), url(${backgroundUrl})`,
    }
  }
  return {
    backgroundRepeat: 'no-repeat, no-repeat',
    backgroundSize: 'cover',
    backgroundImage: `url(${backgroundUrl})`,
  }
}

interface HeaderProps {
  organizationPage: OrganizationPage
}

const LandlaeknirHeader: React.FC<React.PropsWithChildren<HeaderProps>> = ({
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
      style={n(`landlaeknirHeader-${screenWidth}`, getDefaultStyle(width))}
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
                  alt="landlaeknir-logo"
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
                  alt="landlaeknir-logo"
                />
              </Link>
            </Hidden>
          )}
          <Box
            className={styles.title}
            textAlign={['center', 'center', 'left']}
          >
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
      </div>
    </div>
  )
}

export default LandlaeknirHeader
