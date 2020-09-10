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
  FocusableBox,
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
    <Box
      display="flex"
      height="full"
      borderRadius="large"
      flexDirection="column"
    >
      <Box flexGrow={1} height="full">
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

  if (href) {
    return (
      <FocusableBox
        href={href}
        as={as}
        flexDirection="column"
        height="full"
        borderColor="purple200"
        borderWidth="standard"
        borderStyle="solid"
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
      borderRadius="large"
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
