import { Paragraph } from '@contentful/f36-components'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import { useSDK } from '@contentful/react-apps-toolkit'
import { SingleEntryReferenceEditor } from '@contentful/field-editor-reference'

const AdminOnlySingleReferenceField = () => {
  const sdk = useSDK<FieldExtensionSDK>()

  if (!sdk.user.spaceMembership.admin) {
    return <Paragraph>(Only admins can edit this field)</Paragraph>
  }

  return (
    <SingleEntryReferenceEditor
      sdk={sdk}
      viewType="card"
      hasCardEditActions={true}
      parameters={{
        instance: {
          bulkEditing: false,
          showCreateEntityAction: false,
          showLinkEntityAction: true,
        },
      }}
    />
  )
}

export default AdminOnlySingleReferenceField
