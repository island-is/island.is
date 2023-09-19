import { useState } from 'react'
import { TextInput, Box, Text } from '@contentful/f36-components'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import { useSDK } from '@contentful/react-apps-toolkit'

const ALLOWED_EMBED_URLS = ['https://e.infogram.com']

const EmbedLinkField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const [value, setValue] = useState('')
  const [isInvalid, setIsInvalid] = useState(false)

  return (
    <Box>
      <TextInput
        value={value}
        onChange={(ev) => {
          const newValue = ev.target.value
          const invalidState = !ALLOWED_EMBED_URLS.some((url) =>
            newValue.startsWith(url),
          )

          sdk.field.setInvalid(invalidState)
          setIsInvalid(invalidState)
          setValue(newValue)

          if (!isInvalid) {
            sdk.field.setValue(newValue)
          }
        }}
      />
      {isInvalid && (
        <Box marginTop="spacingM">
          <Text style={{ color: 'rgb(218, 41, 74)' }}>
            Embed links are only allowed from {ALLOWED_EMBED_URLS.join(', ')}
          </Text>
        </Box>
      )}
    </Box>
  )
}

export default EmbedLinkField
