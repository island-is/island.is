/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useContext } from 'react'
import { useMeasure } from 'react-use'
import cn from 'classnames'
import Link, { LinkProps } from 'next/link'
import {
  Box,
  Stack,
  Typography,
  Tag,
  Inline,
  TagProps,
  IconTypes,
  Icon,
  FocusableBox,
  ColorSchemeContext,
  TagVariant,
} from '@island.is/island-ui/core'
import { Image } from '@island.is/web/graphql/schema'

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
  icon?: IconTypes
  image?: Image
  description: string
  tags?: Array<CardTagsProps>
  linkProps?: LinkProps
  href?: string
  as?: string
}

export const Card: FC<CardProps> = ({
  title,
  icon,
  image,
  description,
  tags = [],
  href,
  as,
}) => {
  const { colorScheme } = useContext(ColorSchemeContext)
  const [ref, { width }] = useMeasure()

  const stackImage = width < 600

  let borderColor = null
  let tagVariant = 'purple' as TagVariant

  switch (colorScheme) {
    case 'red':
      borderColor = 'red200'
      tagVariant = 'red'
      break
    case 'blue':
      borderColor = 'blue200'
      tagVariant = 'blue'
      break
    case 'purple':
      borderColor = 'purple200'
      tagVariant = 'purple'
      break
    default:
      borderColor = 'purple200'
      break
  }

  const Content = (
    <Box
      ref={ref}
      display="flex"
      height="full"
      borderRadius="large"
      flexDirection="column"
    >
      {!!image && (
        <div
          className={cn(styles.imageContainer, {
            [styles.imageContainerStacked]: stackImage,
          })}
          style={{ backgroundImage: `url(${image.url})` }}
        />
      )}
      <Box flexGrow={1} height="full" position="relative">
        <div
          className={cn(styles.cardContent, {
            [styles.cardContentNarrower]: image && !stackImage,
          })}
        >
          <Stack space={1}>
            <Typography variant="cardCategoryTitle" as="h3" color="blue400">
              <Box display="flex" flexDirection="row" alignItems="center">
                <Box display="inlineFlex" flexGrow={1}>
                  {title}
                </Box>
                {icon && (
                  <Box marginLeft={1} display="inlineFlex">
                    <Icon type={icon} />
                  </Box>
                )}
              </Box>
            </Typography>
            {description && <Typography variant="p">{description}</Typography>}
          </Stack>
        </div>
      </Box>
      {tags.length > 0 && (
        <Box paddingTop={3} flexGrow={0} position="relative">
          <Inline space={1}>
            {tags.map(({ title, href, as, ...props }: CardTagsProps, index) => {
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
            })}
          </Inline>
        </Box>
      )}
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
        borderColor={borderColor}
        borderWidth="standard"
      >
        <Frame>{Content}</Frame>
      </FocusableBox>
    )
  }

  return <Frame>{Content}</Frame>
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
