import { Box } from '@island.is/island-ui/core'
import React from 'react'
import * as styles from './BlueBox.treat'

const BlueBox: React.FC<{}> = (props) => {
  return <Box className={styles.blueBox}>{props.children}</Box>
}

export default BlueBox
