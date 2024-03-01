import { useState } from 'react'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import { Flex, Pill, TextInput } from '@contentful/f36-components'
import { useSDK } from '@contentful/react-apps-toolkit'

const UrlsListField = () => {
  const [value, setValue] = useState('')
  const sdk = useSDK<FieldExtensionSDK>()
  const [tags, setTags] = useState<string[]>(sdk.field.getValue() ?? [])

  return (
    <Flex flexDirection="column" gap="16px">
      <TextInput
        value={value}
        onChange={(ev) => {
          setValue(ev.target.value)
        }}
        placeholder="Type the value and hit enter"
        onKeyDown={(ev) => {
          if (ev.key === 'Enter') {
            let newValue = value.trim()
            if (newValue.length > 0) {
              if (!newValue.startsWith('/')) {
                newValue = `/${newValue}`
              }
              setTags((previousTags) => {
                const updatedTags = previousTags.concat(newValue)
                sdk.field.setValue(updatedTags)
                setValue('')
                return updatedTags
              })
            }
          }
        }}
      />
      <Flex flexDirection="row" gap="16px" flexWrap="wrap">
        {tags.map((tag, index) => (
          <Pill
            key={tag}
            label={tag}
            onClose={() => {
              setTags((previousTags) => {
                const updatedTags = previousTags.filter(
                  (_, currentIndex) => currentIndex !== index,
                )
                sdk.field.setValue(updatedTags)
                return updatedTags
              })
            }}
          />
        ))}
      </Flex>
    </Flex>
  )
}

export default UrlsListField
