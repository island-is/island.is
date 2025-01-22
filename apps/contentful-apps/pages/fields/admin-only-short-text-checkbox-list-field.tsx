import { useState } from 'react'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import { Box, Checkbox, Paragraph } from '@contentful/f36-components'
import { useSDK } from '@contentful/react-apps-toolkit'

const AdminOnlyShortTextCheckBoxListField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const [currentValue, setCurrentValue] = useState<(number | string)[]>(
    sdk?.field?.getValue() ?? [],
  )

  if (!sdk?.user?.spaceMembership?.admin)
    return <Paragraph>(Only admins can edit this field)</Paragraph>

  return (
    <Box paddingBottom={'spacingM'}>
      {sdk.field.items?.validations?.[0].in?.map((value) => {
        return (
          <Checkbox
            onChange={() => {
              if (!currentValue.includes(value)) {
                const newValue = currentValue.concat(value)
                sdk.field.setValue(newValue)
                setCurrentValue(newValue)
              } else {
                const newValue = currentValue.filter((v) => v !== value)
                sdk.field.setValue(newValue)
                setCurrentValue(newValue)
              }
            }}
            key={value}
            isChecked={currentValue.includes(value)}
          >
            {value}
          </Checkbox>
        )
      })}
    </Box>
  )
}

export default AdminOnlyShortTextCheckBoxListField
