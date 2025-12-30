import React from 'react'
import { Text, Box, LinkV2 } from '@island.is/island-ui/core'

import * as styles from './ProfileUnit.css'

export const LinkItem = (
  link?: string,
  onclick?: () => void,
  content?: string,
) => {
  return (
    link && (
      <LinkV2 href={link} color="blue400" onClick={onclick}>
        {content}
      </LinkV2>
    )
  )
}

export const ButtonItem = (onclick?: () => void, content?: string) => {
  return (
    onclick && (
      <button onClick={onclick} className={styles.button}>
        {content}
      </button>
    )
  )
}

export const OtherItem = (other?: string) => {
  return (
    other && (
      <Box background="blue100" borderRadius="large" padding={2} marginTop={1}>
        <Text variant="small">
          „<em>{other}</em>“
        </Text>
      </Box>
    )
  )
}
