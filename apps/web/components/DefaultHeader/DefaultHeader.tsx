import React, { useEffect, useState } from 'react'
import cn from 'classnames'

import {
  Box,
  Hidden,
  Link,
  ResponsiveSpace,
  Text,
  TextProps,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useWindowSize } from '@island.is/web/hooks/useViewport'

import * as styles from './DefaultHeader.css'

export interface DefaultHeaderProps {
  fullWidth?: boolean
  image?: string
  background?: string
  mobileBackground?: string | null
  title: string
  underTitle?: string
  titleSectionPaddingLeft?: ResponsiveSpace
  logo?: string
  logoHref?: string
  titleColor?: TextProps['color']
  customTitleColor?: string
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
  mobileBackground,
  title,
  underTitle,
  logo,
  logoHref,
  titleColor = 'dark400',
  customTitleColor,
  imagePadding = '20px',
  imageIsFullHeight = true,
  imageObjectFit = 'contain',
  imageObjectPosition = 'center',
  className,
  logoAltText,
  titleSectionPaddingLeft,
}) => {
  const { width } = useWindowSize()
  const imageProvided = !!image
  const logoProvided = !!logo
  const LinkWrapper = logoHref ? Link : Box

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(width < theme.breakpoints.lg)
  }, [width])

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
          background: isMobile ? mobileBackground || background : background,
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
              <Box
                className={styles.title}
                paddingLeft={!isMobile ? titleSectionPaddingLeft : 0}
              >
                <Text
                  variant="h1"
                  as="h1"
                  color={!customTitleColor ? titleColor : undefined}
                >
                  <span style={{ color: customTitleColor }}>{title}</span>
                </Text>
                {underTitle && (
                  <Text
                    fontWeight="regular"
                    color={!customTitleColor ? titleColor : undefined}
                  >
                    <span style={{ color: customTitleColor }}>
                      {underTitle}
                    </span>
                  </Text>
                )}
              </Box>
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
