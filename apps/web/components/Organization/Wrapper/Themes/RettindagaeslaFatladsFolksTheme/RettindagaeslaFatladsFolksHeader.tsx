import { OrganizationPage } from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import { useWindowSize } from 'react-use'
import * as styles from './RettindagaeslaFatladsFolksHeader.css'
import { Box, Text } from '@island.is/island-ui/core'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { theme } from '@island.is/island-ui/theme'
interface Props {
  organizationPage: OrganizationPage
}

const RettindagaeslaFatladsFolksHeader = ({ organizationPage }: Props) => {
  const { linkResolver } = useLinkResolver()
  const { width } = useWindowSize()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (width < theme.breakpoints.lg) {
      return setIsMobile(true)
    }
    return setIsMobile(false)
  }, [width])

  return (
    <div className={styles.headerBg}>
      <div className={styles.contentContainer}>
        <div className={styles.innerContentContainer}>
          {!isMobile ? (
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
              <Text variant="h1">{organizationPage.title}</Text>
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
