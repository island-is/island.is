import React from 'react'
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
  titleClassName?: string
  logoImageClassName?: string
  logoAltText?: string
  isSubpage?: boolean
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
  titleClassName,
  logoImageClassName,
  logoAltText,
  titleSectionPaddingLeft,
  isSubpage,
}) => {
  const { width } = useWindowSize()
  const imageProvided = !!image
  const logoProvided = !!logo
  const LinkWrapper = logoHref ? Link : Box

  const isMobile = width < theme.breakpoints.lg

  return (
    <>
      {logoProvided && (
        <Hidden below="lg">
          <div
            className={cn(styles.contentContainer, {
              [styles.contentContainerSubpage]: isSubpage,
            })}
          >
            <div className={styles.innerContentContainer}>
              <LinkWrapper href={logoHref as string}>
                <Box
                  className={cn(styles.logoContainer, {
                    [styles.logoContainerSubpage]: isSubpage,
                  })}
                  borderRadius="full"
                  background="white"
                >
                  <img
                    className={
                      logoImageClassName ? logoImageClassName : styles.logo
                    }
                    src={logo}
                    alt={logoAltText}
                  />
                </Box>
              </LinkWrapper>
            </div>
          </div>
        </Hidden>
      )}
      <div
        className={cn({ [styles.gridContainerWidth]: !fullWidth })}
        style={{
          background:
            isMobile || isSubpage ? mobileBackground || background : background,
        }}
      >
        <div
          className={cn(
            {
              [styles.gridContainer]: !className,
              [styles.gridContainerSubpage]: isSubpage,
            },
            className,
          )}
        >
          <div
            className={cn(styles.textContainer, {
              [styles.textContainerSubpage]: isSubpage,
            })}
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
            <div
              className={cn(styles.textInnerContainer, {
                [styles.textInnerContainerSubpage]: isSubpage,
              })}
            >
              {logoProvided && (
                <Hidden above="md">
                  <LinkWrapper href={logoHref as string}>
                    <Box
                      className={cn(styles.logoContainerMobile, {
                        [styles.logoContainerMobileSubpage]: isSubpage,
                      })}
                      borderRadius="full"
                      background="white"
                    >
                      <img
                        className={
                          isSubpage
                            ? styles.logoSubpage
                            : logoImageClassName
                            ? logoImageClassName
                            : styles.logo
                        }
                        src={logo}
                        alt={logoAltText}
                      />
                    </Box>
                  </LinkWrapper>
                </Hidden>
              )}
              <Box
                className={cn(
                  styles.title,
                  {
                    [styles.titleSubpage]: isSubpage,
                  },
                  titleClassName,
                )}
                paddingLeft={!isMobile ? titleSectionPaddingLeft : undefined}
              >
                <Text
                  variant={isSubpage ? 'h4' : 'h2'}
                  as="h1"
                  color={!customTitleColor ? titleColor : undefined}
                  className={styles.titleText}
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
          {imageProvided && !isSubpage && (
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
