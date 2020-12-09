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

  //TODO finish UI and find out how to style the input and button so that they float togeather
  const buttonRef = useRef<HTMLButtonElement>(null)
  return (
    <Box display="flex" alignItems="stretch" flexDirection="row">
      <Box flexGrow={1}>
        <Input
          disabled
          label={inputLabel}
          name={inputLabel}
          value={inputValue}
        />
      </Box>
      <Box display="flex">
        <Button
          ref={buttonRef}
          colorScheme="light"
          icon="copy"
          iconType="outline"
          onClick={() => {
            copyToClipboard(inputValue)
          }}
          size="default"
          type="button"
        />
      </Box>
    </Box>
  )
}

export default CopyToClipboardInput
