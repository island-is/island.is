import { Box, Hidden, Link, Text } from '@island.is/island-ui/core'
import { OrganizationPage } from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { getScreenWidthString } from '@island.is/web/utils/screenWidth'
import { useMemo } from 'react'

import * as styles from './FjarsyslaRikisinsHeader.css'

const getDefaultStyle = () => {
  return {
    backgroundBlendMode: 'saturation',
    backgroundImage:
      'url(https://images.ctfassets.net/8k0h54kbe6bj/GNOgfSn6O7XL9KC7Ma7P7/4f258a424ee5533913044e40255c8792/fjs-header-mynd.png)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat !important',
  }
}

interface HeaderProps {
  organizationPage: OrganizationPage
}

const FjarsyslaRikisinsHeader = ({ organizationPage }: HeaderProps) => {
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
      style={n(`fjarsyslanHeader-${screenWidth}`, getDefaultStyle())}
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
          <Box marginTop={[2, 2, 6]} textAlign={['center', 'center', 'right']}>
            <Link
              href={
                linkResolver('organizationpage', [organizationPage.slug]).href
              }
            >
              <Hidden above="sm">
                <Text variant="h1" as="h1" color="white">
                  {organizationPage.title}
                </Text>
              </Hidden>
              <Hidden below="md">
                <Text fontWeight="semiBold" variant="h1" as="h1" color="white">
                  {organizationPage.title}
                </Text>
              </Hidden>
            </Link>
          </Box>
        </SidebarLayout>
      </div>
    </div>
  )
}

export default FjarsyslaRikisinsHeader
