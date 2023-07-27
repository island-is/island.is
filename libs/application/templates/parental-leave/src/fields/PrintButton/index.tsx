import React from 'react'
import { Box, Button } from '@island.is/island-ui/core'
import * as styles from './Printbutton.css'

export const PrintButton = () => {
  return (
    <Box className={styles.printButtonContainer}>
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
    </Box>
  )
}
