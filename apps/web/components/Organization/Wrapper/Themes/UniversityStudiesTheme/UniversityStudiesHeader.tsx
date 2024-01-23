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

const getDefaultStyle = (width: number): CSSProperties => {
  if (width >= theme.breakpoints.xl) {
    return {
      backgroundImage: `url(${backgroundImageUrl})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: '1440px',
      backgroundPosition: 'center',
    }
  }
  return {
    backgroundImage: `url(${backgroundImageUrl})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }
}

interface HeaderProps {
  organizationPage: OrganizationPage
  logoAltText: string
}

const UniversityStudiesHeader: React.FC<
  React.PropsWithChildren<HeaderProps>
> = ({ organizationPage, logoAltText }) => {
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
        getDefaultStyle(width),
      )}
      className={styles.headerBg}
    >
      <Hidden below="xl">
        <Box className={styles.desktopTitleContainer}>
          <Box className={styles.desktopTitle}>
            <Link
              href={
                linkResolver('organizationpage', [organizationPage.slug]).href
              }
            >
              <Text color="white" variant="h1" fontWeight="semiBold">
                {organizationPage.title}
              </Text>
            </Link>
            <Text fontWeight="regular" color="white">
              {n(
                'allUniversityStudiesInIcelandAtTheSamePlace',
                'Allt háskólanám á Íslandi á sama stað',
              )}
            </Text>
          </Box>
        </Box>
      </Hidden>
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
                  alt={logoAltText}
                />
              </Link>
            </Box>
          </Hidden>

          <Hidden above="lg">
            <Box
              marginTop={[2, 2, 15]}
              textAlign={['center', 'center', 'left']}
            >
              <Link
                href={
                  linkResolver('organizationpage', [organizationPage.slug]).href
                }
              >
                <Text color="white" variant="h1" fontWeight="semiBold">
                  {organizationPage.title}
                </Text>
              </Link>
              <Text fontWeight="regular" color="white">
                {n(
                  'allUniversityStudiesInIcelandAtTheSamePlace',
                  'Allt háskólanám á Íslandi á sama stað',
                )}
              </Text>
            </Box>
          </Hidden>
        </SidebarLayout>
      </div>
    </div>
  )
}

export default UniversityStudiesHeader
