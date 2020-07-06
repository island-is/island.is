import React, { forwardRef } from 'react'
import { Box } from '../Box/Box'
import { Typography } from '../Typography/Typography'
import * as styles from './LinkCard.treat'

export interface LinkCardProps {
  onClick?: () => void
  href?: string
  children: string
}

export const LinkCard = forwardRef<HTMLAnchorElement, LinkCardProps>(
  ({ href, onClick, children }: LinkCardProps, ref) => {
    return (
      <a ref={ref} href={href} onClick={onClick} className={styles.container}>
        <Box padding={[2, 2, 3]}>
          <Typography variant="h4" as="span">
            {children}
          </Typography>
        </Box>
      </a>
    )
  },
)
