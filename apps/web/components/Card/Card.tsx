import React, { FC } from 'react'
import cn from 'classnames'
import Link, { LinkProps } from 'next/link'
import { Box, Stack, Typography, Tag, Inline } from '@island.is/island-ui/core'

import * as styles from './Card.treat'

import { getTags } from '../../json'

interface CardProps {
  title: string
  description?: string
  tags?: boolean
  linkProps?: LinkProps
}

export const Card: FC<CardProps> = ({
  title,
  description,
  tags = true,
  linkProps = { href: '#', as: null },
}) => {
  const Content = (
    <Box display="flex" height="full" flexDirection="column">
      <Box flexGrow={1} height="full">
        <Stack space={1}>
          <Typography variant="cardCategoryTitle" as="h3">
            {title}
          </Typography>
          {description && <Typography variant="p">{description}</Typography>}
        </Stack>
      </Box>
      {tags && (
        <Box paddingTop={3} flexGrow={0}>
          <Inline space={1}>
            {getTags(4).map(({ title }, index) => {
              return (
                <Link key={index} {...linkProps}>
                  <Tag variant="purple">{title}</Tag>
                </Link>
              )
            })}
          </Inline>
        </Box>
      )}
    </Box>
  )

  if (!linkProps.href) {
    return <Frame>{Content}</Frame>
  }

  return (
    <Link {...linkProps}>
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
}

interface FrameProps {
  isFocused?: boolean
}

export const Frame: FC<FrameProps> = ({ children, isFocused = false }) => {
  return (
    <Box
      height="full"
      background="white"
      outline="none"
      padding={[2, 2, 4]}
      className={cn(styles.card, { [styles.focused]: isFocused })}
    >
      {children}
    </Box>
  )
}

export default Card
