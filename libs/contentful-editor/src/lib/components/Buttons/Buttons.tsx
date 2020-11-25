import React, { FC } from 'react'
import { Box, Button } from '@island.is/island-ui/core'
import cn from 'classnames'

import * as styles from './Buttons.treat'

interface ButtonsProps {
  copy: string
  edit: boolean
  saving: boolean
  onClick(): void
  onCancelClick(): void
}

export const Buttons = ({
  copy,
  edit,
  saving,
  onClick,
  onCancelClick,
}: ButtonsProps) => (
  <Box
    className={cn(styles.wrapper, {
      [styles.edit]: edit,
    })}
  >
    <Box display="inlineFlex">
      {edit && (
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
  </Box>
)
