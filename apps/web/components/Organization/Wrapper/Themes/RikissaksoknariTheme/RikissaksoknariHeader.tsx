import { Box, Hidden, Link, Text } from '@island.is/island-ui/core'
import { OrganizationPage } from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { getScreenWidthString } from '@island.is/web/utils/screenWidth'
import { CSSProperties } from '@vanilla-extract/css'
import { useMemo } from 'react'

import * as styles from './RikissaksoknariHeader.css'

const getDefaultStyle = (): CSSProperties => {
  return {
    backgroundBlendMode: 'saturation',
    backgroundRepeat: 'no-repeat',
    background: `
    url('https://images.ctfassets.net/8k0h54kbe6bj/3k02pUiq44p3Hn6eLf2VuQ/23bbe8981afa02668ddd522e3dc6988f/rikissaksoknari-mynd_1.png') no-repeat right,
    linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 92.19%),
    linear-gradient(-93.41deg, rgba(0, 72, 153, 0.4) -4.61%, rgba(0, 72, 153, 0.62) 17.93%, rgba(0, 72, 153, 0.82) 47.83%, rgba(0, 72, 153, 0.94) 71.31%, rgba(0, 72, 153, 0.95) 94.11%, #004899 114.58%)
    `,
  }
}

interface HeaderProps {
  organizationPage: OrganizationPage
}

const RikissaksoknariHeader = ({ organizationPage }: HeaderProps) => {
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
      style={n(`rikissaksoknariHeader-${screenWidth}`, getDefaultStyle())}
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
          <Box marginTop={[2, 2, 6]} textAlign={['center', 'center', 'left']}>
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

export default RikissaksoknariHeader
