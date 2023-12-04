import { useEffect, useState } from 'react'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import { Button, Stack } from '@contentful/f36-components'
import { CycleIcon } from '@contentful/f36-icons'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'

import { CONTENTFUL_ENVIRONMENT, CONTENTFUL_SPACE } from '../../constants'
import { ResponseData } from '../api/get-embedded-video-thumbnail-url'

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
  const [assetId, setAssetId] = useState<string>(sdk.field.getValue()?.sys?.id)
  const [assetUrl, setAssetUrl] = useState('')

  const url = sdk.entry.fields.url.getValue()

  useEffect(() => {
    sdk.window.startAutoResizer()
  }, [sdk.window])

  useEffect(() => {
    if (!assetId) {
      return
    }
    cma.asset
      .get({
        environmentId: 'stefna' || CONTENTFUL_ENVIRONMENT,
        spaceId: CONTENTFUL_SPACE,
        assetId,
      })
      .then((response) => {
        setAssetUrl(response.fields.file[sdk.field.locale].url)
      })
  }, [assetId, cma.asset, sdk.field.locale])

  return (
    <Stack flexDirection="column">
      <Button
        startIcon={<CycleIcon />}
        onClick={async () => {
          const thumbnailUrl = await fetchVideoThumbnailUrl(url)

          const locales = Object.keys(sdk.locales.names)

          const asset = await cma.asset.create(
            {
              environmentId: 'stefna' || CONTENTFUL_ENVIRONMENT,
              spaceId: CONTENTFUL_SPACE,
            },
            {
              fields: {
                title: locales.reduce(
                  (acc, locale) => ({ ...acc, [locale]: thumbnailUrl }),
                  {},
                ),
                file: locales.reduce(
                  (acc, locale) => ({
                    ...acc,
                    [locale]: {
                      fileName: thumbnailUrl,
                      upload: thumbnailUrl,
                      contentType: '',
                    },
                  }),
                  {},
                ),
              },
            },
          )

          const processedAsset = await cma.asset.processForAllLocales(
            {
              environmentId: 'stefna' || CONTENTFUL_ENVIRONMENT,
              spaceId: CONTENTFUL_SPACE,
            },
            asset,
          )

          await cma.asset.publish(
            {
              assetId: processedAsset.sys.id,
              environmentId: 'stefna' || CONTENTFUL_ENVIRONMENT,
              spaceId: CONTENTFUL_SPACE,
            },
            processedAsset,
          )

          // TODO: debug why this isn't working
          sdk.field.setValue(processedAsset.sys.id)
          setAssetId(processedAsset.sys.id)
        }}
      >
        Fetch thumbnail
      </Button>
      {JSON.stringify(sdk.field.getValue())}
      <img src={assetUrl} alt="" />
    </Stack>
  )
}

export default EmbeddedVideoThumbnailImageField
