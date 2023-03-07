import { useEffect } from 'react'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'
import {
  CombinedLinkActions,
  MultipleEntryReferenceEditor,
} from '@contentful/field-editor-reference'

const ArticleSubArticlesField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const cma = useCMA()

  useEffect(() => {
    sdk.window.startAutoResizer()
  }, [sdk.window])

  return (
    <MultipleEntryReferenceEditor
      css={{ overflow: 'hidden' }}
      hasCardEditActions={false}
      viewType="link"
      sdk={sdk}
      isInitiallyDisabled={false}
      parameters={{
        instance: {
          showCreateEntityAction: true,
          showLinkEntityAction: true,
        },
      }}
      renderCustomActions={(props) => (
        <CombinedLinkActions
          {...props}
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
                    parent: {
                      'is-IS': {
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

export default ArticleSubArticlesField
