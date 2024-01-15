import React, { useMemo } from 'react'
import cn from 'classnames'

import { Box, Hidden, Link, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { OrganizationPage } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { getScreenWidthString } from '@island.is/web/utils/screenWidth'

import * as styles from './SyslumennHeader.css'

const getDefaultStyle = (width: number) => {
  if (width >= theme.breakpoints.lg) {
    return {
      background: `linear-gradient(99.09deg, #003D85 23.68%, #4E8ECC 123.07%),
      linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0, 0, 0, 0) 70%),
      url('https://images.ctfassets.net/8k0h54kbe6bj/47lCoLCMeg5tCuc6HXbKyg/dc0ca3f94f536ad62e40398baa90db04/Group.svg')`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '5% 25%',
      backgroundSize: '100%, 100%, 60%',
      backgroundBlendMode: 'saturation',
    }
  }
  return {
    background: `linear-gradient(99.09deg, #003D85 23.68%, #4E8ECC 123.07%),
    linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0, 0, 0, 0) 70%)`,
    backgroundBlendMode: 'saturation',
  }
}

interface HeaderProps {
  organizationPage: OrganizationPage
  logoAltText: string
}

const SyslumennHeader: React.FC<React.PropsWithChildren<HeaderProps>> = ({
  organizationPage,
  logoAltText,
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
      style={n(`syslumennHeader-${screenWidth}`, getDefaultStyle(width))}
      className={cn(styles.headerBg)}
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
                  alt={logoAltText}
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
                  alt={logoAltText}
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
      </div>
    </div>
  )
}

export default SyslumennHeader
