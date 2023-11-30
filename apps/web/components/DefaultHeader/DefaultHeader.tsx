import React from 'react'
import cn from 'classnames'

import { Box, Hidden, Link, Text, TextProps } from '@island.is/island-ui/core'

import * as styles from './DefaultHeader.css'

interface HeaderProps {
  fullWidth?: boolean
  image?: string
  background?: string
  title: string
  logo?: string
  logoHref?: string
  titleColor?: TextProps['color']
}

const DefaultHeader: React.FC<React.PropsWithChildren<HeaderProps>> = ({
  fullWidth,
  image,
  background,
  title,
  logo,
  logoHref,
  titleColor = 'dark400',
}) => {
  const imageProvided = !!image
  const logoProvided = !!logo

  const LinkWrapper = logoHref ? Link : Box

  return (
    <>
      {logoProvided && (
        <Hidden below="lg">
          <div className={styles.contentContainer}>
            <div className={styles.innerContentContainer}>
              <LinkWrapper href={logoHref as string}>
                <Box
                  className={styles.logoContainer}
                  borderRadius="circle"
                  background="white"
                >
                  <img className={styles.logo} src={logo} alt="" />
                </Box>
              </LinkWrapper>
            </div>
          </div>
        </Hidden>
      )}
      <div
        className={cn({ [styles.gridContainerWidth]: !fullWidth })}
        style={{
          background: background,
        }}
      >
        <div className={styles.gridContainer}>
          <div className={styles.textContainer}>
            <div className={styles.textInnerContainer}>
              {logoProvided && (
                <Hidden above="md">
                  <LinkWrapper href={logoHref as string}>
                    <Box
                      className={styles.logoContainerMobile}
                      borderRadius="circle"
                      background="white"
                    >
                      <img className={styles.logo} src={logo} alt="" />
                    </Box>
                  </LinkWrapper>
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
