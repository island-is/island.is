import React from 'react'

import { Box, Hidden, Link, Text, TextProps } from '@island.is/island-ui/core'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'

import * as styles from './DefaultHeader.css'

interface HeaderProps {
  fullWidth?: boolean
  image?: string
  background?: string
  title: string
  logo?: string
  titleColor?: TextProps['color']
  slug: string
}

const DefaultHeader: React.FC<React.PropsWithChildren<HeaderProps>> = ({
  fullWidth,
  image,
  background,
  title,
  logo,
  titleColor = 'dark400',
  slug,
}) => {
  const { linkResolver } = useLinkResolver()
  const imageProvided = !!image
  const logoProvided = !!logo

  return (
    <>
      {logoProvided && (
        <Hidden below="lg">
          <div className={styles.contentContainer}>
            <div className={styles.innerContentContainer}>
              <Link href={linkResolver('organizationpage', [slug]).href}>
                <Box
                  className={styles.logoContainer}
                  borderRadius="circle"
                  background="white"
                >
                  <img className={styles.logo} src={logo} alt="" />
                </Box>
              </Link>
            </div>
          </div>
        </Hidden>
      )}
      <div
        className={`${!fullWidth ? styles.gridContainerWidth : ''}`}
        style={{
          background: background,
        }}
      >
        <div className={styles.gridContainer}>
          <div className={styles.textContainer}>
            <div className={styles.textInnerContainer}>
              {logoProvided && (
                <Hidden above="md">
                  <Link href={linkResolver('organizationpage', [slug]).href}>
                    <Box
                      className={styles.logoContainerMobile}
                      borderRadius="circle"
                      background="white"
                    >
                      <img className={styles.logo} src={logo} alt="" />
                    </Box>
                  </Link>
                </Hidden>
              )}
              <Text variant="h1" as="h1" color={titleColor}>
                {title}
              </Text>
            </div>
          </div>
          {imageProvided && (
            <Hidden below="lg">
              <img className={styles.headerImage} src={image} alt="header" />
            </Hidden>
          )}
        </div>
      </div>
    </>
  )
}

export default DefaultHeader
