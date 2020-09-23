import React, { forwardRef, ComponentPropsWithRef } from 'react'
import cn from 'classnames'
import { Box, BoxProps } from '../Box/Box'
import { Typography } from '../Typography/Typography'
import { Tag, TagVariant, TagProps } from '../Tag/Tag'
import * as styles from './LinkCard.treat'

export interface LinkCardProps extends ComponentPropsWithRef<'div'> {
  onClick?: () => void
  background?: BoxProps['background']
  tag?: string
  tagVariant?: TagVariant
  tagProps?: Omit<TagProps, 'children'>
  isFocused?: boolean
}

export const LinkCard = forwardRef<HTMLAnchorElement, LinkCardProps>(
  (
    {
      onClick,
      children,
      background = 'blue100',
      tag,
      tagVariant = 'darkerBlue',
      tagProps = {
        label: true,
      },
      isFocused,
    }: LinkCardProps,
    ref,
  ) => {
    return (
      <Box
        background={background}
        borderRadius="large"
        position="relative"
        display="flex"
        onClick={onClick}
        padding={[2, 2, 3]}
        ref={ref}
        width="full"
        className={cn(styles.container, { [styles.focused]: isFocused })}
      >
        <Typography variant="h4" as="span" color="blue400">
          {children}
        </Typography>
        {tag && (
          <Box className={styles.tag} paddingLeft={2}>
            <Tag variant={tagVariant} {...tagProps}>
              {tag}
            </Tag>
          </Box>
        )}
      </Box>
    )
  },
)
