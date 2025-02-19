import { useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'
import cn from 'classnames'

import {
  Box,
  Hidden,
  ResponsiveSpace,
  Stack,
  Text,
  TextProps,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { SearchInput } from '@island.is/web/components'
import { useI18n } from '@island.is/web/i18n'

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
  organizationSlug?: string
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
  organizationSlug,
}) => {
  const { width } = useWindowSize()
  const { activeLocale } = useI18n()
  const imageProvided = !!image

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(width < theme.breakpoints.lg)
  }, [width])
  return (
    <Stack space={2}>
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
              <div className={cn(styles.textInnerContainer)}>
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
      {isFrontpage && (
        <Hidden above="md">
          <Box marginX={3}>
            <SearchInput
              size="medium"
              activeLocale={activeLocale}
              placeholder={activeLocale === 'is' ? 'Leit' : 'Search'}
              organization={organizationSlug}
            />
          </Box>
        </Hidden>
      )}
    </Stack>
  )
}
