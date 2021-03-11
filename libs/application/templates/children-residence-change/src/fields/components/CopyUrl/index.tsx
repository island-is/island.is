import React, { useEffect, useState, useRef } from 'react'
import { useIntl } from 'react-intl'
import { Text, Box, Button, Input } from '@island.is/island-ui/core'

interface Props {
  title: string
  inputLabel: string
  buttonLabel: string
}

const DescriptionText = ({ title, inputLabel, buttonLabel }: Props) => {
  const { formatMessage } = useIntl()
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
      <Box display="flex">
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
        <Box display="flex" marginLeft={2}>
          <Button
            ref={buttonRef}
            disabled={!currentUrl}
            colorScheme="default"
            type="button"
            icon="copy"
            onClick={() => currentUrl && copyToClipboard(currentUrl)}
            preTextIconType="filled"
            size="default"
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

export default DescriptionText
