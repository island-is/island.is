import { useEffect, useState } from 'react'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import {
  Box,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  TextInput,
} from '@contentful/f36-components'
import { useSDK } from '@contentful/react-apps-toolkit'

interface ValueType {
  displayNameField?: boolean
  displayCustomNameText?: boolean
  nameLabel?: string
  namePlaceholder?: string

  displayEmailField?: boolean
  displayCustomEmailText?: boolean
  emailLabel?: string
  emailPlaceholder?: string
}

const FormDefaultNamespaceField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const [value, setValue] = useState<ValueType>(sdk.field.getValue() ?? {})

  useEffect(() => {
    sdk.window.startAutoResizer()
  }, [sdk.window])

  const updateTextValue = (
    fieldKey:
      | 'emailLabel'
      | 'emailPlaceholder'
      | 'nameLabel'
      | 'namePlaceholder',
    fieldValue: string,
  ) => {
    setValue((prevValue) => {
      const newValue = { ...prevValue, [fieldKey]: fieldValue }
      sdk.field.setValue(newValue)
      return newValue
    })
  }

  const toggleCheckbox = (
    fieldKey:
      | 'displayNameField'
      | 'displayEmailField'
      | 'displayCustomNameText'
      | 'displayCustomEmailText',
  ) => {
    setValue((prevValue) => {
      const newValue = { ...prevValue, [fieldKey]: !prevValue[fieldKey] }

      if (fieldKey === 'displayCustomNameText') {
        if (!newValue[fieldKey]) {
          // Remove text override if we untoggle it
          delete newValue['nameLabel']
          delete newValue['namePlaceholder']
        } else {
          // If we toggle name text override on then we want to make sure that we have initialized the name fields
          if (!newValue.nameLabel) {
            newValue.nameLabel = ''
          }
          if (!newValue.namePlaceholder) {
            newValue.namePlaceholder = ''
          }
        }
      }
      if (fieldKey === 'displayCustomEmailText') {
        if (!newValue[fieldKey]) {
          // Remove text override if we untoggle it
          delete newValue['emailLabel']
          delete newValue['emailPlaceholder']
        } else {
          // If we toggle email text override on then we want to make sure that we have initialized the email fields
          if (!newValue.emailLabel) {
            newValue.emailLabel = ''
          }
          if (!newValue.emailPlaceholder) {
            newValue.emailPlaceholder = ''
          }
        }
      }

      sdk.field.setValue(newValue)
      return newValue
    })
  }

  const displayNameField = value.displayNameField ?? true
  const displayEmailField = value.displayEmailField ?? true
  const displayCustomNameText = value.displayCustomNameText ?? false
  const displayCustomEmailText = value.displayCustomEmailText ?? false

  return (
    <Box>
      <Box>
        <Flex gap="16px">
          <FormControl>
            <FormLabel>Show name</FormLabel>
            <Checkbox
              onChange={() => {
                toggleCheckbox('displayNameField')
              }}
              isChecked={displayNameField}
            />
          </FormControl>
          {displayNameField && (
            <FormControl>
              <FormLabel>Overwrite name text</FormLabel>
              <Checkbox
                onChange={() => {
                  toggleCheckbox('displayCustomNameText')
                }}
                isChecked={displayCustomNameText}
              />
            </FormControl>
          )}
        </Flex>
        {displayNameField && displayCustomNameText && (
          <>
            <FormControl>
              <FormLabel>Name label</FormLabel>
              <TextInput
                isDisabled={!displayNameField}
                value={value.nameLabel}
                onChange={(ev) => {
                  updateTextValue('nameLabel', ev.target.value)
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Name placeholder</FormLabel>
              <TextInput
                isDisabled={!displayNameField}
                value={value.namePlaceholder}
                onChange={(ev) => {
                  updateTextValue('namePlaceholder', ev.target.value)
                }}
              />
            </FormControl>
          </>
        )}
      </Box>
      <Box>
        <Flex gap="16px">
          <FormControl>
            <FormLabel>Show email</FormLabel>
            <Checkbox
              onChange={() => {
                toggleCheckbox('displayEmailField')
              }}
              isChecked={displayEmailField}
            />
          </FormControl>
          {displayEmailField && (
            <FormControl>
              <FormLabel>Overwrite email text</FormLabel>
              <Checkbox
                onChange={() => {
                  toggleCheckbox('displayCustomEmailText')
                }}
                isChecked={displayCustomEmailText}
              />
            </FormControl>
          )}
        </Flex>
        {displayEmailField && displayCustomEmailText && (
          <>
            <FormControl>
              <FormLabel>Email label</FormLabel>
              <TextInput
                isDisabled={!displayEmailField}
                value={value.emailLabel}
                onChange={(ev) => {
                  updateTextValue('emailLabel', ev.target.value)
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Email placeholder</FormLabel>
              <TextInput
                isDisabled={!displayEmailField}
                value={value.emailPlaceholder}
                onChange={(ev) => {
                  updateTextValue('emailPlaceholder', ev.target.value)
                }}
              />
            </FormControl>
          </>
        )}
      </Box>
    </Box>
  )
}

export default FormDefaultNamespaceField
