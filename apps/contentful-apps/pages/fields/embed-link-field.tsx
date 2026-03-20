import { useState } from 'react'
import isUrl from 'is-url'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import { Box, Text, TextInput } from '@contentful/f36-components'
import { useSDK } from '@contentful/react-apps-toolkit'

const ALLOWED_EMBED_URLS = [
  'https://e.infogram.com',
  'https://app.powerbi.com',
  'https://portal.land.is',
  'https://www.facebook.com',
]

const getIframeSrc = (iframe: string) => {
  const srcPrefix = 'src="'
  const srcIndex = iframe.indexOf(srcPrefix)
  if (srcIndex >= 0) {
    const srcEndIndex = iframe.indexOf('"', srcIndex + srcPrefix.length)
    if (srcEndIndex >= 0)
      return iframe.substring(srcIndex + srcPrefix.length, srcEndIndex)
  }
  return iframe
}

const EmbedLinkField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const [value, setValue] = useState(sdk.field.getValue() ?? '')
  const [isValid, setIsValid] = useState(true)

  const isValueUrl = isUrl(value)

  return (
    <Box>
      <TextInput
        value={value}
        onChange={(ev) => {
          let newValue = ev.target.value
          if (newValue.startsWith('<iframe')) newValue = getIframeSrc(newValue)

          const isValidState =
            ALLOWED_EMBED_URLS.some((url) => newValue.startsWith(url)) &&
            isUrl(newValue)

          sdk.field.setInvalid(!isValidState)
          setIsValid(isValidState)
          setValue(newValue)

          if (isValidState) {
            sdk.field.setValue(newValue)
          }
        }}
      />
      {!isValid && (
        <Box marginTop="spacingM">
          <Text style={{ color: 'rgb(218, 41, 74)' }}>
            {!isValueUrl && 'Value must be a valid url'}
            {isValueUrl &&
              `Embed links are only allowed from ${ALLOWED_EMBED_URLS.join(
                ', ',
              )}`}
          </Text>
        </Box>
      )}
    </Box>
  )
}

export default EmbedLinkField
