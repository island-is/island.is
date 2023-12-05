import { useEffect, useState } from 'react'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import { Box, Button, Stack } from '@contentful/f36-components'
import { CycleIcon } from '@contentful/f36-icons'
import { SingleMediaEditor } from '@contentful/field-editor-reference'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'

import { CONTENTFUL_ENVIRONMENT, CONTENTFUL_SPACE } from '../../constants'
import type { ResponseData } from '../api/get-embedded-video-thumbnail-url'

const fetchVideoThumbnailUrl = async (videoUrl: string) => {
  const response = await fetch(
    `/api/get-embedded-video-thumbnail-url?videoUrl=${videoUrl}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
  const data: ResponseData = await response.json()
  return data?.thumbnailUrl
}

const EmbeddedVideoThumbnailImageField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const cma = useCMA()
  const [assetId, setAssetId] = useState<string>(
    sdk.field.getValue()?.sys?.id ?? '',
  )
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    sdk.window.startAutoResizer()
  }, [sdk.window])

  const fetchThumbnail = async () => {
    const thumbnailUrl = await fetchVideoThumbnailUrl(
      sdk.entry.fields.url.getValue(),
    )

    const locales = Object.keys(sdk.locales.names)

    const config = {
      environmentId: 'stefna' || CONTENTFUL_ENVIRONMENT,
      spaceId: CONTENTFUL_SPACE,
    }

    const asset = await cma.asset.create(config, {
      fields: {
        title: locales.reduce(
          (acc, locale) => ({
            ...acc,
            [locale]: sdk.entry.fields.title.getValue(locale) || thumbnailUrl,
          }),
          {},
        ),
        file: locales.reduce(
          (acc, locale) => ({
            ...acc,
            [locale]: {
              // Filename is the last 50 characters of the url
              fileName: thumbnailUrl.slice(-50),
              upload: thumbnailUrl,
              contentType: '',
            },
          }),
          {},
        ),
      },
    })

    const processedAsset = await cma.asset.processForAllLocales(config, asset)

    await cma.asset.publish(
      {
        ...config,
        assetId: processedAsset.sys.id,
      },
      processedAsset,
    )

    sdk.field.setValue({
      sys: {
        type: 'Link',
        linkType: 'Asset',
        id: processedAsset.sys.id,
      },
    })
    setAssetId(processedAsset.sys.id)
  }

  return (
    <Stack
      paddingBottom="spacing3Xl"
      flexDirection={!assetId ? 'row' : 'column'}
      justifyContent="flex-start"
      alignItems="flex-start"
      spacing="spacingXl"
    >
      {!assetId && (
        <Box style={{ marginTop: '12px' }}>
          <Button
            startIcon={<CycleIcon />}
            isLoading={loading}
            size="small"
            onClick={async () => {
              setLoading(true)
              try {
                await fetchThumbnail()
                sdk.notifier.success('Thumbnail image has been updated')
              } catch (error) {
                sdk.notifier.error('Thumbnail image could not be updated')
                console.error(error)
              }
              setLoading(false)
            }}
          >
            Fetch thumbnail
          </Button>
        </Box>
      )}

      <Box paddingTop={assetId ? 'spacingS' : 'none'}>
        <SingleMediaEditor
          parameters={{
            instance: {
              bulkEditing: false,
              showCreateEntityAction: true,
              showLinkEntityAction: true,
            },
          }}
          sdk={sdk}
          viewType="card"
          actionLabels={{
            createNew: () => 'Create new asset',
          }}
          onAction={(action) => {
            if (action.type === 'delete') {
              setAssetId('')
            } else if (
              action.type === 'create_and_link' ||
              action.type === 'select_and_link'
            ) {
              setAssetId(action.entityData.sys.id)
            }
          }}
        />
      </Box>
    </Stack>
  )
}

export default EmbeddedVideoThumbnailImageField
