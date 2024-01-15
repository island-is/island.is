import React, { useMemo } from 'react'
import cn from 'classnames'

import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Link,
  Text,
} from '@island.is/island-ui/core'
import { OrganizationPage } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { useI18n } from '@island.is/web/i18n'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'

import * as styles from './DigitalIcelandHeader.css'
interface HeaderProps {
  organizationPage: OrganizationPage
}

const DigitalIcelandHeader: React.FC<React.PropsWithChildren<HeaderProps>> = ({
  organizationPage,
}) => {
  const { linkResolver } = useLinkResolver()
  const namespace = useMemo(
    () => JSON.parse(organizationPage.organization?.namespace?.fields ?? '{}'),
    [organizationPage.organization?.namespace?.fields],
  )
  const n = useNamespace(namespace)
  const { activeLocale } = useI18n()
  const logoAltText = n(
    'organizationLogoAltText',
    activeLocale === 'is'
      ? organizationPage.organization?.title + ' Forsíða'
      : organizationPage.organization?.title + ' Frontpage',
  )

  return (
    <div className={styles.headerBg}>
      <Box
        className={cn(styles.headerWrapper, styles.dotBg)}
        display={['none', 'none', 'block']}
      >
        <GridContainer>
          <GridRow>
            <GridColumn span={'9/12'} className={styles.imageBg}>
              <SidebarLayout
                sidebarContent={
                  !!organizationPage.organization?.logo && (
                    <Link
                      href={
                        linkResolver('organizationpage', [
                          organizationPage.slug,
                        ]).href
                      }
                      className={styles.iconCircle}
                    >
                      <img
                        src={organizationPage.organization.logo.url}
                        className={styles.headerLogo}
                        alt={logoAltText}
                      />
                    </Link>
                  )
                }
              />
            </GridColumn>
            <GridColumn span={'3/12'}>
              <Box className={styles.title}>
                <Link
                  href={
                    linkResolver('organizationpage', [organizationPage.slug])
                      .href
                  }
                >
                  <Text variant="h1">{organizationPage.title}</Text>
                </Link>
              </Box>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>

      <Box display={['block', 'block', 'none']} textAlign="center">
        {!!organizationPage.organization?.logo && (
          <Link
            href={
              linkResolver('organizationpage', [organizationPage.slug]).href
            }
            className={styles.iconCircle}
          >
            <img
              src={organizationPage.organization.logo.url}
              className={styles.headerLogo}
              alt={logoAltText}
            />
          </Link>
        )}
        <Text variant="h1" marginTop={2}>
          {organizationPage.title}
        </Text>
      </Box>
    </div>
  )
}

export default DigitalIcelandHeader
