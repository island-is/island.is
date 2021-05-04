import React, { useContext } from 'react'
import { useMeasure } from 'react-use'
import cn from 'classnames'
import Link, { LinkProps } from 'next/link'
import {
  Box,
  Stack,
  Text,
  Tag,
  Inline,
  TagProps,
  FocusableBox,
  TagVariant,
} from '@island.is/island-ui/core'
import { ColorSchemeContext } from '@island.is/web/context'
import { BackgroundImage } from '@island.is/web/components'
import { LinkResolverResponse } from '@island.is/web/hooks/useLinkResolver'

import * as styles from './Card.treat'
import { theme } from '@island.is/island-ui/theme'

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
            <Text
              as="h4"
              variant="small"
              fontWeight="semiBold"
              color={titleColor}
            >
              <Box display="flex" flexDirection="row" alignItems="center">
                <Box display="inlineFlex" flexGrow={1}>
                  {subTitle}
                </Box>
              </Box>
            </Text>
          )}
          <Text as="h3" variant="h3" color={titleColor}>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Box display="inlineFlex" flexGrow={1}>
                {title}
              </Box>
            </Box>
          </Text>
          {description && <Text>{description}</Text>}
          {tags.length > 0 && (
            <Box paddingTop={3} flexGrow={0} position="relative">
              <Inline space={1}>
                {tags.map(({ title, href, ...props }: CardTagsProps, index) => {
                  const tagProps = {
                    ...tagPropsDefaults,
                    ...props.tagProps,
                    variant: tagVariant,
                  }

                  return href ? (
                    <Link key={index} {...link}>
                      <Tag {...tagProps}>{title}</Tag>
                    </Link>
                  ) : (
                    <Tag key={index} {...tagProps}>
                      {title}
                    </Tag>
                  )
                })}
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
            positionX={shouldStack ? undefined : 'right'}
            background="transparent"
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
