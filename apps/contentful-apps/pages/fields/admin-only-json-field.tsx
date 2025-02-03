import { FieldExtensionSDK } from '@contentful/app-sdk'
import { Paragraph } from '@contentful/f36-components'
import { JsonEditor } from '@contentful/field-editor-json'
import { useSDK } from '@contentful/react-apps-toolkit'

const AdminOnlyJsonField = () => {
  const sdk = useSDK<FieldExtensionSDK>()

  if (!sdk.user.spaceMembership.admin) {
    return <Paragraph>(Only admins can edit this JSON field)</Paragraph>
  }

  return <JsonEditor field={sdk.field} isInitiallyDisabled={false} />
}

export default AdminOnlyJsonField
