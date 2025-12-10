import { useEffect } from 'react'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import { MultipleEntryReferenceEditor } from '@contentful/field-editor-reference'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'

const TeamListTeamMembersField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const cma = useCMA()

  useEffect(() => {
    const unregister = sdk.field.onValueChanged((items) => {
      if (items?.length > 1) {
        sdk.window.startAutoResizer()
      } else {
        if (!items?.length) {
          sdk.window.stopAutoResizer()
          sdk.window.updateHeight(210)
        } else {
          sdk.window.stopAutoResizer()
          sdk.window.updateHeight(300)
        }
      }
    })

    return () => {
      unregister()
    }
  }, [sdk.field, sdk.window])

  return (
    <MultipleEntryReferenceEditor
      hasCardEditActions={false}
      viewType="link"
      sdk={sdk}
      isInitiallyDisabled={false}
      parameters={{
        instance: {
          showCreateEntityAction: true,
          showLinkEntityAction: false,
        },
      }}
      onAction={async (action) => {
        if (action.type === 'delete') {
          try {
            const entryId = action.id

            const entry = await cma.entry.get({ entryId })

            if (entry.sys.publishedVersion) {
              await cma.entry.unpublish({ entryId })
            }

            await cma.entry.archive({
              entryId,
            })

            sdk.notifier.success(
              'Team member has been archived and removed from the list',
            )
          } catch (error) {
            console.error(error)
            sdk.notifier.warning(
              'Team member was removed from list but could not be archived',
            )
          }
        }
      }}
    />
  )
}

export default TeamListTeamMembersField
