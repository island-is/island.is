import React, { ReactNode, useState } from 'react'
import { Text, Box, Link, Button, Icon } from '@island.is/island-ui/core'

import * as styles from './ProfileUnit.css'
import cn from 'classnames'

interface Props {
  info: {
    title: string
    content?: string
    link?: string
    onclick?: () => void
    other?: string
  }[]
  className?: string
}

const Unit = ({ info, className }: Props) => {
  return (
    <div
      className={cn({
        [`${styles.container} hideScrollBar`]: true,
        [`${className}`]: true,
      })}
    >
      {info.map((item, index) => {
        return (
          <Box key={'profile-' + index}>
            <Text variant="eyebrow" marginBottom={1}>
              {item.title}
            </Text>

            {item.link && (
              <Link href={item.link} color="blue400" onClick={item.onclick}>
                {item.content}
              </Link>
            )}

            {item.onclick && (
              <button onClick={item.onclick} className={styles.button}>
                {item.content}
              </button>
            )}

            {!item.link && !item.onclick && <Text>{item.content}</Text>}

            {item.other && (
              <Box
                background="blue100"
                borderRadius="large"
                padding={2}
                marginTop={1}
              >
                <Text variant="small">
                  „<em>{item.other}</em>“
                </Text>
              </Box>
            )}
          </Box>
        )
      })}
    </div>
  )
}

export default Unit
