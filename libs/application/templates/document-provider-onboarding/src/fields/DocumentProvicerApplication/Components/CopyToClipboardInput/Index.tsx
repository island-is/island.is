import React, { FC, useRef } from 'react'
import { Box, Input, Button } from '@island.is/island-ui/core'
import * as styles from './CopyToClipboardInput.treat'
import { indexOf } from 'lodash'

export interface CopyToClipboardInputProps {
  inputLabel: string
  inputValue: string
}

export const CopyToClipboardInput: FC<CopyToClipboardInputProps> = ({
  inputLabel,
  inputValue,
}) => {
  const testRef = useRef<HTMLInputElement>(null)

  const copyToClipboard = (inputValue: string) => {
    const el = document.createElement('textarea')
    el.value = inputValue
    el.setAttribute('readonly', '')
    el.style.position = 'absolute'
    el.style.opacity = '0'
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)

    //   const el = testRef.current
    //   console.log(el)
    //   el?.removeAttribute('disabled')
    //   el?.select()
    //   let copy = document.execCommand('copy')
    //   console.log(copy)
    // el?.setAttribute('disabled', 'disabled')
  }
  return (
    <Box position="relative">
      <Input
        ref={testRef}
        disabled
        label={inputLabel}
        name="Test1"
        value={inputValue}
      />
      <Box position="absolute" className={styles.clipboardContainer}>
        <Button
          circle
          colorScheme="default"
          icon="documents"
          iconType="outline"
          onClick={() => {
            copyToClipboard(inputValue)
          }}
          size="default"
          type="button"
          variant="primary"
        />
      </Box>
    </Box>
  )
}

export default CopyToClipboardInput
