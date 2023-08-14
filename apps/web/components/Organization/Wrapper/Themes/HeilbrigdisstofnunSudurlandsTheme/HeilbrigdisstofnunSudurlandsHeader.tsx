import { OrganizationPage } from '@island.is/web/graphql/schema'
import React, { useMemo } from 'react'
import { Box, Hidden, Link, Text } from '@island.is/island-ui/core'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { useNamespace } from '@island.is/web/hooks'
import { getScreenWidthString } from '@island.is/web/utils/screenWidth'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { theme } from '@island.is/island-ui/theme'
import * as styles from './HeilbrigdisstofnunSudurlandsHeader.css'

const backgroundUrl =
  'https://images.ctfassets.net/8k0h54kbe6bj/7uF5wmEGTFORa6H4ypK8UQ/e9ad36a47ecc8a2c5776a02e2251a751/HSU_bakgrunnur.png'
const illustrationUrl =
  'https://images.ctfassets.net/8k0h54kbe6bj/sSSuQeq3oIx9hOrKRvfzm/447c7e6811c3fa9e9d548ecd4b6d7985/vector-myndir-hsu.svg'

const getDefaultStyle = (width: number) => {
  if (width > theme.breakpoints.xl) {
    return {
      background: `url(${illustrationUrl}) right -28% no-repeat, url(${backgroundUrl})`,
      backgroundRepeat: 'no-repeat, no-repeat',
      backgroundSize: '700px, cover',
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

const HeilbrigdisstofnunSudurlandsHeader: React.FC<
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

export default HeilbrigdisstofnunSudurlandsHeader
