import React, { FC } from 'react'
import { Box, Button } from '@island.is/island-ui/core'

import * as styles from './Header.treat'

interface HeaderProps {
  copy: string
  cancel: boolean
  onClick(): void
  onCancelClick(): void
}

export const Header: FC<HeaderProps> = ({
  copy,
  cancel,
  onClick,
  onCancelClick,
}) => (
  <Box display="inlineFlex" className={styles.wrapper}>
    {cancel && (
      <Box marginRight={2}>
        <Button onClick={onCancelClick} variant="ghost">
          Cancel
        </Button>
      </Box>
    )}

    <Button onClick={onClick}>{copy}</Button>
  </Box>
)
