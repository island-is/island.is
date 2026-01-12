import { useEffect } from 'react'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import { Paragraph } from '@contentful/f36-components'
import { SingleEntryReferenceEditor } from '@contentful/field-editor-reference'
import { useSDK } from '@contentful/react-apps-toolkit'

const AdminOnlySingleReferenceField = () => {
  const sdk = useSDK<FieldExtensionSDK>()

  useEffect(() => {
    sdk.window.startAutoResizer()
  }, [sdk.window])

  if (!sdk.user.spaceMembership.admin) {
    return (
      <>
        <Paragraph>(Only admins can edit this field)</Paragraph>
        <SingleEntryReferenceEditor
          isInitiallyDisabled={true}
          sdk={sdk}
          viewType="card"
          hasCardEditActions={false}
          hasCardRemoveActions={false}
          hasCardMoveActions={false}
          parameters={{
            instance: {
              bulkEditing: false,
              showCreateEntityAction: false,
              showLinkEntityAction: false,
            },
          }}
        />
      </>
    )
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
