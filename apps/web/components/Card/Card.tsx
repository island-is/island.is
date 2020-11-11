/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useContext } from 'react'
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
  Icon,
  FocusableBox,
  TagVariant,
} from '@island.is/island-ui/core'
import { ColorSchemeContext } from '@island.is/web/context'
import { Image } from '@island.is/web/graphql/schema'
import { BackgroundImage } from '@island.is/web/components'

import * as styles from './Card.treat'

export type CardTagsProps = {
  tagProps?: Omit<TagProps, 'children'>
  href?: string
  as?: string
  title: string
}

const tagPropsDefaults: Omit<TagProps, 'children'> = {
  variant: 'purple',
}

interface CardProps {
  title: string
  image?: Image
  description: string
  tags?: Array<CardTagsProps>
  linkProps?: LinkProps
  href?: string
  as?: string
  status?: string
}

export const Card: FC<CardProps> = ({
  title,
  image,
  description,
  tags = [],
  href,
  as,
  status,
}) => {
  const { colorScheme } = useContext(ColorSchemeContext)
  const [ref, { width }] = useMeasure()

  const stackImage = width < 360

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

  const items = [
    <Box
      key={1}
      className={cn(styles.cardContent, {
        [styles.cardContentNarrower]: image && !stackImage,
      })}
    >
      <Stack space={1}>
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
              {tags.map(
                ({ title, href, as, ...props }: CardTagsProps, index) => {
                  const tagProps = {
                    ...tagPropsDefaults,
                    ...props.tagProps,
                    variant: tagVariant,
                  }

                  return href ? (
                    <Link key={index} href={href} as={as}>
                      <Tag {...tagProps}>{title}</Tag>
                    </Link>
                  ) : (
                    <Tag key={index} {...tagProps}>
                      {title}
                    </Tag>
                  )
                },
              )}
            </Inline>
          </Box>
        )}
      </Stack>
    </Box>,
    !!image && (
      <Box
        key={2}
        display="flex"
        justifyContent="center"
        alignItems="center"
        className={cn(styles.imageContainer, {
          [styles.imageContainerStacked]: stackImage,
        })}
      >
        <BackgroundImage
          positionX={!stackImage ? 'right' : null}
          background="transparent"
          backgroundSize="contain"
          image={image}
        />
      </Box>
    ),
  ]

  if (stackImage) {
    items.reverse()
  }

  const Content = (
    <Box
      ref={ref}
      display="flex"
      height="full"
      borderRadius="large"
      flexDirection="column"
    >
      <Box
        flexGrow={1}
        height="full"
        position="relative"
        display="flex"
        flexDirection={stackImage ? 'column' : 'row'}
      >
        {items}
      </Box>
    </Box>
  )

  if (href) {
    return (
      <FocusableBox
        href={href}
        as={as}
        borderRadius="large"
        flexDirection="column"
        height="full"
        width="full"
        flexGrow={1}
        background="white"
        borderColor={borderColor}
        borderWidth="standard"
      >
        {status ? (
          <span
            className={cn(
              styles.status,
              styles.statusPosition,
              styles.statusType[status],
            )}
          ></span>
        ) : null}
        <Frame>{Content}</Frame>
      </FocusableBox>
    )
  }

  return (
    <Frame>
      {status ? (
        <span
          className={cn(
            styles.status,
            styles.statusPosition,
            styles.statusType[status],
          )}
        ></span>
      ) : null}
      {Content}
    </Frame>
  )
}

export const Frame = ({ children }) => {
  return (
    <Box
      className={cn(styles.card)}
      position="relative"
      borderRadius="large"
      overflow="hidden"
      height="full"
      background="white"
      outline="none"
      padding={[2, 2, 4]}
    >
      {children}
    </Box>
  )
}

export default Card
