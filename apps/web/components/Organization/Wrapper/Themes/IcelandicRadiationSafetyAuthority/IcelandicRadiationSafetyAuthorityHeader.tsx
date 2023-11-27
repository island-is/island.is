import type { CSSProperties } from '@vanilla-extract/css'
import React, { useMemo } from 'react'
import { OrganizationPage } from '@island.is/web/graphql/schema'
import { Box, Hidden, Link, Text } from '@island.is/island-ui/core'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { useNamespace } from '@island.is/web/hooks'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { getScreenWidthString } from '@island.is/web/utils/screenWidth'
import { theme } from '@island.is/island-ui/theme'
import * as styles from './IcelandicRadiationSafetyAuthorityHeader.css'

const headerLogoUrl =
  'https://images.ctfassets.net/8k0h54kbe6bj/5KjaMY9IIB0aX0GOUU60H7/176b6ed26dc01fe4e2559ba2957e85b7/skjaldamerki-transparent.svg'

const getDefaultStyle = (width: number): CSSProperties => {
  if (width > styles.customLargeBreakpoint) {
    return {
      background: `url('${headerLogoUrl}') 90% 90% no-repeat, linear-gradient(96.23deg, rgba(1, 54, 65, 0.8) 0.85%, rgba(19, 101, 103, 0.93) 16.4%, rgba(19, 101, 103, 0.885709) 32.16%, rgba(1, 73, 87, 0.88) 56.43%, rgba(2, 69, 91, 0.98) 78.47%, rgba(1, 52, 62, 0.96) 100.8%) center no-repeat`,
    }
  }
  return {
    background: `linear-gradient(96.23deg, rgba(1, 54, 65, 0.8) 0.85%, rgba(19, 101, 103, 0.93) 16.4%, rgba(19, 101, 103, 0.885709) 32.16%, rgba(1, 73, 87, 0.88) 56.43%, rgba(2, 69, 91, 0.98) 78.47%, rgba(1, 52, 62, 0.96) 100.8%)`,
    backgroundRepeat: 'no-repeat',
  }
}

interface HeaderProps {
  organizationPage: OrganizationPage
}

const IcelandicNaturalDisasterInsuranceHeader: React.FC<HeaderProps> = ({
  organizationPage,
}) => {
  const { linkResolver } = useLinkResolver()
  const namespace = useMemo(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    () => JSON.parse(organizationPage.organization.namespace?.fields ?? '{}'),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    [organizationPage.organization.namespace?.fields],
  )
  const n = useNamespace(namespace)
  const { width } = useWindowSize()

  const screenWidth = getScreenWidthString(width)

  return (
    <div
      style={n(
        `geislavarnirRikisinsHeader-${screenWidth}`,
        getDefaultStyle(width),
      )}
      className={styles.headerBg}
    >
      <div className={styles.headerWrapper}>
        <SidebarLayout
          sidebarContent={
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore make web strict
            !!organizationPage.organization.logo && (
              <Link
                href={
                  linkResolver('organizationpage', [organizationPage.slug]).href
                }
                className={styles.iconCircle}
              >
                <img
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore make web strict
                  src={organizationPage.organization.logo.url}
                  className={styles.headerLogo}
                  alt="nti-logo"
                />
              </Link>
            )
          }
        >
          {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore make web strict
            !!organizationPage.organization.logo && (
              <Hidden above="sm">
                <Link
                  href={
                    linkResolver('organizationpage', [organizationPage.slug])
                      .href
                  }
                  className={styles.iconCircle}
                >
                  <img
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore make web strict
                    src={organizationPage.organization.logo.url}
                    className={styles.headerLogo}
                    alt=""
                  />
                </Link>
              </Hidden>
            )
          }
          <Box
            marginTop={[2, 2, 6]}
            textAlign={['center', 'center', 'left']}
            className={styles.title}
          >
            <Link
              href={
                linkResolver('organizationpage', [organizationPage.slug]).href
              }
            >
              <Text
                variant={width > theme.breakpoints.sm ? 'h1' : 'h2'}
                as="h1"
                color="white"
                fontWeight="semiBold"
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

export default IcelandicNaturalDisasterInsuranceHeader
