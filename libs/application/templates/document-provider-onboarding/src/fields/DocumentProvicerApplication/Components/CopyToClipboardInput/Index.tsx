import React, { FC, useRef } from 'react'
import { Box, Input, Button } from '@island.is/island-ui/core'

export interface CopyToClipboardInputProps {
  inputLabel: string
  inputValue: string
}

export const CopyToClipboardInput: FC<
  React.PropsWithChildren<CopyToClipboardInputProps>
> = ({ inputLabel, inputValue }) => {
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
    <Box display="flex" alignItems="stretch" flexDirection="row">
      <Box flexGrow={1}>
        <Input
          disabled
          label={inputLabel}
          name={inputLabel}
          value={inputValue}
        />
      </Box>
      <Box display="flex" marginLeft={1}>
        <Button
          ref={buttonRef}
          icon="copy"
          iconType="outline"
          onClick={() => {
            copyToClipboard(inputValue)
          }}
          size="default"
          type="button"
          variant="ghost"
        />
      </Box>
    </Box>
  )
}

export default CopyToClipboardInput
