import React, { FC, forwardRef, useContext } from 'react'
import cn from 'classnames'
import Link, { LinkProps } from 'next/link'
import {
  Box,
  Stack,
  Typography,
  Tag,
  TagVariant,
  Inline,
  TagProps,
} from '@island.is/island-ui/core'
import { Colors } from '@island.is/island-ui/theme'
import { ColorSchemeContext, ColorSchemes } from '@island.is/adgerdir/context'

import * as styles from './Card.treat'

export type CardTagsProps = {
  tagProps?: Omit<TagProps, 'children'>
  title: string
}

const tagPropsDefaults: Omit<TagProps, 'children'> = {
  variant: 'purple',
}

interface CardProps {
  title: string
  description: string
  tags?: Array<CardTagsProps>
  linkProps?: LinkProps
  href?: string
  as?: string
  visible?: boolean
  variant?: ColorSchemes
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { title, description, tags = [], href, as, visible = true, variant },
    ref,
  ) => {
    const { colorScheme } = useContext(ColorSchemeContext)

    let color = 'blue400'
    let tagVariant = '' as TagVariant

    switch (variant || colorScheme) {
      case 'blue':
        color = 'blue400'
        tagVariant = 'blue'
        break
      case 'red':
        color = 'red600'
        tagVariant = 'red'
        break
      case 'purple':
        color = 'purple400'
        tagVariant = 'purple'
        break
      default:
        break
    }

    console.log(tagVariant)

    const Content = (
      <Box ref={ref} display="flex" height="full" flexDirection="column">
        <Box flexGrow={1} height="full">
          <Stack space={1}>
            <Typography
              variant="cardCategoryTitle"
              as="h3"
              color={color as Colors}
            >
              {title}
            </Typography>
            {description && <Typography variant="p">{description}</Typography>}
          </Stack>
        </Box>
        {tags.length > 0 && (
          <Box paddingTop={3} flexGrow={0}>
            <Inline space={1}>
              {tags.map(({ title, ...props }: CardTagsProps, index) => {
                const tagProps = { ...tagPropsDefaults, ...props.tagProps }

                return (
                  <Tag
                    key={index}
                    {...tagProps}
                    variant={tagVariant as TagVariant}
                  >
                    {title}
                  </Tag>
                )
              })}
            </Inline>
          </Box>
        )}
      </Box>
    )

    if (!href) {
      return (
        <Frame variant={colorScheme} isVisible={visible}>
          {Content}
        </Frame>
      )
    }

    return (
      <Link href={href} as={as} passHref>
        {/* eslint-disable-next-line */}
        <a className={styles.card}>
          <Box
            height="full"
            background="white"
            outline="none"
            borderRadius="standard"
            padding={[2, 2, 4]}
          >
            {Content}
          </Box>
        </a>
      </Link>
    )
  },
)

interface FrameProps {
  isFocused?: boolean
  isVisible?: boolean
  variant: ColorSchemes
}

export const Frame: FC<FrameProps> = ({
  children,
  isFocused = false,
  isVisible = true,
  variant,
}) => {
  return (
    <Box
      height="full"
      background="white"
      outline="none"
      padding={[2, 2, 4]}
      className={cn(styles.card, styles.variants[variant], {
        [styles.focused]: isFocused,
        [styles.visible]: isVisible,
      })}
    >
      {children}
    </Box>
  )
}

export default Card
