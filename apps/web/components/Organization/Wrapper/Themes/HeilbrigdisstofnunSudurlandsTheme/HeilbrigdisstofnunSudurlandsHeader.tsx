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
  'https://images.ctfassets.net/8k0h54kbe6bj/2DIzJE5MwzegOM0t8vkHE0/61eb1814a2cd8b8f944891aa052fbae9/HSU-header6-new.png'
const illustrationUrl =
  'https://images.ctfassets.net/8k0h54kbe6bj/34nqJlLErUCqldBNTxZdoN/48e70eb37cfa6bc3608c509b9e5c0916/hsu-header-image.jpg'

const getDefaultStyle = (width: number) => {
  if (width >= theme.breakpoints.xl) {
    return {
      backgroundRepeat: 'no-repeat, no-repeat',
      backgroundPosition: 'bottom right',
      backgroundSize: 'contain, cover',
      backgroundImage: `url(${illustrationUrl}), url(${backgroundUrl})`,
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

const HeilbrigdisstofnunSudurlandsHeader: React.FC<HeaderProps> = ({
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
                  alt=""
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

export default HeilbrigdisstofnunSudurlandsHeader
