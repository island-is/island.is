import React from 'react'
import { Text, Box, Link } from '@island.is/island-ui/core'

import * as styles from './ProfileUnit.css'

export const LinkItem = (
  link?: string,
  onclick?: () => void,
  content?: string,
) => {
  return (
    link && (
      <Link href={link} color="blue400" onClick={onclick}>
        {content}
      </Link>
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
      <Box
        background="blue100"
        borderRadius="default"
        padding={2}
        marginTop={1}
      >
        <Text variant="small">
          „<em>{other}</em>“
        </Text>
      </Box>
    )
  )
}
