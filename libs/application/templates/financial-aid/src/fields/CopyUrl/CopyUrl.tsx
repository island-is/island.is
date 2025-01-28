import React, { useEffect, useState, useRef } from 'react'
import { Box, Button, Input, toast } from '@island.is/island-ui/core'
import * as styles from './CopyUrl.css'

interface Props {
  inputLabel: string
  buttonLabel: string
  successMessage: string
}

const CopyUrl = ({ inputLabel, buttonLabel, successMessage }: Props) => {
  const [currentUrl, setCurrentUrl] = useState<string | undefined>(undefined)

  const copyToClipboard = (val: string) => {
    const selBox = document.createElement('textarea')
    selBox.style.position = 'fixed'
    selBox.style.left = '0'
    selBox.style.top = '0'
    selBox.style.opacity = '0'
    selBox.value = val
    document.body.appendChild(selBox)
    selBox.focus()
    selBox.select()
    document.execCommand('copy')
    document.body.removeChild(selBox)
    buttonRef.current?.focus()
    toast.success(successMessage)
  }

  useEffect(() => {
    setCurrentUrl(window.location.href)
  }, [])
  const buttonRef = useRef<HTMLButtonElement>(null)
  return (
    <Box>
      <Box display="flex" flexDirection={['column', 'row', 'column', 'row']}>
        <Box flexGrow={1}>
          <Input
            label={inputLabel}
            size="sm"
            name="copyLink"
            value={currentUrl}
            disabled={false}
            backgroundColor="blue"
          />
        </Box>
        <Box
          className={styles.buttonWrapper}
          display="flex"
          flexShrink={0}
          marginLeft={[0, 1, 0, 1]}
          marginTop={[2, 0, 2, 0]}
        >
          <Button
            ref={buttonRef}
            disabled={!currentUrl}
            colorScheme="default"
            type="button"
            icon="copy"
            onClick={() => currentUrl && copyToClipboard(currentUrl)}
            preTextIconType="filled"
            size="small"
            variant="ghost"
            iconType="outline"
          >
            {buttonLabel}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default CopyUrl
