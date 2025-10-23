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
          showLinkEntityAction: sdk.user.spaceMembership.admin,
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
            if (entries[0]?.fields?.organizationParentSubpage) {
              sdk.notifier.warning(
                'Subpage could not be linked since it is already linked to a parent page',
              )
            } else if (entries.length > 0) {
              const selectedEntry = entries[0]
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
