import { useEffect } from 'react'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import {
  CombinedLinkActions,
  MultipleEntryReferenceEditor,
} from '@contentful/field-editor-reference'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'

import { DEFAULT_LOCALE } from '../../constants'

const ArticleSubArticlesField = () => {
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

export default ArticleSubArticlesField
