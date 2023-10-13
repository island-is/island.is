import Link from 'next/link'
import { OrganizationPage } from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import { Box, Text } from '@island.is/island-ui/core'
import * as styles from './RettindagaeslaFatladsFolksHeader.css'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'

interface Props {
  organizationPage: OrganizationPage
}

const RettindagaeslaFatladsFolksHeader = ({ organizationPage }: Props) => {
  const { linkResolver } = useLinkResolver()
  const { width } = useWindowSize()
  const isMobileScreenWidth = width < theme.breakpoints.lg

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
                    alt=""
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
                    alt=""
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
