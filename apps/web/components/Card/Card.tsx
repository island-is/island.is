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

import * as styles from './Card.css'

export type CardTagsProps = {
  tagProps?: Omit<TagProps, 'children'>
  href?: string
  title: string
  subTitle?: string
}

const tagPropsDefaults: Omit<TagProps, 'children'> = {
  variant: 'purple',
}

export interface CardProps {
  title: string
  subTitle?: string
  image?: { title: string; url: string }
  description: string
  tags?: Array<CardTagsProps>
  linkProps?: LinkProps
  link?: LinkResolverResponse
}

export const Card = ({
  title,
  subTitle,
  image,
  description,
  tags = [],
  link,
}: CardProps) => {
  const { colorScheme } = useContext(ColorSchemeContext)
  const [ref, { width }] = useMeasure()

  const shouldStack = width < 360
  const hasImage = image?.title.length > 0

  let borderColor = null
  let titleColor = null
  let tagVariant = 'purple' as TagVariant

  switch (colorScheme) {
    case 'red':
      borderColor = 'red200'
      titleColor = 'red600'
      tagVariant = 'red'
      break
    case 'blue':
      borderColor = 'blue200'
      titleColor = 'blue400'
      tagVariant = 'blue'
      break
    case 'purple':
      borderColor = 'purple200'
      titleColor = 'purple400'
      tagVariant = 'purple'
      break
    default:
      borderColor = 'purple200'
      titleColor = 'blue400'
      break
  }

  const visibleTags = tags.filter((t) => t.title)

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
          {!!subTitle && (
            <Box display="flex" flexDirection="row" alignItems="center">
              <Box display="inlineFlex" flexGrow={1}>
                <Text
                  as="h4"
                  variant="small"
                  fontWeight="semiBold"
                  color={titleColor}
                >
                  {subTitle}
                </Text>
              </Box>
            </Box>
          )}
          <Box display="flex" flexDirection="row" alignItems="center">
            <Box display="inlineFlex" flexGrow={1}>
              <Text as="h3" variant="h3" color={titleColor}>
                <Hyphen>{title}</Hyphen>
              </Text>
            </Box>
          </Box>
          {description && <Text>{description}</Text>}
          {visibleTags.length > 0 && (
            <Box paddingTop={3} flexGrow={0} position="relative">
              <Inline space={1}>
                {visibleTags.map(
                  ({ title, ...props }: CardTagsProps, index) => {
                    const tagProps = {
                      ...tagPropsDefaults,
                      ...props.tagProps,
                      variant: tagVariant,
                    }

                    return (
                      <Tag key={index} {...tagProps} disabled>
                        {title}
                      </Tag>
                    )
                  },
                )}
              </Inline>
            </Box>
          )}
        </Stack>
      </Box>
      {hasImage && (
        <Box
          position="relative"
          style={{
            width: shouldStack ? '100%' : '30%',
            ...(shouldStack && { height: 146 }),
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

  if (link?.href) {
    return (
      <FocusableBox
        href={link.href}
        borderRadius="large"
        flexDirection="column"
        height="full"
        width="full"
        flexGrow={1}
        background="white"
        borderColor={borderColor}
        borderWidth="standard"
      >
        <Frame>{items}</Frame>
      </FocusableBox>
    )
  }

  return <Frame>{items}</Frame>
}

export const Frame = ({ children }) => {
  return (
    <Box
      className={cn(styles.card)}
      position="relative"
      borderRadius="large"
      overflow="hidden"
      background="white"
      outline="none"
      padding={[2, 2, 4]}
    >
      {children}
    </Box>
  )
}

export default Card
