import React from 'react'
import { Box, Button } from '@island.is/island-ui/core'
import * as styles from './PrintButton.css'

export const PrintButton = () => {
  return (
    <Box className={styles.printButton}>
      <Button
        variant="utility"
        icon="print"
        onClick={(e: any) => {
          e.preventDefault()
          window.print()
        }}
      />
    </Box>
  )
}
