import React, { useMemo } from 'react'
import { CSSProperties } from '@vanilla-extract/css'
import { OrganizationPage } from '@island.is/web/graphql/schema'
import { Box, Hidden, Link, Text } from '@island.is/island-ui/core'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { useNamespace } from '@island.is/web/hooks'
import { getScreenWidthString } from '@island.is/web/utils/screenWidth'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { theme } from '@island.is/island-ui/theme'
import * as styles from './HeilbrigdisstofnunAusturlandsHeader.css'

const backgroundUrl =
  'https://images.ctfassets.net/8k0h54kbe6bj/7KSc019xiyRx6okLtw18Rt/72a618924f7bab4d6c8f4b69481813a8/Header_-_vector.jpg'

const getDefaultStyle = (width: number): CSSProperties => {
  if (width > theme.breakpoints.xl) {
    return {
      backgroundImage: `url(${backgroundUrl})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100% 350px',
      backgroundPosition: 'center bottom',
    }
  }
  if (width >= theme.breakpoints.md) {
    return {
      backgroundImage: `url(${backgroundUrl})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100% 200px',
      backgroundPosition: 'center bottom',
    }
  }
  return {
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundImage: `url(${backgroundUrl})`,
  }
}

interface HeaderProps {
  organizationPage: OrganizationPage
}

const HeilbrigdisstofnunAusturlandsHeader: React.FC<
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
      style={n(`hsaHeader-${screenWidth}`, getDefaultStyle(width))}
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
          <Box marginTop={[2, 2, 0]} textAlign={['center', 'center', 'left']}>
            <Link
              href={
                linkResolver('organizationpage', [organizationPage.slug]).href
              }
            >
              <Text
                color={width > theme.breakpoints.md ? 'blueberry600' : 'white'}
                variant="h1"
              >
                {organizationPage.title}
              </Text>
            </Link>
          </Box>
        </SidebarLayout>
      </div>
    </div>
  )
}

export default HeilbrigdisstofnunAusturlandsHeader
