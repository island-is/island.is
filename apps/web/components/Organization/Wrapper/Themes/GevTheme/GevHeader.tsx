import { OrganizationPage } from '@island.is/web/graphql/schema'
import React, { useMemo } from 'react'
import { Box, Hidden, Link, Text } from '@island.is/island-ui/core'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { useNamespace } from '@island.is/web/hooks'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { getScreenWidthString } from '@island.is/web/utils/screenWidth'
import { theme } from '@island.is/island-ui/theme'
import * as styles from './GevHeader.css'

const getDefaultStyle = (width: number) => {
  if (width >= theme.breakpoints.xl)
    return {
      backgroundPosition: '97% bottom',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '170px, cover',
      backgroundImage:
        "url('https://images.ctfassets.net/8k0h54kbe6bj/13E4vIA69gDNF87pkHwJgc/c2175b5ce58e50c93ddef5ea26854740/figura.png'), url('https://images.ctfassets.net/8k0h54kbe6bj/2xPh2pJri9rHRpvSANZ1RQ/d051deadef4c1ef0a0d1378eb75d110b/gevhaus1440x385header_litur.png')",
    }
  return {
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundImage:
      "url('https://images.ctfassets.net/8k0h54kbe6bj/2xPh2pJri9rHRpvSANZ1RQ/d051deadef4c1ef0a0d1378eb75d110b/gevhaus1440x385header_litur.png')",
  }
}

interface HeaderProps {
  organizationPage: OrganizationPage
}

const GevHeader: React.FC<React.PropsWithChildren<HeaderProps>> = ({
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
      style={n(`gevHeader-${screenWidth}`, getDefaultStyle(width))}
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
                  alt="gev-logo"
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
              <Text variant="h1" as="h1" fontWeight="semiBold" color="white">
                {organizationPage.title}
              </Text>
            </Link>
          </Box>
        </SidebarLayout>
      </div>
    </div>
  )
}

export default GevHeader
