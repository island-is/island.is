import { useState } from 'react'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import { Paragraph, Select } from '@contentful/f36-components'
import { useSDK } from '@contentful/react-apps-toolkit'

const AdminOnlyShortTextDropdown = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const [value, setValue] = useState(sdk.field.getValue())

  if (!sdk.user.spaceMembership.admin) {
    return <Paragraph>(Only admins can edit this field)</Paragraph>
  }

  return (
    <Select
      value={value}
      onChange={(ev) => {
        sdk.field.setValue(ev.target.value)
        setValue(ev.target.value)
      }}
    >
      {sdk.field.validations?.[0]?.in?.map((option) => (
        <Select.Option key={option} value={option}>
          {option}
        </Select.Option>
      ))}
    </Select>
  )
}

export default AdminOnlyShortTextDropdown
