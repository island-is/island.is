import React, { useState } from 'react'

import { Box, Button, Input } from '@island.is/island-ui/core'
import cn from 'classnames'

import * as styles from './CommentSection.treat'

interface Props {
  className?: string
}

const CommentSection = ({ className }: Props) => {
  const [showInput, setShowInput] = useState<boolean>(true)

  return (
    <Box marginBottom={3} className={`${className} `}>
      <Button
        icon="open"
        size="small"
        iconType="outline"
        onClick={() => {
          setShowInput(!showInput)
        }}
      >
        Skrifa athugasemd
      </Button>

      <div
        className={cn({
          [`${styles.inputFieldContainer}`]: true,
          [`${styles.showInput}`]: showInput,
        })}
      >
        <Input
          backgroundColor="blue"
          label="Athugasemd"
          name="Test5"
          rows={4}
          textarea
        />
      </div>
    </Box>
  )
}

export default CommentSection
