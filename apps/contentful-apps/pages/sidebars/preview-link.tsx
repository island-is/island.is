import { useEffect, useState } from 'react'
import { SidebarExtensionSDK } from '@contentful/app-sdk'
import { Button, Text } from '@contentful/f36-components'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'

import { CONTENTFUL_ENVIRONMENT, CONTENTFUL_SPACE } from '../../constants'
import { previewLinkHandler } from '../../utils'

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
