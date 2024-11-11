import { useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'
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

import * as styles from './Header.css'

export interface HeaderProps {
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

export const Header: React.FC<React.PropsWithChildren<HeaderProps>> = ({
  fullWidth,
  image,
  background,
  mobileBackground,
  title,
  underTitle,
  titleColor = 'dark400',
  customTitleColor,
  imagePadding = '20px',
  imageIsFullHeight = true,
  imageObjectFit = 'contain',
  imageObjectPosition = 'center',
  className,
  isSubpage,
}) => {
  const { width } = useWindowSize()
  const imageProvided = !!image

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(width < theme.breakpoints.lg)
  }, [width])
  return (
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
            [styles.gridContainerSubpage]: isSubpage,
          },
          className,
        )}
      >
        <div
          className={cn(styles.textContainer, {
            [styles.textContainerSubpage]: isSubpage,
          })}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div
            className={cn(styles.textInnerContainer, {
              [styles.textInnerContainerSubpage]: isSubpage,
            })}
          ></div>
        </div>
        {imageProvided && !isSubpage && (
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
        )}
      </div>
    </div>
  )
}
