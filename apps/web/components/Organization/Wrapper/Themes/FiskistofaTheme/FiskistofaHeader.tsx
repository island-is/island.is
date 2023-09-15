import React, { useMemo } from 'react'
import { OrganizationPage } from '@island.is/web/graphql/schema'
import { Box, Hidden, Link, Text } from '@island.is/island-ui/core'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { theme } from '@island.is/island-ui/theme'
import { useNamespace } from '@island.is/web/hooks'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { getScreenWidthString } from '@island.is/web/utils/screenWidth'
import * as styles from './FiskistofaHeader.css'

const getDefaultStyle = (width: number) => {
  if (width >= theme.breakpoints.md) {
    return {
      backgroundRepeat: 'no-repeat',
      backgroundPositionX: '52%',
      backgroundPositionY: '30%',
      backgroundImage:
        "url('https://images.ctfassets.net/8k0h54kbe6bj/7otUOlYNXerZwr0fRxkQA8/580fa8074fdb790a21e34c203658aad1/Fiskistofa-header-image.png'), linear-gradient(180deg, #E6F2FB 21.56%, #90D9E3 239.74%)",
    }
  }
  return {
    backgroundRepeat: 'no-repeat',
    backgroundPositionX: '52%',
    backgroundPositionY: '30%',
    backgroundImage: 'linear-gradient(180deg, #E6F2FB 21.56%, #90D9E3 239.74%)',
  }
}

interface HeaderProps {
  organizationPage: OrganizationPage
}

const FiskistofaHeader: React.FC<React.PropsWithChildren<HeaderProps>> = ({
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
      style={n(`fiskistofaHeader-${screenWidth}`, getDefaultStyle(width))}
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
                  alt="fiskistofa-logo"
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
              <Text variant="h1" as="h1" color="blue600" fontWeight="semiBold">
                <span className={styles.title}>{organizationPage.title}</span>
              </Text>
            </Link>
          </Box>
        </SidebarLayout>
      </div>
    </div>
  )
}

export default FiskistofaHeader
