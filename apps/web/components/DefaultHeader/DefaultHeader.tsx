import React from 'react'
import cn from 'classnames'

import { Box, Hidden, Link, Text, TextProps } from '@island.is/island-ui/core'

import * as styles from './DefaultHeader.css'

export interface DefaultHeaderProps {
  fullWidth?: boolean
  image?: string
  background?: string
  title: string
  underTitle?: string
  logo?: string
  logoHref?: string
  titleColor?: TextProps['color']
  imagePadding?: string
  imageIsFullHeight?: boolean
  imageObjectFit?: 'contain' | 'cover'
  imageObjectPosition?: 'left' | 'center' | 'right'
  className?: string
  logoAltText?: string
}

export const DefaultHeader: React.FC<
  React.PropsWithChildren<DefaultHeaderProps>
> = ({
  fullWidth,
  image,
  background,
  title,
  underTitle,
  logo,
  logoHref,
  titleColor = 'dark400',
  imagePadding = '20px',
  imageIsFullHeight = true,
  imageObjectFit = 'contain',
  imageObjectPosition = 'center',
  className,
  logoAltText,
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
                  <img className={styles.logo} src={logo} alt={logoAltText} />
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
        <div
          className={cn(
            {
              [styles.gridContainer]: !className,
            },
            className,
          )}
        >
          <div
            className={styles.textContainer}
            style={
              !logoProvided
                ? {
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }
                : {}
            }
          >
            <div className={styles.textInnerContainer}>
              {logoProvided && (
                <Hidden above="md">
                  <LinkWrapper href={logoHref as string}>
                    <Box
                      className={styles.logoContainerMobile}
                      borderRadius="circle"
                      background="white"
                    >
                      <img
                        className={styles.logo}
                        src={logo}
                        alt={logoAltText}
                      />
                    </Box>
                  </LinkWrapper>
                </Hidden>
              )}
              <div className={styles.title}>
                <Text variant="h1" as="h1" color={titleColor}>
                  {title}
                </Text>
                {underTitle && (
                  <Text fontWeight="regular" color={titleColor}>
                    {underTitle}
                  </Text>
                )}
              </div>
            </div>
          </div>
          {imageProvided && (
            <Hidden below="lg">
              <img
                style={{
                  padding: imagePadding,
                  objectFit: imageObjectFit,
                  objectPosition: imageObjectPosition,
                  height: imageIsFullHeight ? '100%' : undefined,
                }}
                className={styles.headerImage}
                src={image}
                alt=""
              />
            </Hidden>
          )}
        </div>
      </div>
    </>
  )
}
