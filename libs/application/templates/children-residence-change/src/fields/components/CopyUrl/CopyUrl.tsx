import React, { useEffect, useState, useRef } from 'react'
import { Text, Box, Button, Input, toast } from '@island.is/island-ui/core'

interface Props {
  title: string
  inputLabel: string
  buttonLabel: string
  successMessage: string
}

const CopyUrl = ({ title, inputLabel, buttonLabel, successMessage }: Props) => {
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
      <Text variant="h4" marginBottom={2}>
        {title}
      </Text>
      <Box display="flex" flexDirection={['column', 'row', 'row', 'row']}>
        <Box flexGrow={1}>
          <Input
            label={inputLabel}
            size="sm"
            name="copyLink"
            value={currentUrl}
            disabled={true}
            backgroundColor="blue"
          />
        </Box>
        <Box
          display="flex"
          flexShrink={0}
          marginLeft={[0, 1, 1, 1]}
          marginTop={[1, 0, 0, 0]}
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
