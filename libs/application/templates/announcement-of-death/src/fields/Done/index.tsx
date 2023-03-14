import React, { FC, useCallback, useEffect, useState } from 'react'

import AOD from '../../assets/AOD'
import { Box } from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/types'

export const Done: FC<FieldBaseProps> = () => {
  return (
    <Box marginTop={2} marginBottom={4} display="flex" justifyContent="center">
      <AOD />
    </Box>
  )
}
