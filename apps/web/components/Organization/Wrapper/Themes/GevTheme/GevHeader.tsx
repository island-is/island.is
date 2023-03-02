import { OrganizationPage } from '@island.is/web/graphql/schema'
import React, { useMemo } from 'react'
import { Box, Hidden, Link, Text } from '@island.is/island-ui/core'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { useNamespace } from '@island.is/web/hooks'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { getScreenWidthString } from '@island.is/web/utils/screenWidth'
import * as styles from './GevHeader.css'

const getDefaultStyle = () => {
  return {
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundImage:
      "url('https://images.ctfassets.net/8k0h54kbe6bj/2xPh2pJri9rHRpvSANZ1RQ/666822a69cae492c650683f2f66bb248/gevhaus1440x385.png')",
  }
}

interface HeaderProps {
  organizationPage: OrganizationPage
}

const GevHeader: React.FC<HeaderProps> = ({ organizationPage }) => {
  const { linkResolver } = useLinkResolver()
  const namespace = useMemo(
    () => JSON.parse(organizationPage.organization.namespace?.fields ?? '{}'),
    [organizationPage.organization.namespace?.fields],
  )
  const n = useNamespace(namespace)
  const { width } = useWindowSize()

  const screenWidth = getScreenWidthString(width)

  return (
    <div
      style={n(`gevHeader-${screenWidth}`, getDefaultStyle())}
      className={styles.headerBg}
    >
      <div className={styles.headerWrapper}>
        <SidebarLayout
          sidebarContent={
            !!organizationPage.organization.logo && (
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
          {!!organizationPage.organization.logo && (
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
