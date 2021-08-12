import React, { FC } from 'react'

import { useLocale } from '@island.is/localization'
import format from 'date-fns/format'

import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import { MessageDescriptor } from '@formatjs/intl'

interface QualityPhotoData {
  data: {
    qualityPhoto: string
    success: boolean
  }
}

const Photo = ({ data }: QualityPhotoData) => {
  const { qualityPhoto, success } = data
  if (success && qualityPhoto) {
    const src =
      'data:image/jpg;base64,' + qualityPhoto.substr(1, qualityPhoto.length - 2)
    return <img src={src} id="myimage" />
  }
  return null
}

const QualityPhoto: FC<FieldBaseProps> = ({ application }) => {
  const { qualityPhoto } = application.externalData
  const photo = (qualityPhoto as unknown) as QualityPhotoData
  const img = Photo(photo)

  return (
    <Box marginBottom={10}>
      <Box
        display={['block', 'block', 'block', 'flex']}
        justifyContent="spaceBetween"
      ></Box>
      <Box marginTop={7} marginBottom={8}>
        {img}
        {photo.data.success ? <Text>Það er til gæðamerkt mynd</Text> : <Text>Það er ekki til gæðamerkt mynd</Text>}
      </Box>
    </Box>
  )
}

export { QualityPhoto }
