import React from 'react'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Link,
  Text,
} from '@island.is/island-ui/core'
import * as styles from './DigitalIcelandHeader.treat'
import cn from 'classnames'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { OrganizationPage } from '@island.is/web/graphql/schema'

interface HeaderProps {
  organizationPage: OrganizationPage
}

export const DigitalIcelandHeader: React.FC<HeaderProps> = ({
  organizationPage,
}) => {
  const { linkResolver } = useLinkResolver()

  return (
    <Box className={styles.headerBg}>
      <Box
        className={cn(styles.headerWrapper, styles.dotBg)}
        display={['none', 'none', 'block']}
      >
        <GridContainer>
          <GridRow>
            <GridColumn span={'9/12'} className={styles.imageBg}>
              <SidebarLayout
                sidebarContent={
                  !!organizationPage.organization.logo && (
                    <Link
                      href={
                        linkResolver('organizationpage', [
                          organizationPage.slug,
                        ]).href
                      }
                    >
                      <Box
                        borderRadius="circle"
                        className={styles.iconCircle}
                        background="white"
                      >
                        <img
                          src={organizationPage.organization.logo.url}
                          className={styles.headerLogo}
                          alt=""
                        />
                      </Box>
                    </Link>
                  )
                }
              />
            </GridColumn>
            <GridColumn span={'3/12'}>
              <Box className={styles.title}>
                <Text variant="h1">{organizationPage.title}</Text>
              </Box>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
      <Box display={['block', 'block', 'none']} textAlign="center">
        <Link
          href={linkResolver('organizationpage', [organizationPage.slug]).href}
        >
          <Box
            borderRadius="circle"
            className={styles.iconCircle}
            background="white"
          >
            <img
              src={organizationPage.organization.logo.url}
              className={styles.headerLogo}
              alt=""
            />
          </Box>
        </Link>
        <Text variant="h1" marginTop={2}>
          {organizationPage.title}
        </Text>
      </Box>
    </Box>
  )
}
