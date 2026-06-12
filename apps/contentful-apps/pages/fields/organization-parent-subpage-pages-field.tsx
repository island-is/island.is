import { useEffect } from 'react'
import type { EntryProps } from 'contentful-management'
import type { FieldExtensionSDK } from '@contentful/app-sdk'
import {
  CombinedLinkActions,
  MultipleEntryReferenceEditor,
} from '@contentful/field-editor-reference'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'

import { DEFAULT_LOCALE } from '../../constants'

const OrganizationParentSubpagePagesField = () => {
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
          // Link-existing is enforced by the entry picker (read) and the
          // back-reference update below (update), both scoped by the editor's
          // tag-based role policy. No need to gate the action on space admin.
          showLinkEntityAction: true,
        },
      }}
      onAction={async (action) => {
        if (action.type !== 'delete') return

        const subpage = await cma.entry.get({ entryId: action.id })

        const isSubpageConnectedToThisParentPage =
          subpage?.fields?.organizationParentSubpage?.[DEFAULT_LOCALE]?.sys
            ?.id === sdk.entry.getSys().id

        if (!isSubpageConnectedToThisParentPage) return

        // Clean up the parent page reference
        delete subpage.fields['organizationParentSubpage']
        await cma.entry.update(
          {
            entryId: action.id,
          },
          subpage,
        )
      }}
      renderCustomActions={(props) => (
        <CombinedLinkActions
          {...props}
          onLinkExisting={async () => {
            let entries: EntryProps[] = await sdk.dialogs.selectSingleEntry({
              contentTypes: ['organizationSubpage'],
            })
            entries = Array.isArray(entries) ? entries : [entries]
            entries = entries.filter((entry) => entry?.sys?.id) // Make sure the entries are non-empty

            const parentId =
              entries[0]?.fields?.organizationParentSubpage?.[DEFAULT_LOCALE]
                ?.sys?.id

            if (parentId) {
              const parentEntry = await cma.entry
                .get({
                  entryId: parentId,
                })
                .catch((error) => {
                  if (!error?.message?.includes('not be found')) {
                    sdk.notifier.warning(error.message)
                    throw error
                  }
                })

              if (
                parentEntry &&
                parentEntry.fields?.pages?.[DEFAULT_LOCALE]?.some(
                  (page) => page.sys.id === entries[0]?.sys.id,
                )
              ) {
                sdk.notifier.warning(
                  'Subpage could not be linked since it is already linked to a parent page',
                )
                return
              }
            }

            if (entries.length > 0) {
              const selectedEntry = entries[0]
              try {
                const entry = await cma.entry.get({
                  entryId: selectedEntry.sys.id,
                })
                entry.fields.organizationParentSubpage = {
                  [DEFAULT_LOCALE]: {
                    sys: { id: sdk.entry.getSys().id, linkType: 'Entry' },
                  },
                }
                await cma.entry.update(
                  {
                    entryId: entry.sys.id,
                  },
                  entry,
                )
                props.onLinkedExisting(entries)
              } catch (error) {
                sdk.notifier.warning(
                  error instanceof Error
                    ? error.message
                    : 'Subpage could not be linked. You might not have permission to edit it.',
                )
              }
            }
          }}
          onCreate={(contentTypeId) => {
            return cma.entry
              .create(
                {
                  contentTypeId: contentTypeId as string,
                  spaceId: sdk.ids.space,
                  environmentId: sdk.ids.environment,
                },
                {
                  fields: {
                    organizationParentSubpage: {
                      [DEFAULT_LOCALE]: {
                        sys: { id: sdk.entry.getSys().id, linkType: 'Entry' },
                      },
                    },
                  },
                },
              )
              .then((entry) => {
                props.onCreated(entry)
                sdk.navigator.openEntry(entry.sys.id, { slideIn: true })
              })
          }}
        />
      )}
    />
  )
}

export default OrganizationParentSubpagePagesField
