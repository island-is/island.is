import React, { FC } from 'react'

import {
  Box,
  Text,
  ContentBlock,
  AlertMessage,
} from '@island.is/island-ui/core'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { m } from '../lib/messages'
import { useLocale } from '@island.is/localization'

interface QualityPhotoData {
  data: {
    qualityPhoto: string
    success: boolean
  }
}

const Photo = ({ data }: QualityPhotoData) => {
  const { qualityPhoto } = data
  if (qualityPhoto) {
    const src =
      'data:image/jpg;base64,' + qualityPhoto.substr(1, qualityPhoto.length - 2)
    return <img src={src} id="myimage" />
  }
  return null
}

const QualityPhoto: FC<FieldBaseProps> = ({ application }) => {
  const { qualityPhoto } = application.externalData
  const { formatMessage } = useLocale()
  const photo = (qualityPhoto as unknown) as QualityPhotoData
  const img = Photo(photo)

  return (
    <Box marginBottom={4}>
      {photo.data.success ? (
        <Box marginBottom={8}>
          <Text>
            {formatText(m.qualityPhotoSubTitle, application, formatMessage)}
          </Text>
          <Box marginTop={4} style={{ width: '191px', height: '242px' }}>
            {img}
          </Box>
        </Box>
      ) : (
        <Box marginTop={2}>
          <ContentBlock>
            <AlertMessage
              type="warning"
              title={formatText(
                m.qualityPhotoWarningTitle,
                application,
                formatMessage,
              )}
              message={formatText(
                m.qualityPhotoWarningDescription,
                application,
                formatMessage,
              )}
            />
          </ContentBlock>
          <Box marginTop={6}>
            <Text>
              {formatText(
                m.qualityPhotoInstructions,
                application,
                formatMessage,
              )}
            </Text>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default QualityPhoto
