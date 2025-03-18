import React, { FC } from 'react'

import {
  Box,
  Text,
  AlertMessage,
  SkeletonLoader,
} from '@island.is/island-ui/core'
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
}: QualityPhotoData) => {
  const { formatMessage } = useLocale()

  if (!qualityPhoto) {
    return null
  }

  const src = qualityPhoto
  return (
    <img
      alt={formatMessage(m.qualityPhotoAltText) || ''}
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
          <Text>{formatMessage(m.qualityPhotoSubTitle)}</Text>
          <Box marginTop={4} style={{ width: '191px', height: '242px' }}>
            {img}
          </Box>
        </Box>
      ) : (
        <AlertMessage
          type="warning"
          title={formatMessage(m.qualityPhotoWarningTitle)}
          message={formatMessage(m.qualityPhotoWarningDescription)}
        />
      )}
    </Box>
  )
}

export { QualityPhoto }
