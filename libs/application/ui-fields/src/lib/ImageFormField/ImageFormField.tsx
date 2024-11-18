import { FieldBaseProps, ImageField } from '@island.is/application/types'
import { Box, Text } from '@island.is/island-ui/core'
import * as styles from './ImageFormField.css'
import { useLocale } from '@island.is/localization'
import { formatTextWithLocale } from '@island.is/application/core'
import { theme } from '@island.is/island-ui/theme'
import { useWindowSize } from 'react-use'
import { useEffect, useState } from 'react'
import { Locale } from '@island.is/shared/types'

interface Props extends FieldBaseProps {
  field: ImageField
}

const getImagepositionForScreenWidth = (
  imagePosition: Array<string>,
  width: number,
) => {
  if (width < theme.breakpoints.sm) {
    return imagePosition[0]
  } else if (width < theme.breakpoints.md) {
    return imagePosition[1]
  } else if (width < theme.breakpoints.lg) {
    return imagePosition[2]
  } else if (width < theme.breakpoints.xl) {
    return imagePosition[3]
  }

  return imagePosition[0] ?? 'left'
}

const getImageWidthForScreenWidth = (
  imageWidth: Array<string>,
  width: number,
) => {
  if (width < theme.breakpoints.sm) {
    return imageWidth[0]
  } else if (width < theme.breakpoints.md) {
    return imageWidth[1]
  } else if (width < theme.breakpoints.lg) {
    return imageWidth[2]
  } else if (width > theme.breakpoints.lg) {
    return imageWidth[3]
  }

  return imageWidth[0] ?? 'auto'
}

export const ImageFormField = ({ field, application }: Props) => {
  const [imagePositionForScreenWidth, setImagePositionForScreenWidth] =
    useState<string>()
  const [imageWidthForScreenWidth, setImageWidthForScreenWidth] =
    useState<string>()
  const { formatMessage, lang: locale } = useLocale()
  const { width } = useWindowSize()

  const { imageWidth, imagePosition, image: Image } = field

  useEffect(() => {
    if (typeof imagePosition === 'string') {
      setImagePositionForScreenWidth(imagePosition)
    }

    if (typeof imageWidth === 'string') {
      setImageWidthForScreenWidth(imageWidth)
    }
  }, [imagePosition, imageWidth])

  useEffect(() => {
    if (typeof imagePosition !== 'string' && imagePosition) {
      setImagePositionForScreenWidth(
        getImagepositionForScreenWidth(imagePosition, width),
      )
    }

    if (typeof imageWidth !== 'string' && imageWidth) {
      setImageWidthForScreenWidth(
        getImageWidthForScreenWidth(imageWidth, width),
      )
    }
  }, [width, imagePosition, imageWidth])

  return (
    <Box
      marginTop={field.marginTop}
      marginBottom={field.marginBottom}
      className={
        imageWidthForScreenWidth === 'full'
          ? styles.fullWidth
          : imageWidthForScreenWidth === '50%'
          ? styles.halfWidth
          : undefined
      }
    >
      {field.title && (
        <Box marginBottom={1}>
          <Text variant={field.titleVariant ?? 'h4'}>
            {formatTextWithLocale(
              field.title,
              application,
              locale as Locale,
              formatMessage,
            )}
          </Text>
        </Box>
      )}
      <Box
        display={imagePosition ? 'flex' : 'block'}
        justifyContent={
          imagePositionForScreenWidth === 'center'
            ? 'center'
            : imagePositionForScreenWidth === 'right'
            ? 'flexEnd'
            : 'flexStart'
        }
      >
        {typeof Image === 'string' ? (
          // Render a normal img element if the image is a string
          <img
            src={Image}
            alt={field.alt}
            width={
              imageWidthForScreenWidth === 'full'
                ? '100%'
                : imageWidthForScreenWidth === '50%'
                ? '50%'
                : 'auto'
            }
            height="auto"
          />
        ) : (
          // Otherwise, render a svg component
          <Image />
        )}
      </Box>
    </Box>
  )
}
