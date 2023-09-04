import { OrganizationPage } from '@island.is/web/graphql/schema'
import React from 'react'
import { Box, Hidden, Link, Text } from '@island.is/island-ui/core'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import * as styles from './DefaultHeader.css'

const getBackgroundStyle = (organizationPage: OrganizationPage) => {
  if (
    organizationPage.themeProperties.gradientStartColor &&
    organizationPage.themeProperties.gradientEndColor
  )
    return `linear-gradient(99.09deg, ${organizationPage.themeProperties.gradientStartColor} 23.68%,
      ${organizationPage.themeProperties.gradientEndColor} 123.07%),
      linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0, 0, 0, 0) 70%)`
  return organizationPage.themeProperties.backgroundColor
}

interface HeaderProps {
  organizationPage: OrganizationPage
}

const DefaultHeader: React.FC<React.PropsWithChildren<HeaderProps>> = ({
  organizationPage,
}) => {
  const { linkResolver } = useLinkResolver()

  const imageProvided = !!organizationPage.defaultHeaderImage?.url
  const logoProvided = !!organizationPage.organization?.logo?.url

  return (
    <>
      {logoProvided && (
        <Hidden below="lg">
          <div className={styles.contentContainer}>
            <div className={styles.innerContentContainer}>
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
            </div>
          </div>
        </Hidden>
      )}
      <div className={`${imageProvided ? styles.gridContainer : ''}`}>
        <div
          className={styles.textContainer}
          style={{
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore make web strict
            background: getBackgroundStyle(organizationPage),
          }}
        >
          <div className={styles.textInnerContainer}>
            {logoProvided && (
              <Hidden above="md">
                <Link
                  href={
                    linkResolver('organizationpage', [organizationPage.slug])
                      .href
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
              </Hidden>
            )}
            <Text
              variant="h1"
              color={
                organizationPage.themeProperties.darkText ? 'dark400' : 'white'
              }
            >
              {organizationPage.title}
            </Text>
          </div>
        </div>
        {imageProvided && (
          <img
            className={styles.headerImage}
            src={organizationPage.defaultHeaderImage?.url}
            alt="header"
          ></img>
        )}
      </div>
    </>
  )
}

export default DefaultHeader
