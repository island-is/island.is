import { OrganizationPage } from '@island.is/web/graphql/schema'
import React from 'react'
import { Box, Link, Text } from '@island.is/island-ui/core'
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

export const DefaultHeader: React.FC<HeaderProps> = ({ organizationPage }) => {
  const { linkResolver } = useLinkResolver()

  return (
    <Box
      className={`${
        organizationPage.defaultHeaderImage?.url ? styles.gridContainer : ''
      } ${styles.container}`}
    >
      <Box
        className={styles.headerBg}
        style={{ background: getBackgroundStyle(organizationPage) }}
      >
        <Box
          className={styles.textContainer}
          textAlign={['center', 'center', 'right']}
        >
          <Text
            variant="h1"
            color={
              organizationPage.themeProperties.darkText ? 'dark400' : 'white'
            }
          >
            {organizationPage.title}
          </Text>
        </Box>
        {!!organizationPage.organization.logo && (
          <Link
            href={
              linkResolver('organizationpage', [organizationPage.slug]).href
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
        )}
      </Box>
      {organizationPage.defaultHeaderImage?.url && (
        <img
          className={styles.headerImage}
          src={organizationPage.defaultHeaderImage.url}
          alt="header"
        ></img>
      )}
    </Box>
  )
}
