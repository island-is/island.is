import { FieldExtensionSDK } from '@contentful/app-sdk'
import { useSDK } from '@contentful/react-apps-toolkit'
import { JsonEditor } from '@contentful/field-editor-json'
import { Paragraph } from '@contentful/f36-components'

const AdminOnlyJsonField = () => {
  const sdk = useSDK<FieldExtensionSDK>()

  if (!sdk.user.spaceMembership.admin) {
    return <Paragraph>(Only admins can edit this JSON field)</Paragraph>
  }

  return <JsonEditor field={sdk.field} isInitiallyDisabled={false} />
}

export default AdminOnlyJsonField
