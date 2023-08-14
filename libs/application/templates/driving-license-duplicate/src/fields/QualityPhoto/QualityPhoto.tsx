import React, { FC } from 'react'

import { Box, SkeletonLoader } from '@island.is/island-ui/core'
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
  const { qualityPhoto } = useQualityPhoto(application)
  const img = Photo({ qualityPhoto, application })
  return (
    <Box
      marginTop={4}
      marginBottom={3}
      style={{ width: '191px', height: '242px' }}
    >
      {qualityPhoto ? img : <SkeletonLoader height={242} width={191} />}
    </Box>
  )
}

export { QualityPhoto }
