import { FieldExtensionSDK } from '@contentful/app-sdk'
import { Paragraph } from '@contentful/f36-components'
import { BooleanEditor } from '@contentful/field-editor-boolean'
import { useSDK } from '@contentful/react-apps-toolkit'

const AdminOnlyBooleanField = () => {
  const sdk = useSDK<FieldExtensionSDK>()

  if (!sdk.user.spaceMembership.admin) {
    return <Paragraph>(Only admins can edit this field)</Paragraph>
  }

  return <BooleanEditor field={sdk.field} isInitiallyDisabled={false} />
}

export default AdminOnlyBooleanField
