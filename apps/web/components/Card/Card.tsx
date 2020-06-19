import React, { FC } from 'react'
import cn from 'classnames'
import Link, { LinkProps } from 'next/link'
import {
  Box,
  Stack,
  Typography,
  Tag,
  Inline,
  Columns,
  Column,
} from '@island.is/island-ui/core'

import * as styles from './Card.treat'

import { getTags } from '../../json'

interface CardProps {
  title: string
  description: string
  category?: string
  group?: string
  tags?: boolean
  linkProps?: LinkProps
  href?: string
  as?: string
}

export const Card: FC<CardProps> = ({
  title,
  description,
  tags = true,
  href,
  as,
  category,
  group,
}) => {
  const Content = (
    <Box display="flex" height="full" flexDirection="column">
      <Box flexGrow={1} height="full">
        <Stack space={1}>
          <Columns>
            <Column>
              <Typography variant="cardCategoryTitle" as="h3">
                {title}
              </Typography>
            </Column>
            {(category || group) && (
              <Column width="content">
                <Inline space={2}>
                  {category && <Tag variant="purple">{category}</Tag>}
                  {group && <Tag variant="purple">{group}</Tag>}
                </Inline>
              </Column>
            )}
          </Columns>
          {description && <Typography variant="p">{description}</Typography>}
        </Stack>
      </Box>
      {tags && (
        <Box paddingTop={3} flexGrow={0}>
          <Inline space={1}>
            {getTags(4).map(({ title }, index) => {
              return (
                <Link key={index} href="#">
                  <Tag variant="purple">{title}</Tag>
                </Link>
              )
            })}
          </Inline>
        </Box>
      )}
    </Box>
  )

  if (!href) {
    return <Frame>{Content}</Frame>
  }

  return (
    <Link href={href} as={as}>
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
