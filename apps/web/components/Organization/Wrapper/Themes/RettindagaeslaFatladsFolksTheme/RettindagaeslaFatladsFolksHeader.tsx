import { useMemo } from 'react'
import Link from 'next/link'

import { Box, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { OrganizationPage } from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { useI18n } from '@island.is/web/i18n'

import * as styles from './RettindagaeslaFatladsFolksHeader.css'

interface Props {
  organizationPage: OrganizationPage
}

const RettindagaeslaFatladsFolksHeader = ({ organizationPage }: Props) => {
  const { linkResolver } = useLinkResolver()
  const namespace = useMemo(
    () => JSON.parse(organizationPage.organization?.namespace?.fields ?? '{}'),
    [organizationPage.organization?.namespace?.fields],
  )
  const n = useNamespace(namespace)

  const { width } = useWindowSize()
  const isMobileScreenWidth = width < theme.breakpoints.lg

  const { activeLocale } = useI18n()
  const logoAltText = n(
    'organizationLogoAltText',
    activeLocale === 'is'
      ? organizationPage.organization?.title + ' Forsíða'
      : organizationPage.organization?.title + ' Frontpage',
  )

  return (
    <div className={styles.headerBg}>
      <div className={styles.contentContainer}>
        <div className={styles.innerContentContainer}>
          {!isMobileScreenWidth ? (
            <>
              <Box
                alignItems="center"
                display="flex"
                justifyContent="flexStart"
                flexDirection="row"
                columnGap="containerGutter"
              >
                <img
                  className={styles.image}
                  alt="header"
                  src={organizationPage.defaultHeaderImage?.url}
                />
                <Text variant="h1">{organizationPage.title}</Text>
              </Box>
              <Link
                href={
                  linkResolver('organizationpage', [organizationPage.slug]).href
                }
              >
                <Box
                  className={styles.logoContainer}
                  borderRadius="circle"
                  background="white"
                >
                  <img
                    className={styles.logo}
                    src={organizationPage.organization?.logo?.url}
                    alt={logoAltText}
                  />
                </Box>
              </Link>
            </>
          ) : (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              rowGap="gutter"
            >
              <img
                className={styles.image}
                alt="header"
                src={organizationPage.defaultHeaderImage?.url}
              />
              <div className={styles.mobileHeaderTitle}>
                <Text variant="h1">{organizationPage.title}</Text>
              </div>
              <Link
                href={
                  linkResolver('organizationpage', [organizationPage.slug]).href
                }
              >
                <Box
                  className={styles.logoContainerMobile}
                  borderRadius="circle"
                  background="white"
                >
                  <img
                    className={styles.logo}
                    src={organizationPage.organization?.logo?.url}
                    alt={logoAltText}
                  />
                </Box>
              </Link>
            </Box>
          )}
        </div>
      </div>
    </div>
  )
}

export default RettindagaeslaFatladsFolksHeader
