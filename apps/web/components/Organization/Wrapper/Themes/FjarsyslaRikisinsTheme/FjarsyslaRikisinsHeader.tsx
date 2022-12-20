import { Box, Hidden, Link, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { OrganizationPage } from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'

import * as styles from './FjarsyslaRikisinsHeader.css'

interface HeaderProps {
  organizationPage: OrganizationPage
}

const FjarsyslaRikisinsHeader = ({ organizationPage }: HeaderProps) => {
  const { width } = useWindowSize()
  const { linkResolver } = useLinkResolver()

  return (
    <Box className={styles.headerBg}>
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
              <Hidden above="sm">
                <Text variant="h1" as="h1" color="white">
                  {organizationPage.title}
                </Text>
              </Hidden>
              <Hidden below="md">
                <img
                  width="253px"
                  src="https://images.ctfassets.net/8k0h54kbe6bj/TqkgXfX1Zv8DGPDpNFA6U/e4fd87176da12c972df40512ee323d84/fjs-header-texti.svg"
                  alt="Fjársýsla ríkisins"
                />
              </Hidden>
            </Link>
          </Box>
        </SidebarLayout>
      </Box>
    </Box>
  )
}

export default FjarsyslaRikisinsHeader
