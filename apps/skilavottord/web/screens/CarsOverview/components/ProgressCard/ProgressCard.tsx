import React, { FC } from 'react'
import * as styles from './ProgressCard.treat'
import {
  Box,
  Typography,
  Button,
} from '@island.is/island-ui/core'

export interface LinkCardProps {
  onClick?: () => void
  title: string
  description: string
  isRecycable?: boolean
}

export const ProgressCard: FC<LinkCardProps> = (
  { isRecycable = false, onClick, title, description }: LinkCardProps,
  ref,
) => {
  return (
    <Box
      className={styles.container}
      display="inlineFlex"
      justifyContent="spaceBetween"
    >
      <Box paddingTop={4} paddingBottom={4} paddingLeft={4} width="full">
        <Typography variant="h4" color="blue400">
          {title}
        </Typography>
        {description}
      </Box>
    </Box>
  )
}
