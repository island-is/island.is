import { Box, Text } from '@island.is/island-ui/core'
import React from 'react'
import { RichTextAbout } from './AboutRTF'
import * as styles from './AboutContent.css'

const AboutContent = () => {
  return (
    <Box>
      <Text variant="h1" color="blue400">
        {'Um samráðsgátt'}
      </Text>
      <Box className={styles.spanStyle} marginBottom={6} marginTop={4}>
        <div dangerouslySetInnerHTML={{ __html: RichTextAbout }} />
      </Box>
    </Box>
  )
}

export default AboutContent
