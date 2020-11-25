import React, { FC } from 'react'
import { Box, Button } from '@island.is/island-ui/core'

import * as styles from './Header.treat'

interface HeaderProps {
  copy: string
  cancel: boolean
  saving: boolean
  onClick(): void
  onCancelClick(): void
}

export const Header = ({
  copy,
  cancel,
  saving,
  onClick,
  onCancelClick,
}: HeaderProps) => (
  <Box display="inlineFlex" className={styles.wrapper}>
    {cancel && (
      <Box marginRight={2}>
        <Button loading={saving} onClick={onCancelClick} variant="ghost">
          Cancel
        </Button>
      </Box>
    )}

    <Button loading={saving} onClick={onClick}>
      {copy}
    </Button>
  </Box>
)
