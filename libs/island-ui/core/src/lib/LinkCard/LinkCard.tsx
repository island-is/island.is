import React, { forwardRef } from 'react'
import { Box } from '../Box/Box'
import { Typography } from '../Typography/Typography'
import { Tag, TagVariant } from '../Tag/Tag'
import * as styles from './LinkCard.treat'

export interface LinkCardProps {
  onClick?: () => void
  children: string
  tag?: string
  tagVariant?: TagVariant
}

export const LinkCard = forwardRef<HTMLAnchorElement, LinkCardProps>(
  (
    { onClick, children, tag, tagVariant = 'darkerBlue' }: LinkCardProps,
    ref,
  ) => {
    return (
      <Box
        background="blue100"
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
