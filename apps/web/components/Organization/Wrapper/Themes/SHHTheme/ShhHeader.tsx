import { OrganizationPage } from '@island.is/web/graphql/schema'
import React, { useMemo } from 'react'
import { Box, Hidden, Link, Text } from '@island.is/island-ui/core'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { useNamespace } from '@island.is/web/hooks'
import { getScreenWidthString } from '@island.is/web/utils/screenWidth'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { theme } from '@island.is/island-ui/theme'
import * as styles from './ShhHeader.css'

const illustrationUrl =
  'https://images.ctfassets.net/8k0h54kbe6bj/1glTNLK2OYnp9XsL4EVuVa/6813e691f7863dda32e4637de5142c71/Mynd_a___banner.svg'

const getDefaultStyle = (width: number) => {
  if (width > theme.breakpoints.xl) {
    return {
      background: `url(${illustrationUrl})  no-repeat bottom right, linear-gradient(176.84deg, #C30118 27.37%, #F65959 119.08%)`,
      backgroundRepeat: 'no-repeat, no-repeat',
      backgroundSize: '550px, cover',
    }
  }
  return {
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundImage: `linear-gradient(176.84deg, #C30118 27.37%, #F65959 119.08%)`,
  }
}

interface HeaderProps {
  organizationPage: OrganizationPage
}

const ShhHeader: React.FC<React.PropsWithChildren<HeaderProps>> = ({
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
      style={n(`hsuHeader-${screenWidth}`, getDefaultStyle(width))}
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
          <Box
            className={styles.title}
            marginTop={[2, 2, 6]}
            textAlign={['center', 'center', 'left']}
          >
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

export default ShhHeader
