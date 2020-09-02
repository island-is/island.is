/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react'
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
  Button,
} from '@island.is/island-ui/core'

import * as styles from './Card.treat'

export type CardTagsProps = {
  tagProps?: Omit<TagProps, 'children'>
  href?: string
  as?: string
  title: string
}

type ButtonProps = {
  link: string
  text: string
}

const tagPropsDefaults: Omit<TagProps, 'children'> = {
  variant: 'purple',
}

interface CardProps {
  title: string
  link?: string
  description: string
  tags?: Array<CardTagsProps>
  linkProps?: LinkProps
  href?: string
  as?: string
  button?: ButtonProps
}

export const Card: FC<CardProps> = ({
  title,
  link,
  description,
  href,
  button
}) => {
  const Content = (
    <Box
      display="flex"
      height="full"
      borderRadius="large"
      flexDirection="column"
    >
      <Box flexGrow={1} height="full">
        <Stack space={1}>
          <Typography variant="cardCategoryTitle" as="h2">
            <Box display="flex" flexDirection="row" alignItems="center">
              <Box display="inlineFlex" flexGrow={1}>
                {title}
              </Box>
            </Box>
          </Typography>
          {description && <Typography variant="p">{description}</Typography>}
          {link && href && (
            <Link href={href}>
              <a>
                <Typography variant="p">{link}</Typography>
              </a>
            </Link>
          )}
          {button && 
            <Button href={button.link}>{button.text}</Button>
          }
        </Stack>
      </Box>
    </Box>
  )

  return (
    <Box
      borderRadius="large"
      height="full"
      background="white"
      outline="none"
      paddingX={[4, 4, 8]}
      paddingY={[4, 4, 8]}
      className={cn(styles.card)}
    >
      {Content}
    </Box>
  )
}

export default Card
