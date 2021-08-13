import React, { FC } from 'react'

import { Box, Text} from '@island.is/island-ui/core'
import {
    FieldBaseProps,
  } from '@island.is/application/core'

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
      <Box marginBottom={8}>
        {photo.data.success && <Text>Hér er núverandi ljósmynd í ökuskírteinaskrá</Text>}
        <Box marginTop={4} style={{ width: '191px', height: '242px' }}>{img}</Box>
      </Box>
    </Box>
  )
}

export { QualityPhoto }
