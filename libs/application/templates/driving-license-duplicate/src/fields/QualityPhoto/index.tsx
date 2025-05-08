import React, { FC } from 'react'

import { Box, SkeletonLoader } from '@island.is/island-ui/core'
import { Application, FieldBaseProps } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { useQualityPhoto } from './useQualityPhoto'

interface QualityPhotoData {
  qualityPhoto: string | null
  application: Application
}

export const Photo: FC<React.PropsWithChildren<QualityPhotoData>> = ({
  qualityPhoto,
}: QualityPhotoData) => {
  const { formatMessage } = useLocale()

  if (!qualityPhoto) {
    return null
  }

  const src = qualityPhoto
  return (
    <img alt={formatMessage(m.qualityPhotoAltText)} src={src} id="myimage" />
  )
}

const QualityPhoto: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { qualityPhoto } = useQualityPhoto(application)
  const img = Photo({ qualityPhoto, application })
  return (
    <Box
      marginTop={2}
      marginBottom={3}
      style={{ width: '191px', height: '242px' }}
    >
      {qualityPhoto ? img : <SkeletonLoader height={242} width={191} />}
    </Box>
  )
}

export { QualityPhoto }
