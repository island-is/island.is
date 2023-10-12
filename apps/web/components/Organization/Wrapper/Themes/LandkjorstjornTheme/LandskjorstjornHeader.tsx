import React, { useMemo } from 'react'
import { OrganizationPage } from '@island.is/web/graphql/schema'
import {
  Box,
  GridContainer,
  Hidden,
  Link,
  Text,
} from '@island.is/island-ui/core'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { useNamespace } from '@island.is/web/hooks'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { getScreenWidthString } from '@island.is/web/utils/screenWidth'
import * as styles from './LandskjorstjornHeader.css'

const getDefaultStyle = () => {
  return {
    background:
      'url(https://images.ctfassets.net/8k0h54kbe6bj/5ublWANmR5UGrUFXQ1YGh2/4a1e3d7cc8adebf072ef41d0390e299b/Haus_-_Landskjorstjorn.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }
}

interface HeaderProps {
  organizationPage: OrganizationPage
}

const LandskjorstjornHeader: React.FC<React.PropsWithChildren<HeaderProps>> = ({
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
      style={n(`landskjorstjornHeader-${screenWidth}`, getDefaultStyle())}
      className={styles.headerBg}
    >
      <GridContainer className={styles.headerContainer}>
        <div className={styles.headerWrapper}>
          <SidebarLayout
            sidebarContent={
              !!organizationPage.organization?.logo && (
                <Link
                  href={
                    linkResolver('organizationpage', [organizationPage.slug])
                      .href
                  }
                  className={styles.iconCircle}
                >
                  <img
                    src={organizationPage.organization.logo.url}
                    className={styles.headerLogo}
                    alt="organization logo"
                  />
                </Link>
              )
            }
          >
            {!!organizationPage.organization?.logo && (
              <Hidden above="sm">
                <Link
                  href={
                    linkResolver('organizationpage', [organizationPage.slug])
                      .href
                  }
                  className={styles.iconCircle}
                >
                  <img
                    src={organizationPage.organization.logo.url}
                    className={styles.headerLogo}
                    alt="organization logo"
                  />
                </Link>
              </Hidden>
            )}
            <Box
              marginTop={[2, 2, 6]}
              textAlign={['center', 'center', 'right']}
            >
              <Link
                href={
                  linkResolver('organizationpage', [organizationPage.slug]).href
                }
              >
                <Text variant="h1" color="white">
                  {organizationPage.title}
                </Text>
              </Link>
            </Box>
          </SidebarLayout>
        </div>
      </GridContainer>
    </div>
  )
}

export default LandskjorstjornHeader
