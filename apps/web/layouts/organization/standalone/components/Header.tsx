import { useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'
import cn from 'classnames'

import { ResponsiveSpace, Text, TextProps } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'

import * as styles from './Header.css'

export interface HeaderProps {
  fullWidth?: boolean
  image?: string
  background?: string
  mobileBackground?: string | null
  underTitle?: string
  titleSectionPaddingLeft?: ResponsiveSpace
  titleColor?: TextProps['color']
  imagePadding?: string
  imageIsFullHeight?: boolean
  imageObjectFit?: 'contain' | 'cover'
  imageObjectPosition?: 'left' | 'center' | 'right'
  className?: string
  isFrontpage?: boolean
}

export const Header: React.FC<React.PropsWithChildren<HeaderProps>> = ({
  fullWidth,
  image,
  background,
  mobileBackground,
  underTitle,
  titleColor = 'dark400',
  imagePadding = '20px',
  imageIsFullHeight = true,
  imageObjectFit = 'contain',
  imageObjectPosition = 'center',
  className,
  isFrontpage = false,
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
            [styles.gridContainerSubpage]: !isFrontpage,
          },
          className,
        )}
      >
        <div
          className={cn({
            [styles.textContainerNoTitle]: isFrontpage && !underTitle,
            [styles.textContainer]: isFrontpage && underTitle,
            [styles.textContainerSubpage]: !isFrontpage,
          })}
        >
          {underTitle && isFrontpage && (
            <div
              className={cn(styles.textInnerContainer, {
                [styles.textInnerContainerSubpage]: !isFrontpage,
              })}
            >
              <Text variant="h1" as="h1" color={titleColor}>
                {underTitle}
              </Text>
            </div>
          )}
        </div>
        {imageProvided && isFrontpage && (
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
