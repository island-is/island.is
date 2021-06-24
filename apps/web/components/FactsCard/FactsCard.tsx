import React, { useContext } from 'react'
import { useMeasure } from 'react-use'
import cn from 'classnames'
import { LinkProps } from 'next/link'
import {
  Box,
  Stack,
  Text,
  Tag,
  Inline,
  TagProps,
  FocusableBox,
  TagVariant,
  Hyphen,
} from '@island.is/island-ui/core'
import { ColorSchemeContext } from '@island.is/web/context'
import { BackgroundImage } from '@island.is/web/components'
import { LinkResolverResponse } from '@island.is/web/hooks/useLinkResolver'

import * as styles from './FactsCard.treat'

export type FactsCardTagsProps = {
  href?: string
  title: string
  subTitle?: string
}

export interface FactsCardProps {
  title: string
  subTitle?: string
  image?: { title: string; url: string }
  description: string
}

export const FactsCard = ({
  title,
  subTitle,
  image,
  description,
}: FactsCardProps) => {
  const { colorScheme } = useContext(ColorSchemeContext)
  const [ref, { width }] = useMeasure()

  const shouldStack = width < 360
  const hasImage = image?.title.length > 0

  let borderColor = null
  let titleColor = null

  switch (colorScheme) {
    case 'red':
      borderColor = 'red200'
      titleColor = 'red600'
      break
    case 'blue':
      borderColor = 'blue200'
      titleColor = 'blue400'
      break
    case 'purple':
      borderColor = 'purple200'
      titleColor = 'purple400'
      break
    default:
      borderColor = 'purple200'
      titleColor = 'blue400'
      break
  }

  const items = (
    <Box
      ref={ref}
      display="flex"
      flexGrow={1}
      flexDirection={shouldStack ? 'columnReverse' : 'row'}
      alignItems="stretch"
      justifyContent="flexEnd"
    >
      <Box style={{ width: shouldStack ? '100%' : hasImage ? '70%' : '100%' }}>
        <Stack space={1}>
          <Box display="flex" flexDirection="row" alignItems="center">
            <Box display="inlineFlex" flexGrow={1}>
              <Text variant="eyebrow">
                <Hyphen>{title}</Hyphen>
              </Text>
            </Box>
          </Box>
          {description && (
            <Text variant="h1" color="blue400">
              {description}
            </Text>
          )}
        </Stack>
      </Box>
      {hasImage && (
        <Box
          position="relative"
          style={{
            width: shouldStack ? '100%' : '30%',
            ...(shouldStack && { height: '100%' }),
          }}
          marginBottom={shouldStack ? 1 : 0}
          marginLeft={shouldStack ? 0 : 1}
        >
          <BackgroundImage
            width={300}
            positionX={shouldStack ? undefined : 'right'}
            backgroundSize="contain"
            image={image}
          />
        </Box>
      )}
    </Box>
  )

  return <FrameWrapper>{items}</FrameWrapper>
}

export const FrameWrapper = ({ children }) => {
  return (
    <Box
      className={cn(styles.card)}
      position="relative"
      borderRadius="large"
      overflow="hidden"
      background="blue100"
      outline="none"
      padding={[2, 2, 4]}
    >
      {children}
    </Box>
  )
}

export default FactsCard
