import { useEffect, useState } from 'react'
import { ContentTypeProps, EntryProps } from 'contentful-management'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import { Flex, Spinner } from '@contentful/f36-components'
import {
  CombinedLinkActions,
  MultipleEntryReferenceEditor,
  SingleEntryReferenceEditor,
} from '@contentful/field-editor-reference'
import { LinkActionsProps } from '@contentful/field-editor-reference/dist/types/components'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'

import { DEFAULT_LOCALE } from '../../constants'

const RETRY_COUNT = 5

const getSubpageContentTypeId = (pageContentTypeId?: string) => {
  if (pageContentTypeId === 'organizationPage') return 'organizationSubpage'
  if (pageContentTypeId === 'projectPage') return 'projectSubpage'
  return null
}

interface SubpageData {
  pageAbove: EntryProps | null
  subpageContentType: ContentTypeProps | null
  loading: boolean
}

const useSubpageData = (): SubpageData => {
  const sdk = useSDK<FieldExtensionSDK>()
  const cma = useCMA()
  const [data, setData] = useState<SubpageData>({
    pageAbove: null,
    subpageContentType: null,
    loading: true,
  })

  useEffect(() => {
    const fetchPageAbove = async (
      pageAboveContentTypeId: string,
    ): Promise<boolean> => {
      const pageAboveResponse = await cma.entry.getMany({
        query: {
          links_to_entry: sdk.entry.getSys().id,
          content_type: pageAboveContentTypeId,
        },
      })

      if (pageAboveResponse.items.length > 0) {
        const pageAboveEntry = pageAboveResponse.items[0]

        const subpageContentTypeId = getSubpageContentTypeId(
          pageAboveEntry.sys.contentType.sys.id,
        )

        setData({
          loading: false,
          pageAbove: pageAboveEntry,
          subpageContentType: subpageContentTypeId
            ? await cma.contentType.get({
                contentTypeId: subpageContentTypeId,
              })
            : null,
        })
        return true
      }
      return false
    }

    const main = async () => {
      let success = false

      for (let i = 0; i < RETRY_COUNT; i += 1) {
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve('')
          }, (i + 1) * 1000)
        })

        try {
          const results = await Promise.allSettled(
            // Check for all possible pages and whether they are linking to us
            [fetchPageAbove('organizationPage'), fetchPageAbove('projectPage')],
          )
          const subpageDataWasFound = results.some(
            (result) => result.status === 'fulfilled' && result.value,
          )
          if (subpageDataWasFound) {
            success = true
            break
          }
        } catch (error) {
          console.error(error)
        }
      }
      if (!success) {
        setData({
          loading: false,
          pageAbove: null,
          subpageContentType: null,
        })
      }
    }

    main()
  }, [cma.contentType, cma.entry, sdk.entry])

  return data
}

const LinkGroupLinkField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const cma = useCMA()

  const {
    loading: loadingSubpageData,
    pageAbove,
    subpageContentType,
  } = useSubpageData()

  const [linkContentType, setLinkContentType] =
    useState<ContentTypeProps | null>(null)

  // Handle iframe resizing when item count changes
  useEffect(() => {
    const unregister = sdk.field.onValueChanged((items) => {
      if (items?.length > 1) {
        sdk.window.startAutoResizer()
      } else {
        sdk.window.stopAutoResizer()
        sdk.window.updateHeight(!items?.length ? 240 : 340)
      }
    })

    return () => {
      unregister()
    }
  }, [sdk.field, sdk.window])

  useEffect(() => {
    cma.contentType
      .get({
        contentTypeId: 'link',
      })
      .then((response) => {
        setLinkContentType(response)
      })
  }, [cma.contentType])

  const handleCreateEntry = async (
    contentTypeId: string,
    props: LinkActionsProps,
  ) => {
    let fields = {}

    if (
      contentTypeId === 'organizationSubpage' &&
      pageAbove?.sys?.contentType?.sys?.id === 'organizationPage'
    ) {
      fields = {
        organizationPage: {
          [DEFAULT_LOCALE]: {
            sys: {
              id: pageAbove.sys.id,
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

      if (
        contentTypeId === 'projectSubpage' &&
        pageAbove?.sys?.contentType?.sys?.id === 'projectPage'
      ) {
        const data = await cma.entry.get({
          contentTypeId: 'projectPage',
          entryId: pageAbove.sys.id,
        })
        if (data) {
          data.fields.projectSubpages[DEFAULT_LOCALE].push({
            sys: {
              id: entry.sys.id,
              linkType: 'Entry',
              type: 'Link',
            },
          })
          cma.entry.update({ entryId: data.sys.id }, data)
        }
      }
    } catch (error) {
      console.error('Error creating entry:', error)
    }
  }

  const handleLinkExisting = (props: LinkActionsProps) => {
    const contentTypeToSelect = getSubpageContentTypeId(
      pageAbove?.sys?.contentType?.sys?.id,
    )

    const selectEntriesFunction =
      sdk.ids.field === 'primaryLink'
        ? sdk.dialogs.selectSingleEntry
        : sdk.dialogs.selectMultipleEntries

    selectEntriesFunction({
      contentTypes: contentTypeToSelect
        ? [contentTypeToSelect, 'link']
        : ['link'],
    }).then((entries: EntryProps[]) => {
      entries = Array.isArray(entries) ? entries : [entries]
      entries = entries.filter((entry) => entry?.sys?.id) // Make sure the entries are non-empty
      props.onLinkedExisting(entries)
    })
  }

  if (!linkContentType || loadingSubpageData) {
    return (
      <Flex paddingTop="spacingM" justifyContent="center">
        <Spinner />
      </Flex>
    )
  }

  const selectableContentTypes = subpageContentType
    ? [subpageContentType, linkContentType]
    : [linkContentType]

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
            showLinkEntityAction: selectableContentTypes.length > 1,
          },
        }}
        renderCustomActions={(props) => (
          <CombinedLinkActions
            {...props}
            canLinkEntity={true}
            canCreateEntity={true}
            contentTypes={selectableContentTypes}
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
          showLinkEntityAction: selectableContentTypes.length > 1,
        },
      }}
      renderCustomActions={(props) => (
        <CombinedLinkActions
          {...props}
          canLinkEntity={true}
          canCreateEntity={true}
          contentTypes={selectableContentTypes}
          onLinkExisting={() => handleLinkExisting(props)}
          onCreate={(contentTypeId) => handleCreateEntry(contentTypeId, props)}
        />
      )}
    />
  )
}

export default LinkGroupLinkField
