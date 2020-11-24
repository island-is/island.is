import React, { FC, useRef } from 'react'
import {
  Box,
  Input,
  Button,
  ToastContainer,
  toast,
} from '@island.is/island-ui/core'
import * as styles from './CopyToClipboardInput.treat'

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
    let isSuccessful = document.execCommand('copy')
    document.body.removeChild(el)
    //TODO if we want to use ToastContainer the component needs to be added to the base screen of the application
    //isSuccessful ? toast.success('Afritað!') : null
  }
  return (
    <Box>
      <Box position="relative">
        <Input
          ref={testRef}
          disabled
          label={inputLabel}
          name={inputLabel}
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
    </Box>
  )
}

export default CopyToClipboardInput
