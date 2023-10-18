import React, { FC } from 'react'

import {
  Box,
  Text,
  ContentBlock,
  AlertMessage,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { formatText } from '@island.is/application/core'
import { Application, FieldBaseProps } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { useQualityPhoto } from './hooks/useQualityPhoto'
interface QualityPhotoData {
  qualityPhoto: string | null
  application: Application
}

const Photo: FC<React.PropsWithChildren<QualityPhotoData>> = ({
  qualityPhoto,
  application,
}: QualityPhotoData) => {
  const { formatMessage } = useLocale()

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

const QualityPhoto: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { qualityPhoto, loading } = useQualityPhoto(application)
  const { formatMessage } = useLocale()
  const img =
    qualityPhoto !== 'fake' ? Photo({ qualityPhoto, application }) : null

  return (
    <Box marginBottom={4}>
      {loading || qualityPhoto === 'fake' ? (
        <SkeletonLoader height={242} width={191} />
      ) : qualityPhoto ? (
        <Box>
          <Text>
            {formatText(m.qualityPhotoSubTitle, application, formatMessage)}
          </Text>
          <Box marginTop={4} style={{ width: '191px', height: '242px' }}>
            {img}
          </Box>
        </Box>
      ) : (
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
      )}
    </Box>
  )
}

export { QualityPhoto }
