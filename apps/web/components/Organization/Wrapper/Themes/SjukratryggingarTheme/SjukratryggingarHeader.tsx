import { OrganizationPage } from '@island.is/web/graphql/schema'
import React from 'react'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Link,
  Text,
} from '@island.is/island-ui/core'
import * as styles from './SjukratryggingarHeader.css'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'

interface HeaderProps {
  organizationPage: OrganizationPage
}

export const SjukratryggingarHeader: React.FC<HeaderProps> = ({
  organizationPage,
}) => {
  const { linkResolver } = useLinkResolver()

  return (
    <Box className={styles.headerBg}>
      <div className={styles.trianglesLeft}></div>
      <div className={styles.trianglesRight}></div>
      <GridContainer className={styles.headerContainer}>
        <Box className={styles.headerWrapper}>
          <SidebarLayout
            sidebarContent={
              !!organizationPage.organization.logo && (
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
                    alt=""
                  />
                </Link>
              )
            }
          >
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
            <Box
              marginTop={[2, 2, 0]}
              textAlign={['center', 'center', 'center']}
            >
              <Link
                href={
                  linkResolver('organizationpage', [organizationPage.slug]).href
                }
              >
                <Hidden below="md">
                  <div className={styles.trianglesTop}></div>
                  <img src='/assets/sjukratryggingar_title.svg' style={{width: 431, marginTop: -16}}/>
                </Hidden>
                <Hidden above='sm'>
                  <Text variant="h1" color="white">
                    {organizationPage.title}
                  </Text>
                </Hidden>
              </Link>
            </Box>
          </SidebarLayout>
        </Box>
      </GridContainer>
    </Box>
  )
}
