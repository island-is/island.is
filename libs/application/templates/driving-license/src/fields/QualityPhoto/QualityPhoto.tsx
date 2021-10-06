import React, { FC } from 'react'

import {
  Box,
  Text,
  ContentBlock,
  AlertMessage,
} from '@island.is/island-ui/core'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

interface QualityPhotoData extends FieldBaseProps {
  data: {
    qualityPhoto: string
    success: boolean
  }
}

const Photo: FC<QualityPhotoData> = ({
  data,
  application,
}: QualityPhotoData) => {
  const { formatMessage } = useLocale()
  const { qualityPhoto } = data

  if (!qualityPhoto) {
    return null
  }

  const src = qualityPhoto
  return (
    <img
      alt={formatText(m.qualityPhotoAltText, application, formatMessage) || ''}
      src={src}
      id="myimage"
    />
  )
}

const QualityPhoto: FC<FieldBaseProps> = ({ application }) => {
  const { qualityPhoto } = application.externalData
  const { formatMessage } = useLocale()
  const photo = (qualityPhoto as unknown) as QualityPhotoData
  const img = Photo(photo)

  return (
    <Box marginBottom={4}>
      {photo.data.success ? (
        <Box>
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
        </Box>
      )}
    </Box>
  )
}

export { QualityPhoto }
