import Link from 'next/link'

import { Box, Text } from '@island.is/island-ui/core'
import { OrganizationPage } from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'

import * as styles from './RettindagaeslaFatladsFolksHeader.css'

interface Props {
  organizationPage: OrganizationPage
  logoAltText: string
}

export const RettindagaeslaFatladsFolksHeader = ({
  organizationPage,
  logoAltText,
}: Props) => {
  const { linkResolver } = useLinkResolver()

  return (
    <Box className={styles.headerBg}>
      <Box className={styles.contentContainer}>
        <Box className={styles.innerContentContainer}>
          <Box className={styles.contentBoxContainer}>
            <img
              className={styles.image}
              alt="header image"
              src={organizationPage.defaultHeaderImage?.url}
            />
            <Box className={styles.headerTitle}>
              <Text variant="h1" as="h1">
                {organizationPage.title}
              </Text>
            </Box>
            <Link
              href={
                linkResolver('organizationpage', [organizationPage.slug]).href
              }
            >
              <Box className={styles.logoContainer}>
                <img
                  className={styles.logo}
                  src={organizationPage.organization?.logo?.url}
                  alt={logoAltText}
                />
              </Box>
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
