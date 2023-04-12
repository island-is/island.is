import { Box } from '@island.is/island-ui/core'
import React from 'react'
import { RichTextAbout } from './AboutRTF'
import * as styles from './Information.css'

const Information = () => {
  return (
    <Box className={styles.spanStyle} marginBottom={6} marginTop={4}>
      <div dangerouslySetInnerHTML={{ __html: RichTextAbout }} />
    </Box>
  )
}

export default Information
