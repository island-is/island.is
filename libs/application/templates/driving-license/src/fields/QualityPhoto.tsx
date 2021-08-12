import React, { FC } from 'react'

import { useLocale } from '@island.is/localization'
import format from 'date-fns/format'

import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import { MessageDescriptor } from '@formatjs/intl'

interface QualityPhotoData {
    data: {
        qualityPhoto: string
    }
}

const QualityPhoto: FC<FieldBaseProps> = ({ application }) => {
  const {
    qualityPhoto
  } = application.externalData

  if (!qualityPhoto) {
      return null
  }

  const photo = (qualityPhoto as unknown)as QualityPhotoData
  const src = "data:image/jpg;base64," + photo.data.qualityPhoto.substr(1, photo.data.qualityPhoto.length - 2)
  console.log(src)
  return (
    <Box marginBottom={10}>
      <Box
        display={['block', 'block', 'block', 'flex']}
        justifyContent="spaceBetween"
      ></Box>
      <img src={src} id="myimage" />
      <Box marginTop={7} marginBottom={8}></Box>
    </Box>
  )
}

export { QualityPhoto }
