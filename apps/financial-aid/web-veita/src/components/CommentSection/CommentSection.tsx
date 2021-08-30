import React, { useState } from 'react'

import { Box, Button, Input } from '@island.is/island-ui/core'
import cn from 'classnames'

import * as styles from './CommentSection.treat'

interface Props {
  className?: string
}

const CommentSection = ({ className }: Props) => {
  const [showInput, setShowInput] = useState<boolean>(false)

  return (
    <Box marginBottom={3} className={`${className} `}>
      <Button
        icon={showInput ? 'close' : 'open'}
        size="small"
        iconType="outline"
        onClick={() => {
          setShowInput(!showInput)
        }}
      >
        {showInput ? 'Loka' : 'Skrifa athugasemd'}
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
        <Box marginTop={2} display="flex" justifyContent="flexEnd">
          <Button
            icon="checkmark"
            size="small"
            iconType="outline"
            onClick={() => {
              setShowInput(!showInput)
            }}
          >
            Vista athugasemd
          </Button>
        </Box>
      </div>
    </Box>
  )
}

export default CommentSection
