import React, { useMemo } from 'react'
import { CSSProperties } from '@vanilla-extract/css'

import { Box, Hidden, Link, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { OrganizationPage } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { getScreenWidthString } from '@island.is/web/utils/screenWidth'

import * as styles from './UniversityStudies.css'

const backgroundImageUrl =
  'https://images.ctfassets.net/8k0h54kbe6bj/1F4J4R4GxCkQezDQhHPjaT/71b4afc65e6184bb42341785bb2fc539/haskolanam.svg'

const getDefaultStyle = (
  width: number,
  url: string | undefined,
): CSSProperties => {
  if (width >= theme.breakpoints.xl) {
    return {
      backgroundImage: `url(${url || backgroundImageUrl})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: '1440px',
      backgroundPosition: 'center',
    }
  } else if (width >= theme.breakpoints.lg) {
    return {
      backgroundImage: `url(${url || backgroundImageUrl})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'unset',
      backgroundPosition: 'center',
    }
  } else if (width >= theme.breakpoints.md) {
    return {
      backgroundImage: `url(${url || backgroundImageUrl})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: '992px',
      backgroundPosition: 'center',
    }
  } else if (width >= theme.breakpoints.xs) {
    return {
      background:
        'radial-gradient(132.21% 118.28% at 100% 0%, #D7E6FF 0%, #E9F1FF 18%, #F9D9B8 61.5%, #FDBD4D 100%) center/cover',
    }
  } else {
    return {}
  }
}

interface HeaderProps {
  organizationPage: OrganizationPage
}

const UniversityStudiesHeader: React.FC<
  React.PropsWithChildren<HeaderProps>
> = ({ organizationPage }) => {
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
        `universityStudiesHeader-${screenWidth}`,
        getDefaultStyle(width, organizationPage?.defaultHeaderImage?.url),
      )}
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
                  alt="university-studies-logo"
                />
              </Link>
            )
          }
        >
          <Hidden above="sm">
            <Box
              style={{
                visibility: organizationPage.organization?.logo
                  ? 'visible'
                  : 'hidden',
              }}
            >
              <Link
                href={
                  linkResolver('organizationpage', [organizationPage.slug]).href
                }
                className={styles.iconCircle}
              >
                <img
                  src={organizationPage.organization?.logo?.url}
                  className={styles.headerLogo}
                  alt=""
                />
              </Link>
            </Box>
          </Hidden>
        </SidebarLayout>
      </div>
    </div>
  )
}

export default UniversityStudiesHeader
