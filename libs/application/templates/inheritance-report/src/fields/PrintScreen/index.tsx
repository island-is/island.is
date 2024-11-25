import { Box, Button } from '@island.is/island-ui/core'
import * as styles from './styles.css'

export const PrintScreen = () => {
  return (
    <Box
      position="absolute"
      className={styles.printButton}
      display={['none', 'none', 'block']}
    >
      <Button
        colorScheme="default"
        icon="print"
        iconType="filled"
        onClick={(e) => {
          e.preventDefault()
          window.print()
        }}
        preTextIconType="filled"
        variant="ghost"
      ></Button>
    </Box>
  )
}

export default PrintScreen
