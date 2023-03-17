import { FieldExtensionSDK } from '@contentful/app-sdk'
import { useSDK } from '@contentful/react-apps-toolkit'
import { CheckboxEditor } from '@contentful/field-editor-checkbox'
import { useEffect } from 'react'

const ActiveTranslationsField = () => {
  const sdk = useSDK<FieldExtensionSDK>()

  useEffect(() => {
    sdk.field.onValueChanged((value) => {
      if (!value) sdk.field.setValue([])
    })
  }, [sdk.field])

  return (
    <CheckboxEditor
      field={sdk.field}
      locales={sdk.locales}
      isInitiallyDisabled={false}
    />
  )
}

export default ActiveTranslationsField
