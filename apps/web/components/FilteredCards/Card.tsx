/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { forwardRef, useContext } from 'react'
import Link from 'next/link'
import cn from 'classnames'
import {
  Box,
  Stack,
  Typography,
  Tag,
  TagVariant,
  Inline,
  ColorSchemes,
  ColorSchemeContext,
} from '@island.is/island-ui/core'
import { Colors } from '@island.is/island-ui/theme'
import { AdgerdirTag } from '@island.is/api/schema'

import * as styles from './Card.treat'

interface CardProps {
  title: string
  description: string
  tags?: Array<AdgerdirTag>
  href?: string
  as?: string
  variant?: ColorSchemes
  status?: string
}

export const Card = forwardRef<HTMLAnchorElement, CardProps>(
  ({ title, description, tags = [], href = '#', as, variant, status }, ref) => {
    const { colorScheme } = useContext(ColorSchemeContext)

    let color = 'blue400'
    let tagVariant = 'blue' as TagVariant

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

    return (
      <Link as={as} href={href} passHref>
        <a ref={ref} className={cn(styles.card, styles.variants[variant], {})}>
          <Box
            height="full"
            outline="none"
            borderRadius="standard"
            position="relative"
            padding={[2, 2, 4]}
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
                  {description && (
                    <Typography variant="p">{description}</Typography>
                  )}
                </Stack>
              </Box>
              {tags.length > 0 && (
                <Box paddingTop={2} flexGrow={0}>
                  <Inline space={1}>
                    {tags.map(({ title, id }, index) => {
                      return (
                        <Tag key={index} variant={tagVariant} label>
                          {title}
                        </Tag>
                      )
                    })}
                  </Inline>
                </Box>
              )}
            </Box>
          </Box>
        </a>
      </Link>
    )
  },
)

export default Card
