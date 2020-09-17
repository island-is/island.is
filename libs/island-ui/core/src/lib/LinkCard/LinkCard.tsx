import React, { forwardRef, ComponentPropsWithRef } from 'react'
import { Box, BoxProps } from '../Box/Box'
import { Typography } from '../Typography/Typography'
import { Tag, TagVariant } from '../Tag/Tag'
import * as styles from './LinkCard.treat'

export interface LinkCardProps extends ComponentPropsWithRef<'div'> {
  onClick?: () => void
  background?: BoxProps['background']
  tag?: string
  tagVariant?: TagVariant
}

export const LinkCard = forwardRef<HTMLDivElement, LinkCardProps>(
  (
    {
      onClick,
      background = 'blue100',
      children,
      tag,
      tagVariant = 'darkerBlue',
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
      >
        <Typography variant="h4" as="span" color="blue400">
          {children}
        </Typography>
        {tag && (
          <Box className={styles.tag} paddingLeft={2}>
            <Tag variant={tagVariant}>{tag}</Tag>
          </Box>
        )}
      </Box>
    )
  },
)
