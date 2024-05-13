import { useEffect } from 'react'
import type { EntryProps } from 'contentful-management'
import type { FieldExtensionSDK } from '@contentful/app-sdk'
import {
  CombinedLinkActions,
  SingleEntryReferenceEditor,
} from '@contentful/field-editor-reference'
import { useSDK } from '@contentful/react-apps-toolkit'

const parameters = {
  instance: {
    showCreateEntityAction: false,
    showLinkEntityAction: true,
  },
}

const CustomPageParentField = () => {
  const sdk = useSDK<FieldExtensionSDK>()

  useEffect(() => {
    sdk.window.startAutoResizer()
  }, [sdk.window])

  return (
    <SingleEntryReferenceEditor
      sdk={sdk}
      viewType="link"
      hasCardEditActions={false}
      parameters={parameters}
      renderCustomActions={(props) => (
        <CombinedLinkActions
          {...props}
          canLinkEntity={true}
          canCreateEntity={false}
          onLinkExisting={async () => {
            let entries: EntryProps[] = await sdk.dialogs.selectSingleEntry({
              contentTypes: ['customPage'],
            })
            entries = Array.isArray(entries) ? entries : [entries]
            entries = entries.filter((entry) => entry?.sys?.id) // Make sure the entries are non-empty

            if (entries[0]?.sys?.id === sdk.entry.getSys().id) {
              sdk.notifier.warning('Custom page parent can not be itself!')
            } else if (entries.length > 0) {
              props.onLinkedExisting(entries)
            }
          }}
        />
      )}
    />
  )
}

export default CustomPageParentField
