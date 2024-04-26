import React from 'react'

import { Box, Hidden, LinkV2 } from '@island.is/island-ui/core'
import { OrganizationPage } from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'

import * as styles from './UniversityStudies.css'

interface HeaderProps {
  organizationPage: OrganizationPage
  logoAltText: string
}

const UniversityStudiesHeader: React.FC<
  React.PropsWithChildren<HeaderProps>
> = ({ organizationPage, logoAltText }) => {
  const { linkResolver } = useLinkResolver()

  return (
    <div
      className={
        styles.headerBg[organizationPage.slug === 'haskolanam' ? 'is' : 'en']
      }
    >
      <div className={styles.headerWrapper}>
        <SidebarLayout
          sidebarContent={
            !!organizationPage.organization?.logo && (
              <LinkV2
                href={
                  linkResolver('universitylandingpage', [organizationPage.slug])
                    .href
                }
                className={styles.iconCircle}
              >
                <img
                  src={organizationPage.organization.logo.url}
                  className={styles.headerLogo}
                  alt={logoAltText}
                />
              </LinkV2>
            )
          }
        >
          <Hidden above="sm">
            <Box
              style={{
                visibility: organizationPage.organization?.logo
                  ? 'visible'
                  : 'hidden',
              }}
            >
              <LinkV2
                href={
                  linkResolver('universitylandingpage', [organizationPage.slug])
                    .href
                }
                className={styles.iconCircle}
              >
                <img
                  src={organizationPage.organization?.logo?.url}
                  className={styles.headerLogo}
                  alt={logoAltText}
                />
              </LinkV2>
            </Box>
          </Hidden>
        </SidebarLayout>
      </div>
    </div>
  )
}

export default UniversityStudiesHeader
