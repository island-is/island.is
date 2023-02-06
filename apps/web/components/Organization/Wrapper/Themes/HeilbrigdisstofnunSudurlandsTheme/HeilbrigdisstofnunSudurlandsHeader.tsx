import { OrganizationPage } from '@island.is/web/graphql/schema'
import React, { useMemo } from 'react'
import { Box, Hidden, Link, Text } from '@island.is/island-ui/core'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { useNamespace } from '@island.is/web/hooks'
import { getScreenWidthString } from '@island.is/web/utils/screenWidth'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import * as styles from './HeilbrigdisstofnunSudurlandsHeader.css'

const getDefaultStyle = () => {
  return {
    backgroundColor: '#122771',
    backgroundRepeat: 'no-repeat',
  }
}

const getDefaultHeaderImageStyle = () => {
  return {
    position: 'absolute',
    width: 733,
    top: 0,
    left: 0,
    height: 365,
    backgroundRepeat: 'no-repeat',
    opacity: 0.5,
    backgroundSize: 'contain',
    backgroundImage:
      'linear-gradient(270.1deg, rgba(18, 39, 113, 0.2) 0.08%, rgba(18, 39, 113, 0) 103.56%), url(https://images.ctfassets.net/8k0h54kbe6bj/5VPkYND5fDBou7G0jCPCtD/2019274c76468def75fd5f340d2b3031/Mynd_-_header.png)',
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
    <Box
      style={n(`hsuHeader-${screenWidth}`, getDefaultStyle())}
      className={styles.headerBg}
    >
      <Hidden below="md">
        <Box
          style={n(
            `hsuHeaderImage-${screenWidth}`,
            getDefaultHeaderImageStyle(),
          )}
        />
      </Hidden>
      <Box className={styles.headerWrapper}>
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
          <Box marginTop={[2, 2, 6]} textAlign={['center', 'center', 'right']}>
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
      </Box>
    </Box>
  )
}

export default HeilbrigdisstofnunSudurlandsHeader
