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
  Columns,
  Column,
  Button,
} from '@island.is/island-ui/core'

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
  description: string
  tags?: Array<CardTagsProps>
  linkProps?: LinkProps
  href?: string
  as?: string
}

export const Card: FC<CardProps> = ({
  title,
  icon,
  description,
  tags = [],
  href,
  as,
}) => {
  const Content = (
    <Box display="flex" height="full" flexDirection="column">
      <Box flexGrow={1} height="full">
        <Stack space={1}>
          <Columns>
            <Column>
              <Typography variant="cardCategoryTitle" as="h3">
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
              {description && (
                <Typography variant="p">{description}</Typography>
              )}
            </Column>
            <Column width="content">
              <Box
                display="flex"
                alignItems="center"
                flexDirection="row"
                height="full"
              >
                <Button variant="text" icon="arrowRight">
                  Sjá nánar
                </Button>
              </Box>
            </Column>
          </Columns>
        </Stack>
      </Box>
      {tags.length > 0 && (
        <Box paddingTop={3} flexGrow={0}>
          <Inline space={1}>
            {tags.map(({ title, href, as, ...props }: CardTagsProps, index) => {
              const tagProps = { ...tagPropsDefaults, ...props.tagProps }

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

  if (!href) {
    return <Frame>{Content}</Frame>
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
