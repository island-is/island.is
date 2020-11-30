import React, { FC, useRef } from 'react'
import { Box, Input, Button } from '@island.is/island-ui/core'
import * as styles from './CopyToClipboardInput.treat'

export interface CopyToClipboardInputProps {
  inputLabel: string
  inputValue: string
}

export const CopyToClipboardInput: FC<CopyToClipboardInputProps> = ({
  inputLabel,
  inputValue,
}) => {
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
    buttonRef.current?.focus()
  }

  const buttonRef = useRef<HTMLButtonElement>(null)
  return (
    <Box>
      <Box position="relative">
        <Input
          disabled
          label={inputLabel}
          name={inputLabel}
          value={inputValue}
        />
        <Box position="absolute" className={styles.clipboardContainer}>
          <Button
            ref={buttonRef}
            circle
            colorScheme="default"
            icon="copy"
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
    </Box>
  )
}

export default CopyToClipboardInput
