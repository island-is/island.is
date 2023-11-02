import { useEffect, useState } from 'react'
import { EntryProps, KeyValueMap } from 'contentful-management'
import { CMAClient, SidebarExtensionSDK } from '@contentful/app-sdk'
import { Button, Text } from '@contentful/f36-components'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'
import {
  CONTENTFUL_ENVIRONMENT,
  CONTENTFUL_SPACE,
  DEFAULT_LOCALE,
  DEV_WEB_BASE_URL,
} from '../../constants'

const previewLinkHandler = {
  vacancy: (entry: EntryProps<KeyValueMap>) => {
    return `${DEV_WEB_BASE_URL}/starfatorg/c-${entry.sys.id}`
  },
  article: (entry: EntryProps<KeyValueMap>) => {
    return `${DEV_WEB_BASE_URL}/${entry.fields.slug[DEFAULT_LOCALE]}`
  },
  subArticle: async (entry: EntryProps<KeyValueMap>, cma: CMAClient) => {
    const parentArticleId = entry.fields.parent?.[DEFAULT_LOCALE]?.sys?.id
    const parentArticle = await cma.entry.get({
      entryId: parentArticleId,
      environmentId: CONTENTFUL_ENVIRONMENT,
      spaceId: CONTENTFUL_SPACE,
    })
    return `${DEV_WEB_BASE_URL}/${
      parentArticle?.fields?.slug[DEFAULT_LOCALE]
    }/${entry.fields.url[DEFAULT_LOCALE]?.split('/')?.pop() ?? ''}`
  },
  organizationPage: (entry: EntryProps<KeyValueMap>) => {
    return `${DEV_WEB_BASE_URL}/s/${entry.fields.slug[DEFAULT_LOCALE]}`
  },
  projectPage: (entry: EntryProps<KeyValueMap>) => {
    return `${DEV_WEB_BASE_URL}/v/${entry.fields.slug[DEFAULT_LOCALE]}`
  },
  organizationSubpage: async (
    entry: EntryProps<KeyValueMap>,
    cma: CMAClient,
  ) => {
    const organizationPageId =
      entry.fields.organizationPage?.[DEFAULT_LOCALE]?.sys?.id
    const organizationPage = await cma.entry.get({
      entryId: organizationPageId,
      environmentId: CONTENTFUL_ENVIRONMENT,
      spaceId: CONTENTFUL_SPACE,
    })
    return `${DEV_WEB_BASE_URL}/s/${organizationPage?.fields?.slug?.[DEFAULT_LOCALE]}/${entry.fields.slug[DEFAULT_LOCALE]}`
  },
  lifeEventPage: (entry: EntryProps<KeyValueMap>) => {
    const middlePart =
      entry.fields.pageType?.[DEFAULT_LOCALE] === 'Digital Iceland Service'
        ? 's/stafraent-island/thjonustur'
        : 'lifsvidburdir'

    return `${DEV_WEB_BASE_URL}/${middlePart}/${entry.fields.slug[DEFAULT_LOCALE]}`
  },
  news: (entry: EntryProps<KeyValueMap>) => {
    return `${DEV_WEB_BASE_URL}/frett/${entry.fields.slug[DEFAULT_LOCALE]}`
  },
}

const PreviewLinkSidebar = () => {
  const sdk = useSDK<SidebarExtensionSDK>()
  const cma = useCMA()

  const [contentTypeLinkExists, setContentTypeLinkExists] = useState(true)

  useEffect(() => {
    setContentTypeLinkExists(
      sdk.entry.getSys().contentType.sys.id in previewLinkHandler,
    )
  }, [sdk.entry])

  return (
    <div style={{ display: 'flex', flexFlow: 'column nowrap', gap: '8px' }}>
      <Button
        isFullWidth={true}
        isDisabled={!contentTypeLinkExists}
        onClick={async () => {
          const contentTypeId = sdk.contentType.sys.id

          if (contentTypeId in previewLinkHandler) {
            const entry = await cma.entry.get({
              entryId: sdk.entry.getSys().id,
              environmentId: CONTENTFUL_ENVIRONMENT,
              spaceId: CONTENTFUL_SPACE,
            })

            const bypassCacheSecret =
              sdk.parameters.instance['bypassCacheSecret']

            const queryParams = bypassCacheSecret
              ? `?bypass-cache=${bypassCacheSecret}`
              : ''

            const url = await previewLinkHandler[contentTypeId](entry, cma)

            window.open(`${url}${queryParams}`, '_blank')
          }
        }}
      >
        Preview in a new tab
      </Button>
      {!contentTypeLinkExists && (
        <Text style={{ color: '#b10505' }}>
          {sdk.entry.getSys().contentType.sys.id} has no preview link
        </Text>
      )}
    </div>
  )
}

export default PreviewLinkSidebar
