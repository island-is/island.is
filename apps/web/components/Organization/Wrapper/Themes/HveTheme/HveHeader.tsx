import React, { useMemo } from 'react'

import { Box, Hidden, Link, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { OrganizationPage } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { useI18n } from '@island.is/web/i18n'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { getScreenWidthString } from '@island.is/web/utils/screenWidth'

import * as styles from './HveHeader.css'

const getDefaultStyle = (width: number) => {
  if (width >= theme.breakpoints.xl) {
    return {
      backgroundRepeat: 'no-repeat',
      backgroundPosition: `right bottom`,
      backgroundSize: 'auto 270px',
      backgroundImage:
        "url('https://images.ctfassets.net/8k0h54kbe6bj/7ie5X2T4g8a7g5PLvu5226/4ec8b2cb69b5cb7193a61c562f9b36e0/minstur1.png')",
      borderBottom: '8px solid #F01E28',
    }
  }
  return {
    backgroundRepeat: 'no-repeat',
    borderBottom: '8px solid #F01E28',
  }
}

interface HeaderProps {
  organizationPage: OrganizationPage
}

const HveHeader: React.FC<React.PropsWithChildren<HeaderProps>> = ({
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

  const { activeLocale } = useI18n()
  const logoAltText = n(
    'organizationLogoAltText',
    activeLocale === 'is'
      ? organizationPage.organization?.title + ' Forsíða'
      : organizationPage.organization?.title + ' Frontpage',
  )

  return (
    <div
      style={n(`hveHeader-${screenWidth}`, getDefaultStyle(width))}
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
                  alt={logoAltText}
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
                  alt={logoAltText}
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
              <Text variant="h1" as="h1" fontWeight="semiBold">
                {organizationPage.title}
              </Text>
            </Link>
          </Box>
        </SidebarLayout>
      </div>
    </div>
  )
}

export default HveHeader
