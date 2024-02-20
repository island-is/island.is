import { useEffect, useState } from 'react'
import { ContentTypeProps } from 'contentful-management'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import {
  CombinedLinkActions,
  MultipleEntryReferenceEditor,
  SingleEntryReferenceEditor,
} from '@contentful/field-editor-reference'
import { LinkActionsProps } from '@contentful/field-editor-reference/dist/types/components'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'

import { DEFAULT_LOCALE } from '../../constants'

const LinkGroupLinkField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const cma = useCMA()
  const [parentItemId, setParentItemId] = useState<string>()
  const [contentType, setContentType] = useState<string>()
  const [contentTypeId, setContentTypeId] = useState<string>()
  const [organizationSubpageContentType, setorganizationSubpageContentType] =
    useState<ContentTypeProps>()
  const [projectSubpageContentType, setprojectSubpageContentType] =
    useState<ContentTypeProps>()

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

    const fetchSubpageContentType = (
      contentType: string,
      contentTypeId: string,
    ) => {
      cma.entry
        .getMany({
          query: {
            links_to_entry: sdk.entry.getSys().id,
            content_type: contentType,
          },
        })
        .then((response) => {
          if (response.items.length > 0) {
            setParentItemId(response.items[0].sys.id)
            setContentType(contentType)
            setContentTypeId(contentTypeId)
          }
        })
    }

    fetchSubpageContentType('organizationPage', 'organizationSubpage')
    fetchSubpageContentType('projectPage', 'projectSubpage')

    return () => {
      unregister()
    }
  }, [cma.entry, sdk.entry, sdk.field, sdk.window])

  useEffect(() => {
    if (contentType) {
      cma.contentType.get({ contentTypeId: contentTypeId }).then((data) => {
        contentType === 'organizationPage'
          ? setorganizationSubpageContentType(data)
          : setprojectSubpageContentType(data)
      })
    }
  }, [cma.contentType, contentTypeId, contentType])

  const handleCreateEntry = async (
    contentTypeId: string,
    props: LinkActionsProps,
  ) => {
    let fields = {}
    if (contentTypeId === 'organizationSubpage') {
      fields = {
        organizationPage: {
          [DEFAULT_LOCALE]: {
            sys: {
              id: parentItemId,
              linkType: 'Entry',
            },
          },
        },
      }
    }
    try {
      const entry = await cma.entry.create(
        {
          contentTypeId: contentTypeId,
          spaceId: sdk.ids.space,
          environmentId: sdk.ids.environment,
        },
        {
          fields: fields,
        },
      )
      props.onCreated(entry)
      sdk.navigator.openEntry(entry.sys.id, { slideIn: true })
    } catch (error) {
      console.error('Error creating entry:', error)
    }
  }

  const handleLinkExisting = (props) => {
    const contentTypeToSelect =
      contentType === 'organizationPage'
        ? 'organizationSubpage'
        : contentType === 'projectPage'
        ? 'projectSubpage'
        : null

    const selectEntriesFunction =
      sdk.ids.field === 'primaryLink'
        ? sdk.dialogs.selectSingleEntry
        : sdk.dialogs.selectMultipleEntries

    selectEntriesFunction({
      contentTypes: contentTypeToSelect ? [contentTypeToSelect] : [],
    }).then((entries) => {
      props.onLinkedExisting(Array.isArray(entries) ? entries : [entries])
    })
  }

  const getContentTypes = (
    contentType: string,
    organizationSubpageContentType: ContentTypeProps,
    projectSubpageContentType: ContentTypeProps,
  ) => {
    if (contentType === 'organizationPage' && organizationSubpageContentType) {
      return [organizationSubpageContentType]
    } else if (projectSubpageContentType) {
      return [projectSubpageContentType]
    } else {
      return []
    }
  }

  if (sdk.ids.field === 'primaryLink') {
    return (
      <SingleEntryReferenceEditor
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
            contentTypes={getContentTypes(contentType, organizationSubpageContentType, projectSubpageContentType)}
            onLinkExisting={() => handleLinkExisting(props)}
            onCreate={(contentTypeId) =>
              handleCreateEntry(contentTypeId, props)
            }
          />
        )}
      />
    )
  }

  return (
    <MultipleEntryReferenceEditor
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
          contentTypes={getContentTypes(contentType, organizationSubpageContentType, projectSubpageContentType)}
          onLinkExisting={() => handleLinkExisting(props)}
          onCreate={(contentTypeId) => handleCreateEntry(contentTypeId, props)}
        />
      )}
    />
  )
}

export default LinkGroupLinkField
