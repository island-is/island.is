import { Box, Text } from '@island.is/island-ui/core'
import React from 'react'
import { RichTextAbout } from './AboutRTF'
import * as styles from './AboutContent.css'
import localization from '../../About.json'

const AboutContent = () => {
  const loc = localization['aboutContent']
  return (
    <Box dataTestId="aboutTitle">
      <Text variant="h1" color="blue400">
        {loc.text}
      </Text>
      <Box
        dataTestId="aboutContent"
        className={styles.spanStyle}
        marginBottom={6}
        marginTop={4}
      >
        <div dangerouslySetInnerHTML={{ __html: RichTextAbout }} />
      </Box>
    </Box>
  )
}

export default AboutContent
