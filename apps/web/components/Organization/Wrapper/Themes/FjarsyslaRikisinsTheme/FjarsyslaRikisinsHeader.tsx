import { Box, Hidden, Link, Text } from '@island.is/island-ui/core'
import { OrganizationPage } from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'

import * as styles from './FjarsyslaRikisinsHeader.css'

interface HeaderProps {
  organizationPage: OrganizationPage
}

const FjarsyslaRikisinsHeader = ({ organizationPage }: HeaderProps) => {
  const { linkResolver } = useLinkResolver()

  return (
    <div className={styles.headerBg}>
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
